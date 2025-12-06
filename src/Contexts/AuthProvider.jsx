// src/contexts/AuthProvider.jsx
import React, { useEffect, useState, useCallback } from "react";
import AuthContext from "./AuthContext";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile as firebaseUpdateProfile,
} from "firebase/auth";
import { firebaseConfig } from "../firebase/firebase.config";
import axios from "axios";

/**
 * AuthProvider
 * - Initialize Firebase auth
 * - Listen to Firebase auth state
 * - When logged in, send idToken to backend POST /api/auth/sync to upsert app user & get role/status
 * - Provide login/register/logout helpers for UI to call
 *
 * NOTE:
 * - Backend endpoint: POST ${VITE_API_URL}/api/auth/sync
 *   expects body: { idToken } and returns { user, token? }
 * - Server JWT (if returned) is stored in localStorage as 'appToken' for apiSecure usage.
 *   In production prefer httpOnly cookies.
 */

initializeApp(firebaseConfig);
const auth = getAuth();

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null); // raw firebase user
  const [user, setUser] = useState(null); // application user from backend (role/status)
  const [loading, setLoading] = useState(true);

  // Helper: sync firebase idToken with backend
  const syncWithBackend = useCallback(async (idToken) => {
    try {
      const API = import.meta.env.VITE_API_URL;
      if (!API) return;

      const res = await axios.post(`${API}/api/auth/sync`, { idToken });
      // Expect res.data.user and optionally res.data.token (server JWT)
      if (res?.data?.user) {
        setUser(res.data.user);
      }
      if (res?.data?.token) {
        // store token for apiSecure interceptor (not httpOnly in this example)
        localStorage.setItem("appToken", res.data.token);
      }
    } catch (err) {
      console.error("Auth sync error:", err?.response?.data || err.message || err);
    }
  }, []);

  // Listen for firebase auth state changes
  useEffect(() => {
    setLoading(true);
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser || null);

      if (fbUser) {
        try {
          const idToken = await fbUser.getIdToken(/* forceRefresh */ false);
          await syncWithBackend(idToken);
        } catch (err) {
          console.error("Failed to get idToken or sync:", err);
        }
      } else {
        setUser(null);
        localStorage.removeItem("appToken");
      }

      setLoading(false);
    });

    return () => unsub();
  }, [syncWithBackend]);

  // Register new user (Firebase + optional profile displayName/avatar)
  const register = async ({ email, password, name, avatarUrl, bloodGroup, district, upazila }) => {
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      // Optionally update firebase profile
      if (cred?.user && (name || avatarUrl)) {
        await firebaseUpdateProfile(cred.user, {
          displayName: name || undefined,
          photoURL: avatarUrl || undefined,
        });
      }
      // Force refresh token and sync with backend to create app user
      const idToken = await cred.user.getIdToken(true);
      await syncWithBackend(idToken);

      setLoading(false);
      return { ok: true };
    } catch (err) {
      setLoading(false);
      console.error("Register error:", err);
      return { ok: false, error: err };
    }
  };

  // Login with email/password
  const login = async (email, password) => {
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await cred.user.getIdToken(true);
      await syncWithBackend(idToken);
      setLoading(false);
      return { ok: true };
    } catch (err) {
      setLoading(false);
      console.error("Login error:", err);
      return { ok: false, error: err };
    }
  };

  // Logout
  const logout = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setFirebaseUser(null);
      localStorage.removeItem("appToken");
      setLoading(false);
      return { ok: true };
    } catch (err) {
      setLoading(false);
      console.error("Logout error:", err);
      return { ok: false, error: err };
    }
  };

  // Force refresh user data from backend using firebase token
  const refreshUser = async () => {
    if (!firebaseUser) return;
    setLoading(true);
    try {
      const idToken = await firebaseUser.getIdToken(true);
      await syncWithBackend(idToken);
    } catch (err) {
      console.error("refreshUser error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const value = {
    firebaseUser,
    user,
    setUser, // allow components (e.g., profile save) to update user locally
    loading,
    register,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

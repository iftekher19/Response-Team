// src/Contexts/AuthProvider.jsx
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

initializeApp(firebaseConfig);
const auth = getAuth();

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null); // raw firebase user
  const [user, setUser] = useState(null); // application user from backend (role/status)
  const [loading, setLoading] = useState(true);

  // Helper: sync firebase idToken with backend and include profile fields
  const syncWithBackend = useCallback(async (idToken) => {
    try {
      const API = import.meta.env.VITE_API_URL;
      if (!API) {
        console.warn("VITE_API_URL not set, skipping backend sync");
        return;
      }

      // Try to include Firebase profile fields so server /api/auth/sync can upsert by email
      const fb = auth.currentUser || firebaseUser;
      const payload = {
        idToken,
        // include profile fields at root so server's simple upsert path works:
        email: fb?.email || undefined,
        name: fb?.displayName || undefined,
        avatar: fb?.photoURL || undefined,
        // you may add role/status defaults if you want:
        // role: "donor",
        // status: "active",
      };

      // Post the token + profile to /api/auth/sync
      const res = await axios.post(`${API}/api/auth/sync`, payload);

      // Server may return different shapes:
      // - res.data.user (if server verified token & returned user),
      // - or res.data.ok + upsert result (like your server.js currently returns)
      if (res?.data?.user) {
        setUser(res.data.user);
      } else if (res?.data?.ok) {
        // server upserted; try to fetch the stored user doc from /users by email
        if (payload.email) {
          try {
            const getRes = await axios.get(`${API}/users`, { params: { email: payload.email } });
            const stored = Array.isArray(getRes.data?.data) ? getRes.data.data[0] : null;
            if (stored) {
              setUser(stored);
            } else {
              // fallback: set minimal profile
              setUser({ email: payload.email, name: payload.name, avatar: payload.avatar });
            }
          } catch (err) {
            console.warn("Could not fetch stored user after sync:", err?.message || err);
            setUser({ email: payload.email, name: payload.name, avatar: payload.avatar });
          }
        }
      }

      // If server returned a token (server JWT), store it (not httpOnly here)
      if (res?.data?.token) {
        localStorage.setItem("appToken", res.data.token);
      }
    } catch (err) {
      console.error("Auth sync error:", err?.response?.data || err.message || err);
    }
  }, [firebaseUser]);

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

      // Update firebase profile with displayName / photoURL
      if (cred?.user && (name || avatarUrl)) {
        await firebaseUpdateProfile(cred.user, {
          displayName: name || undefined,
          photoURL: avatarUrl || undefined,
        });
      }

      // Force refresh token and sync with backend to create app user
      const idToken = await cred.user.getIdToken(true);
      await syncWithBackend(idToken);

      // As an extra guarantee: upsert the app profile directly if backend didn't include profile fields
      // (most of the time syncWithBackend already upserted)
      try {
        const API = import.meta.env.VITE_API_URL;
        if (API) {
          const profile = {
            email,
            name,
            avatar: avatarUrl,
            bloodGroup,
            district,
            upazila,
            role: "donor",
            status: "active",
          };
          await axios.post(`${API}/users`, profile).catch(() => {/* ignore if already upserted */});
        }
      } catch (e) {
        // ignore non-critical
      }

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

  // Expose context value
  const value = {
    firebaseUser,
    user,
    setUser,
    loading,
    register,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

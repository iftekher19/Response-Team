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

// Helper: create an axios instance with baseURL when available
const makeApiClient = () => {
  const API = import.meta.env.VITE_API_URL || "";
  const client = axios.create({
    baseURL: API,
    timeout: 10_000,
    headers: { "Content-Type": "application/json" },
  });

  // attach appToken if present (non-httpOnly)
  client.interceptors.request.use((cfg) => {
    const token = localStorage.getItem("appToken");
    if (token) cfg.headers["Authorization"] = `Bearer ${token}`;
    return cfg;
  });

  return client;
};

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null); // raw firebase user
  const [user, setUser] = useState(null); // application user from backend (role/status)
  const [loading, setLoading] = useState(true);

  const api = makeApiClient();

  /**
   * syncWithBackend:
   * - Posts idToken and basic profile to /api/auth/sync
   * - If server returns user data, save it; if server only upserted, try fetching stored profile
   * - Store server token if returned
   */
  const syncWithBackend = useCallback(
    async (idToken) => {
      try {
        const API = import.meta.env.VITE_API_URL;
        if (!API) {
          console.warn("VITE_API_URL not set — skipping backend sync");
          return;
        }

        // Grab profile info from firebase current user (if available)
        const fb = auth.currentUser || firebaseUser;
        const payload = {
          idToken,
          email: fb?.email,
          name: fb?.displayName,
          avatar: fb?.photoURL,
        };

        // POST to /api/auth/sync (server will upsert)
        const res = await api.post("/api/auth/sync", payload).catch((err) => {
          // bubble a helpful message but don't throw
          console.warn("POST /api/auth/sync failed:", err?.response?.data || err.message || err);
          return err?.response || null;
        });

        const data = res?.data ?? null;

        // If server gave us a user object, trust it
        if (data?.user) {
          setUser(data.user);
        } else if (data?.ok) {
          // Server accepted upsert. Try to fetch the stored user doc by email.
          if (payload.email) {
            try {
              // server GET /users?email=...
              const getRes = await api.get("/users", { params: { email: payload.email } });
              // accept both { ok:true, data: [...] } and direct array shapes
              const docs = getRes?.data?.data ?? getRes?.data ?? getRes;
              const arr = Array.isArray(docs) ? docs : Array.isArray(docs?.data) ? docs.data : [];
              if (arr && arr.length) {
                setUser(arr[0]);
              } else {
                // fallback minimal profile
                setUser({ email: payload.email, name: payload.name, avatar: payload.avatar });
              }
            } catch (err) {
              console.warn("Could not fetch stored user after sync:", err?.response?.data || err.message || err);
              setUser({ email: payload.email, name: payload.name, avatar: payload.avatar });
            }
          }
        }

        // If server returned a token (optional), store it for subsequent calls
        if (data?.token) {
          localStorage.setItem("appToken", data.token);
        }
      } catch (err) {
        console.error("Auth sync error:", err?.response?.data || err.message || err);
      }
    },
    [firebaseUser] // depends on firebaseUser reference
  );

  // Listen for firebase auth changes
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

  /**
   * register:
   * - create Firebase user
   * - update Firebase profile (displayName/photoURL)
   * - force-refresh idToken and call /api/auth/sync with idToken + profile
   * - as a safety, also POST /users profile (upsert) if API present
   */
  const register = async ({ email, password, name, avatarUrl, bloodGroup, district, upazila }) => {
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);

      // update firebase profile
      if (cred?.user && (name || avatarUrl)) {
        try {
          await firebaseUpdateProfile(cred.user, {
            displayName: name || undefined,
            photoURL: avatarUrl || undefined,
          });
        } catch (err) {
          // non-critical
          console.warn("Failed to update firebase profile:", err?.message || err);
        }
      }

      // Force refresh token and sync with backend
      const idToken = await cred.user.getIdToken(true);
      await syncWithBackend(idToken);

      // Best-effort: upsert full profile to /users so backend contains bloodGroup/district/upazila too.
      try {
        const API = import.meta.env.VITE_API_URL;
        if (API) {
          const profile = {
            email,
            name: name || cred.user?.displayName || "",
            avatar: avatarUrl || cred.user?.photoURL || "",
            bloodGroup: bloodGroup || "",
            district: district || "",
            upazila: upazila || "",
            role: "donor",
            status: "active",
          };
          // server POST /users will upsert by email
          await api.post("/users", profile).catch((e) => {
            // ignore harmless errors (already upserted etc)
            console.warn("POST /users upsert may have failed (ignored):", e?.response?.data || e.message || e);
          });
        } else {
          console.warn("VITE_API_URL not set — skipping POST /users upsert");
        }
      } catch (e) {
        // ignore
        console.warn("Upsert after register failed (ignored):", e?.message || e);
      }

      setLoading(false);
      return { ok: true };
    } catch (err) {
      setLoading(false);
      console.error("Register error:", err?.response?.data || err.message || err);
      return { ok: false, error: err };
    }
  };

  // Login
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
      console.error("Login error:", err?.response?.data || err.message || err);
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
      console.error("Logout error:", err?.response?.data || err.message || err);
      return { ok: false, error: err };
    }
  };

  // Refresh user from backend using firebase token
  const refreshUser = async () => {
    if (!firebaseUser) return;
    setLoading(true);
    try {
      const idToken = await firebaseUser.getIdToken(true);
      await syncWithBackend(idToken);
    } catch (err) {
      console.error("refreshUser error:", err?.response?.data || err.message || err);
    } finally {
      setLoading(false);
    }
  };

  // Expose context
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

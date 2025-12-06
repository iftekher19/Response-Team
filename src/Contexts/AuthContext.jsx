// src/contexts/AuthContext.jsx
import { createContext } from "react";

/**
 * AuthContext shape:
 * {
 *   firebaseUser,   // firebase user object or null
 *   user,           // application user from backend (has role, status, avatarUrl, etc.)
 *   loading,        // boolean; true while initializing auth
 *   register,       // async (email, password, extra) => { ... }
 *   login,          // async (email, password) => { ... }
 *   logout,         // async () => { ... }
 *   refreshUser,    // async () => { ... } // re-sync with backend
 * }
 */
const AuthContext = createContext(null);

export default AuthContext;

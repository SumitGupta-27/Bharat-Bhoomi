import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../services/api.js";

const AuthContext = createContext(null);

const TOKEN_KEY = "bharat_bhoomi_token";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(true);

  // Verify session on mount / when token changes
  useEffect(() => {
    async function verifySession() {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const data = await api.getMe();
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          handleLogout();
        }
      } catch (err) {
        console.warn("Session verification failed:", err.message);
        handleLogout();
      } finally {
        setLoading(false);
      }
    }

    verifySession();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  /**
   * Login — accepts { username, password, role?, department? }
   * Throws an Error with a user-friendly message on failure.
   */
  async function login(credentials) {
    const data = await api.login(credentials); // api throws on !response.ok
    if (data.success && data.token) {
      localStorage.setItem(TOKEN_KEY, data.token);
      setToken(data.token);
      setUser(data.user);
    } else {
      throw new Error(data.message || "Login failed.");
    }
    return data;
  }

  /**
   * Register — accepts { full_name, username, email, password, phone? }
   * Throws an Error with a user-friendly message on failure.
   */
  async function register(userData) {
    const data = await api.register(userData); // api throws on !response.ok
    if (data.success && data.token) {
      localStorage.setItem(TOKEN_KEY, data.token);
      setToken(data.token);
      setUser(data.user);
    } else {
      throw new Error(data.message || "Registration failed.");
    }
    return data;
  }

  /** Logout — clears client state and notifies the server (best-effort). */
  function handleLogout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }

  async function logout() {
    try {
      await api.logout();
    } catch (_) {
      // ignore network errors on logout
    }
    handleLogout();
  }

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isOfficer: user?.role === "officer" || user?.role === "admin",
    isAdmin: user?.role === "admin",
    isCitizen: user?.role === "citizen",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;

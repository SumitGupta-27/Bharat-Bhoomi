import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("bharat_bhoomi_token"));
  const [loading, setLoading] = useState(true);

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
          logout();
        }
      } catch (err) {
        console.warn("Session verification failed:", err.message);
        logout();
      } finally {
        setLoading(false);
      }
    }

    verifySession();
  }, [token]);

  async function login(credentials) {
    const data = await api.login(credentials);
    if (data.success && data.token) {
      localStorage.setItem("bharat_bhoomi_token", data.token);
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  }

  async function register(userData) {
    const data = await api.register(userData);
    if (data.success && data.token) {
      localStorage.setItem("bharat_bhoomi_token", data.token);
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  }

  function logout() {
    localStorage.removeItem("bharat_bhoomi_token");
    setToken(null);
    setUser(null);
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

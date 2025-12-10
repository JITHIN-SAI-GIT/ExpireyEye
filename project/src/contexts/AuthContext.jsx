// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Use a dedicated axios instance for auth
  const api = axios.create({
    baseURL: "https://expireyeye.onrender.com",
    withCredentials: true, // send cookies on every request
  });

  // Check session when app starts
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await api.get("/check-auth");
        setUser(res.data?.user || null);
      } catch (err) {
        console.error("check-auth error:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run only on mount

  // Login
  const login = async (username, password) => {
    try {
      const res = await api.post("/login", { username, password });
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      console.error("login error:", err);
      // rethrow normalized error to be handled in UI
      throw err.response?.data || { message: "Login failed" };
    }
  };

  // Signup
  const signup = async (username, email, password) => {
    return api.post("/signup", { username, email, password });
  };

  // Logout
  const logout = async () => {
    try {
      await api.get("/logout");
    } catch (err) {
      console.error("logout error:", err);
    } finally {
      setUser(null);
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, isAuthenticated, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Configure axios for session cookies
  axios.defaults.withCredentials = true;
  axios.defaults.baseURL = "http://localhost:3000";

  // ✅ Check session when app starts
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await axios.get("/check-auth");
        setUser(res.data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  // ✅ Login
  const login = async (username, password) => {
    const res = await axios.post("/login", { username, password });
    setUser(res.data.user);
  };

  // ✅ Signup
  const signup = async (username, email, password) => {
    await axios.post("/signup", { username, email, password });
  };

  // ✅ Logout
  const logout = async () => {
    await axios.get("/logout");
    setUser(null);
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

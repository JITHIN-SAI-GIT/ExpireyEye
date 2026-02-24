// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";

axios.defaults.withCredentials = true;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  // Check session when app starts
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/check-auth`, {
          withCredentials: true,
        });

        // User is authenticated
        setUser(res.data?.user || null);
      } catch (err) {
        // 401 Unauthorized = user not logged in (normal case)
        if (err.response?.status !== 401) {
          console.error("check-auth error:", err);
        }
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);
  // run only on mount

  const login = async (credentials) => {
    const res = await axios.post(`${API_BASE_URL}/login`, credentials, {
      withCredentials: true,
    });
    setUser(res.data.user);
    return res;
  };

  const logout = async () => {
    try {
      await axios.get(`${API_BASE_URL}/logout`, {
        withCredentials: true,
      });
    } catch (err) {
      console.error("logout error:", err);
    } finally {
      setUser(null);
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


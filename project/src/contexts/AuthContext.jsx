import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    // Mock authentication - in real app, this would call an API
    if (email === 'owner@store.com' && password === 'password') {
      setUser({
        id: '1',
        name: 'John Store Owner',
        email: 'owner@store.com',
        role: 'owner'
      });
      return true;
    }
    return false;
  };

  const signup = async (name, email, password) => {
    // Mock signup - in real app, this would call an API
    setUser({
      id: Date.now().toString(),
      name,
      email,
      role: 'owner'
    });
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    login,
    signup,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
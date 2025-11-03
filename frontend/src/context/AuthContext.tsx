// frontend/src/context/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// 1. Define a type for the user object
interface User {
  firstName: string;
  email: string;
}

// 2. Add the 'user' object to our context's type
interface AuthContextType {
  isLoggedIn: boolean;
  token: string | null;
  user: User | null;
  login: (newToken: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize token from localStorage
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(null);

  const isLoggedIn = !!token;

  useEffect(() => {
    // This effect fetches user data and handles token invalidation
    const fetchUserData = async () => {
      if (token) {
        try {
          const response = await fetch('http://localhost:5000/api/auth/me', {
            headers: { 'x-auth-token': token },
          });
          if (!response.ok) {
            throw new Error('Failed to fetch user data');
          }
          const data: User = await response.json();
          setUser(data); 
        } catch (error) {
          console.error(error);
          setUser(null); 
          // If the token is invalid, also clear it from localStorage/state to log out
          localStorage.removeItem('token'); 
          setToken(null); 
        }
      } else {
        setUser(null); 
      }
    };

    fetchUserData();
  }, [token]);

  const login = (newToken: string) => {
    // 🚨 CRITICAL FIX: Save the token to permanent storage!
    localStorage.setItem('token', newToken); 
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
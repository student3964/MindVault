// src/api/auth.ts
// Handles login, logout, and token management for MindVault

import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api/auth";

// ✅ Store token securely in localStorage
export const setAuthToken = (token: string) => {
  localStorage.setItem("token", token);
};

// ✅ Retrieve stored token
export const getAuthToken = (): string | null => {
  return localStorage.getItem("token");
};

// ✅ Clear token on logout
export const clearAuthToken = () => {
  localStorage.removeItem("token");
};

// ✅ Login user and store token
export const loginUser = async (email: string, password: string) => {
  const res = await axios.post(`${API_BASE}/login`, { email, password });
  if (res.data.token) {
    setAuthToken(res.data.token);
  }
  return res.data;
};

// ✅ Get logged-in user details
export const getUserProfile = async () => {
  const token = getAuthToken();
  const res = await axios.get(`${API_BASE}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ✅ Logout (frontend only)
export const logoutUser = () => {
  clearAuthToken();
  window.location.href = "/login";
};

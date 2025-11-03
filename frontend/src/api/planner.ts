// src/api/planner.ts
// Handles all planner-related API calls: tasks, events, deadlines, alerts

import axios from "axios";
import { getAuthToken } from "../utils/auth";

const API_BASE =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api/planner";

// ✅ Axios instance with token interceptor
const axiosInstance = axios.create({
  baseURL: API_BASE,
});

axiosInstance.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers["Content-Type"] = "application/json";
  return config;
});

// ------------------- TASKS -------------------
export const fetchTasks = async () => {
  const res = await axiosInstance.get("/tasks");
  return res.data;
};

export const createTask = async (title: string) => {
  const res = await axiosInstance.post("/tasks", { title });
  return res.data;
};

export const updateTask = async (id: string, done: boolean) => {
  const res = await axiosInstance.patch(`/tasks/${id}`, { done });
  return res.data;
};

export const deleteTask = async (id: string) => {
  const res = await axiosInstance.delete(`/tasks/${id}`);
  return res.data;
};

// ------------------- EVENTS -------------------
export const createEvent = async (data: {
  title: string;
  deadline: string;
  description?: string;
}) => {
  const res = await axiosInstance.post("/events", data);
  return res.data;
};

export const fetchEvents = async () => {
  const res = await axiosInstance.get("/events");
  return res.data;
};

// ------------------- DEADLINES -------------------
export const fetchUpcomingDeadlines = async () => {
  const res = await axiosInstance.get("/upcoming-deadlines");
  return res.data;
};

// ------------------- ALERTS -------------------
export const fetchAlerts = async () => {
  const res = await axiosInstance.get("/alerts");
  return res.data;
};

export const markAlertAsRead = async (id: string) => {
  const res = await axiosInstance.post(`/alerts/${id}/read`);
  return res.data;
};

// ------------------- AI STUDY PLAN -------------------
export const generateAIPlan = async (data: {
  goals?: string;
  subjects?: string;
  timeframe?: string;
}) => {
  const res = await axiosInstance.post("/generate-plan", data);
  return res.data;
};

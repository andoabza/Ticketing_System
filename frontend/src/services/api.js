import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await api.post("/auth/refresh");
        localStorage.setItem("token", data.token);
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("token");
        window.location = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;

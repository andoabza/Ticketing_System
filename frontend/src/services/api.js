import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/auth/refresh`,
          {},
          {
            withCredentials: true,
          }
        );
        return api(originalRequest);
      } catch (refreshError) {
        window.location = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

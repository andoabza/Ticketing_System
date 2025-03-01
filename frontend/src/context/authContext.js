import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await api.get("/auth/check");
        setUser(data.user);
      } catch (error) {
        setUser(null);
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (credentials) => {
    const { data } = await api.post("/auth/login", credentials);
    setUser(data.user);
    navigate(user?.role === "admin" ? "/admin/dashboard" : "/dashboard");
  };

  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

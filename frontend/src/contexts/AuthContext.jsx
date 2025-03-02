import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (token) {
          const { data } = await api.get("/auth/me");
          setUser(data);
        }
      } catch (error) {
        logout();
      }
    };
    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser(data.user);
      navigate("/dashboard");
    } catch (error) {
      throw error.response.data.error;
    }
  };

  const register = async (email, password) => {
    try {
      const { data } = await api.post("/auth/register", { email, password });
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser(data.user);
      navigate("/dashboard");
    } catch (error) {
      throw error.response.data.error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

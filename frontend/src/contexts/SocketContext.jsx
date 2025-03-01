import { createContext, useContext, useEffect, useRef } from "react";
import io from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export function SocketProvider({ children }) {
  const socketRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      socketRef.current = io(process.env.REACT_APP_API_URL, {
        auth: { token: localStorage.getItem("token") },
      });

      socketRef.current.on("connect", () => {
        console.log("Connected to WebSocket");
      });

      return () => {
        socketRef.current?.disconnect();
      };
    }
  }, [user]);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);

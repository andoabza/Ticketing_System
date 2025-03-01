import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { SocketProvider } from "./contexts/SocketContext";
import App from "./App";
import "./styles/main.scss";

ReactDOM.render(
  <BrowserRouter>
    <AuthProvider>
      <SocketProvider>
        <App />
      </SocketProvider>
    </AuthProvider>
  </BrowserRouter>,
  document.getElementById("root")
);

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function PrivateRoute({ children, roles }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
}

// Usage in App.jsx
<Route
  path="/admin/users"
  element={
    <PrivateRoute roles={["admin"]}>
      <AdminUsers />
    </PrivateRoute>
  }
/>;

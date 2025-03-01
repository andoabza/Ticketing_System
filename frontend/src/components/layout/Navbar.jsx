import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Avatar,
} from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Button component={Link} to="/" color="inherit">
            Home
          </Button>
          {user && (
            <Button component={Link} to="/tickets" color="inherit">
              Tickets
            </Button>
          )}
          {user?.role === "admin" && (
            <Button component={Link} to="/admin/users" color="inherit">
              Users
            </Button>
          )}
        </Box>

        {user ? (
          <Box display="flex" alignItems="center" gap={2}>
            <IconButton onClick={() => navigate("/profile")}>
              <Avatar>{user.name[0]}</Avatar>
            </IconButton>
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          </Box>
        ) : (
          <Button component={Link} to="/login" color="inherit">
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

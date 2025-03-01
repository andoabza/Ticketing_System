import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { SocketProvider } from "./contexts/SocketContext";
import { SnackbarProvider } from "notistack";
import {
  HomePage,
  LoginPage,
  RegisterPage,
  DashboardPage,
  TicketListPage,
  TicketDetailPage,
  AdminUsersPage,
  AdminAnalyticsPage,
  ProfilePage,
  ResetPasswordRequestPage,
  ResetPasswordConfirmPage,
  EmailVerificationPage,
  NotFoundPage,
} from "./pages";
import {
  Navbar,
  MobileMenu,
  EmailVerificationBanner,
  NotificationSnackbar,
  LoadingOverlay,
} from "./components/layout";
import {
  CssBaseline,
  Box,
  useMediaQuery,
  ThemeProvider,
  createTheme,
  useTheme,
} from "@mui/material";

// Create custom theme
const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1976d2" },
    secondary: { main: "#dc004e" },
    background: { default: "#f5f5f5" },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    h4: { fontWeight: 600 },
    h5: { fontWeight: 500 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none" },
      },
    },
  },
});

// Enhanced PrivateRoute component
const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingOverlay />;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Main App component
export default function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider maxSnack={3}>
        <BrowserRouter>
          <AuthProvider>
            <SocketProvider>
              <Box sx={{ display: "flex", minHeight: "100vh" }}>
                {/* Navigation */}
                {isMobile ? (
                  <MobileMenu open={mobileOpen} onClose={handleDrawerToggle} />
                ) : (
                  <Navbar />
                )}

                {/* Main content */}
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                  <EmailVerificationBanner />
                  <NotificationSnackbar />

                  <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route
                      path="/request-reset"
                      element={<ResetPasswordRequestPage />}
                    />
                    <Route
                      path="/reset-password/:token"
                      element={<ResetPasswordConfirmPage />}
                    />
                    <Route
                      path="/verify-email/:token"
                      element={<EmailVerificationPage />}
                    />

                    {/* Authenticated routes */}
                    <Route
                      path="/dashboard"
                      element={
                        <PrivateRoute>
                          <DashboardPage />
                        </PrivateRoute>
                      }
                    />

                    <Route
                      path="/tickets"
                      element={
                        <PrivateRoute>
                          <TicketListPage />
                        </PrivateRoute>
                      }
                    />

                    <Route
                      path="/tickets/:id"
                      element={
                        <PrivateRoute>
                          <TicketDetailPage />
                        </PrivateRoute>
                      }
                    />

                    <Route
                      path="/profile"
                      element={
                        <PrivateRoute>
                          <ProfilePage />
                        </PrivateRoute>
                      }
                    />

                    {/* Admin routes */}
                    <Route
                      path="/admin/users"
                      element={
                        <PrivateRoute roles={["admin"]}>
                          <AdminUsersPage />
                        </PrivateRoute>
                      }
                    />

                    <Route
                      path="/admin/analytics"
                      element={
                        <PrivateRoute roles={["admin"]}>
                          <AdminAnalyticsPage />
                        </PrivateRoute>
                      }
                    />

                    {/* Error handling */}
                    <Route path="/404" element={<NotFoundPage />} />
                    <Route path="*" element={<Navigate to="/404" replace />} />
                  </Routes>
                </Box>
              </Box>
            </SocketProvider>
          </AuthProvider>
        </BrowserRouter>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

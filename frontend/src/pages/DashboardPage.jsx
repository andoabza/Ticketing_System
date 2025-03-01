import React from "react";
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import useTickets from "../hooks/useTickets";
import TicketList from "../components/tickets/TicketList";
import { calculateTicketStats } from "../utils/ticketUtils";

const StatsCard = ({ title, value, color }) => (
  <Card sx={{ minWidth: 175, backgroundColor: color }}>
    <CardContent>
      <Typography variant="h6" component="div" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h4" component="div">
        {value}
      </Typography>
    </CardContent>
  </Card>
);

const DashboardPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { user } = useAuth();
  const { tickets, loading, error } = useTickets();

  const stats = calculateTicketStats(tickets, user?.role);
  const canCreateTicket = ["customer", "agent"].includes(user?.role);

  if (loading)
    return <CircularProgress sx={{ display: "block", mx: "auto" }} />;

  if (error)
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Error loading tickets: {error.message}
      </Alert>
    );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: { xs: "1fr", md: "auto 1fr" },
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" component="h1">
          Welcome back, {user?.name}
        </Typography>
        {canCreateTicket && (
          <Button
            variant="contained"
            component={Link}
            to="/tickets/new"
            sx={{ justifySelf: { xs: "center", md: "end" } }}
          >
            Create New Ticket
          </Button>
        )}
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {Object.entries(stats).map(([key, stat]) => (
          <Grid item key={key} xs={12} sm={6} md={4} lg={3}>
            <StatsCard
              title={stat.label}
              value={stat.value}
              color={stat.color}
            />
          </Grid>
        ))}
      </Grid>

      {/* Recent Tickets */}
      <Box
        sx={{
          backgroundColor: "background.paper",
          borderRadius: 2,
          p: isMobile ? 1 : 3,
          boxShadow: 1,
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
          {user?.role === "admin" ? "All Tickets" : "Your Tickets"}
        </Typography>
        <TicketList tickets={tickets.slice(0, 5)} showActions={false} />
        {tickets.length > 5 && (
          <Button
            component={Link}
            to="/tickets"
            variant="outlined"
            sx={{ mt: 2 }}
          >
            View All Tickets
          </Button>
        )}
      </Box>

      {/* Admin-Specific Content */}
      {user?.role === "admin" && (
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                backgroundColor: "background.paper",
                p: 3,
                borderRadius: 2,
                boxShadow: 1,
              }}
            >
              <Typography variant="h6" gutterBottom>
                User Statistics
              </Typography>
              {/* Add user stats/chart here */}
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                backgroundColor: "background.paper",
                p: 3,
                borderRadius: 2,
                boxShadow: 1,
              }}
            >
              <Typography variant="h6" gutterBottom>
                System Overview
              </Typography>
              {/* Add system stats here */}
            </Box>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default DashboardPage;

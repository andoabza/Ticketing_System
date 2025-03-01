import { Container, Typography, Box } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import TicketStats from "../components/dashboard/TicketStats";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <Container maxWidth="xl">
      <Box py={4}>
        <Typography variant="h4" gutterBottom>
          Welcome, {user?.name}
        </Typography>
        {user?.role === "admin" && <TicketStats />}
        {/* Dashboard content */}
      </Box>
    </Container>
  );
}

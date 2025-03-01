import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import useApi from "./useApi";

export default function useTickets() {
  const { user } = useAuth();
  const { data, error, loading, fetch } = useApi("/tickets");

  useEffect(() => {
    const fetchTickets = async () => {
      const params = {};
      if (user?.role === "customer") params.createdBy = user.id;
      if (user?.role === "agent") params.assignedTo = user.id;

      await fetch({ params });
    };

    fetchTickets();
  }, [user]);

  return { tickets: data || [], error, loading };
}

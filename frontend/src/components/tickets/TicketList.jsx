import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";
import TicketItem from "./TicketItem";
import { DataGrid } from '@mui/x-data-grid';
import { useTickets } from '../../hooks/useTickets';

const columns = [
  { field: 'title', headerName: 'Title', flex: 2 },
  { field: 'status', headerName: 'Status', flex: 1 },
  { field: 'priority', headerName: 'Priority', flex: 1 },
];

export default function TicketList() {
  const { tickets, loading } = useTickets();
  const { user } = useAuth();
  const socket = useSocket();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const { data } = await api.get("/tickets");
        setTickets(data.results);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };

    fetchTickets();

    socket?.on("ticketUpdated", (updatedTicket) => {
      setTickets((prev) =>
        prev.map((t) => (t._id === updatedTicket._id ? updatedTicket : t))
      );
    });

    return () => {
      socket?.off("ticketUpdated");
    };
  }, [socket]);

  if (loading) return <div>Loading tickets...</div>;

  return (
    <div className="ticket-list">
      {tickets.map((ticket) => (
        <TicketItem
          key={ticket._id}
          ticket={ticket}
          isAgent={user?.role === "agent" || user?.role === "admin"}
        />
      ))}
    <div style={{ height: 600, width: '100%' }}>
      <DataGrid
        rows={tickets}
        columns={columns}
        loading={loading}
        disableSelectionOnClick
        onRowClick={(params) => window.location = `/tickets/${params.id}`}
      />
    </div>
    </div>
    
  );
}

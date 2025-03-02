import { useEffect, useState } from "react";
import api from "../api";

const TicketList = ({ user }) => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const { data } = await api.get("/tickets");
        setTickets(data);
      } catch (error) {
        alert(error.response.data.error);
      }
    };
    fetchTickets();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/tickets/${id}/status`, { status });
      setTickets(
        tickets.map((ticket) =>
          ticket._id === id ? { ...ticket, status } : ticket
        )
      );
    } catch (error) {
      alert(error.response.data.error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/tickets/${id}`);
      setTickets(tickets.filter((ticket) => ticket._id !== id));
    } catch (error) {
      alert(error.response.data.error);
    }
  };

  return (
    <div className="ticket-list">
      {tickets.map((ticket) => (
        <div key={ticket._id} className="ticket-card">
          <h3>{ticket.title}</h3>
          <p>{ticket.description}</p>
          <p>Status: {ticket.status}</p>
          <p>Created by: {ticket.createdBy.email}</p>
          {ticket.assignedTo && <p>Assigned to: {ticket.assignedTo.email}</p>}

          {user?.role === "admin" && (
            <div className="admin-actions">
              <select
                value={ticket.status}
                onChange={(e) => handleStatusChange(ticket._id, e.target.value)}
              >
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="closed">Closed</option>
              </select>
              <button onClick={() => handleDelete(ticket._id)}>Delete</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TicketList;

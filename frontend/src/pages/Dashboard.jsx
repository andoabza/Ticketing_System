import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import TicketList from "../components/TicketList";
import TicketForm from "../components/TicketForm";
import api from "../api";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="dashboard">
      <header>
        <h1>Welcome {user?.email}</h1>
        <div className="header-actions">
          {user?.role === "admin" && (
            <button onClick={() => setShowForm(!showForm)}>
              {showForm ? "Close Form" : "Create Ticket"}
            </button>
          )}
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      {showForm && <TicketForm onTicketCreated={() => setShowForm(false)} />}
      <TicketList user={user} />
    </div>
  );
};

export default Dashboard;

export const calculateTicketStats = (tickets, role) => {
  const stats = {
    total: { label: "Total Tickets", value: tickets.length, color: "#e8f5e9" },
    open: {
      label: "Open",
      value: tickets.filter((t) => t.status === "open").length,
      color: "#fff3e0",
    },
    inProgress: {
      label: "In Progress",
      value: tickets.filter((t) => t.status === "in_progress").length,
      color: "#e3f2fd",
    },
    closed: {
      label: "Closed",
      value: tickets.filter((t) => t.status === "closed").length,
      color: "#fbe9e7",
    },
  };

  if (role === "agent") {
    return {
      assigned: {
        label: "Assigned to Me",
        value: tickets.filter((t) => t.assignedTo === user.id).length,
        color: "#f3e5f5",
      },
      ...stats,
    };
  }

  if (role === "customer") {
    return {
      myTickets: {
        label: "My Tickets",
        value: tickets.length,
        color: "#e8f5e9",
      },
      ...stats,
    };
  }

  return stats;
};

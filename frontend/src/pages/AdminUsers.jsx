import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";

const columns = [
  { field: "name", headerName: "Name", width: 200 },
  { field: "email", headerName: "Email", width: 250 },
  {
    field: "role",
    headerName: "Role",
    width: 150,
    renderCell: (params) => <RoleSelect user={params.row} />,
  },
];

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await api.get("/users");
      setUsers(data);
    };
    if (user?.role === "admin") fetchUsers();
  }, [user]);

  return (
    <div style={{ height: 600, width: "100%" }}>
      <DataGrid
        rows={users}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        checkboxSelection
        disableSelectionOnClick
      />
    </div>
  );
}

function RoleSelect({ user }) {
  const [role, setRole] = useState(user.role);

  const handleChange = async (e) => {
    try {
      await api.put(`/users/${user._id}/role`, { role: e.target.value });
      setRole(e.target.value);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <select value={role} onChange={handleChange}>
      <option value="customer">Customer</option>
      <option value="agent">Agent</option>
      <option value="admin">Admin</option>
    </select>
  );
}

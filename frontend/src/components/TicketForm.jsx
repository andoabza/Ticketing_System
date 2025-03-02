import { useState } from "react";
import api from "../api";

const TicketForm = ({ onTicketCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/tickets", { title, description });
      onTicketCreated();
      setTitle("");
      setDescription("");
    } catch (error) {
      alert(error.response.data.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="ticket-form">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <button type="submit">Create Ticket</button>
    </form>
  );
};

export default TicketForm;

import React, { useState, useEffect } from "react";
import { useSocket } from "../../contexts/SocketContext";

export default function CommentSection({ ticketId }) {
  const [comments, setComments] = useState([]);
  const socket = useSocket();
  const { user } = useAuth();

  useEffect(() => {
    const loadComments = async () => {
      const { data } = await api.get(`/tickets/${ticketId}/comments`);
      setComments(data);
    };
    loadComments();

    socket?.on("commentAdded", (newComment) => {
      if (newComment.ticket === ticketId) {
        setComments((prev) => [...prev, newComment]);
      }
    });

    return () => {
      socket?.off("commentAdded");
    };
  }, [ticketId, socket]);

  const addComment = async (text) => {
    const { data } = await api.post(`/tickets/${ticketId}/comments`, { text });
    socket?.emit("newComment", {
      ticketId,
      comment: data,
    });
  };

  return (
    <div className="comment-section">
      {comments.map((comment) => (
        <CommentItem key={comment._id} comment={comment} />
      ))}
      <CommentForm onSubmit={addComment} />
    </div>
  );
}

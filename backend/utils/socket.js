const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = function initializeWebSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST"],
    },
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = await User.findById(decoded.id);
      next();
    } catch (err) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    socket.join(`user_${socket.user.id}`);
    socket.join("tickets");

    socket.on("joinTicket", (ticketId) => {
      socket.join(`ticket_${ticketId}`);
    });

    socket.on("newComment", async ({ ticketId, comment }) => {
      const ticket = await Ticket.findById(ticketId).populate(
        "createdBy assignedTo"
      );

      io.to(`ticket_${ticketId}`).emit("commentAdded", {
        ticket: ticketId,
        comment,
        user: socket.user,
      });
    });
  });
};

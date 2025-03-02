const Ticket = require("../models/Ticket");
const User = require("../models/User");
const sendEmail = require("../config/email");

exports.createTicket = async (req, res) => {
  try {
    const ticket = new Ticket({
      ...req.body,
      createdBy: req.user._id,
    });
    await ticket.save();
    res.status(201).json(ticket);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getTickets = async (req, res) => {
  try {
    const query = req.user.role === "admin" ? {} : { createdBy: req.user._id };
    const tickets = await Ticket.find(query)
      .populate("createdBy", "email")
      .populate("assignedTo", "email");
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.assignTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    const assignee = await User.findById(req.body.userId);

    if (!ticket || !assignee) {
      return res.status(404).json({ error: "Ticket or user not found" });
    }

    ticket.assignedTo = req.body.userId;
    ticket.status = "in-progress";
    await ticket.save();

    await sendEmail({
      to: assignee.email,
      subject: "New Ticket Assignment",
      text: `You've been assigned a new ticket: ${ticket.title}`,
    });

    res.json(ticket);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateTicketStatus = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(ticket);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }
    res.json({ message: "Ticket deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

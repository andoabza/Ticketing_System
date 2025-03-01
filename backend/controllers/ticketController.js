const advancedResults = require("../middleware/advancedResults");
const Ticket = require("../models/Ticket");

(exports.getTickets = advancedResults(Ticket, {
  path: "createdBy assignedTo",
  select: "name email role",
})),
  asyncHandler(async (req, res) => {
    // Role-based filtering
    let query;
    if (req.user.role === "admin") {
      query = {};
    } else if (req.user.role === "agent") {
      query = { $or: [{ assignedTo: req.user.id }, { status: "open" }] };
    } else {
      query = { createdBy: req.user.id };
    }

    const results = await req.advancedResults.query(query);
    res.status(200).json(results);
  });

exports.createTicket = asyncHandler(async (req, res) => {
  req.body.createdBy = req.user.id;

  if (req.files) {
    req.body.attachments = req.files.map((file) => ({
      url: `/uploads/${file.filename}`,
      type: file.mimetype,
    }));
  }

  const ticket = await Ticket.create(req.body);

  // Real-time update
  req.io.to("tickets").emit("newTicket", ticket);

  res.status(201).json({ success: true, data: ticket });
});

exports.assignTicket = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);
  const agent = await User.findById(req.body.agentId);

  if (!agent || agent.role !== "agent") {
    throw new ErrorResponse("Invalid agent specified", 400);
  }

  ticket.assignedTo = req.body.agentId;
  ticket.status = "in_progress";
  await ticket.save();

  // Notify assigned agent
  req.io.to(`user_${agent.id}`).emit("ticketAssigned", ticket);

  res.status(200).json({ success: true, data: ticket });
});

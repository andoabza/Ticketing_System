const express = require("express");
const router = express.Router();
const ticketsController = require("../controllers/tickets");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

router.post("/", auth, ticketsController.createTicket);
router.get("/", auth, ticketsController.getTickets);
router.put("/:id/assign", auth, role("admin"), ticketsController.assignTicket);
router.put("/:id/status", auth, ticketsController.updateTicketStatus);
router.delete("/:id", auth, ticketsController.deleteTicket);

module.exports = router;

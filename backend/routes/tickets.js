const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Ticket = require('../models/Ticket');

// Create ticket (Customer)
router.post('/', auth(['customer', 'admin']), async (req, res) => {
   // Ticket creation logic
});


// Get all tickets (Admin/Agent)
router.get('/', auth(['admin', 'agent']), async (req, res) => {
     // Fetch tickets based on role
});

module.exports = router;

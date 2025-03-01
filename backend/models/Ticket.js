const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
	  text: String,
	  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	  createdAt: { type: Date, default: Date.now }
});

const TicketSchema = new mongoose.Schema({
	  title: { type: String, required: true },
	  description: { type: String, required: true },
	  status: { 
		      type: String, 
		      enum: ['open', 'in_progress', 'closed'], 
		      default: 'open' 
		    },
	  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	  comments: [CommentSchema],
	  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ticket', TicketSchema);

const User = require("../models/User");
const Ticket = require("../models/Ticket");

const seedDB = async () => {
  // Create admin user
  const admin = await User.create({
    name: "Admin",
    email: "admin@example.com",
    password: "password123",
    role: "admin",
    verified: true,
  });

  // Create sample tickets
  await Ticket.create([
    {
      title: "Server Down",
      description: "Production server is not responding",
      status: "open",
      priority: "high",
      createdBy: admin.id,
    },
    // Add more sample data
  ]);
};

module.exports = seedDB;

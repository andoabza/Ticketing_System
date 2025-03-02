const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const ticketRoutes = require("./routes/tickets");

dotenv.config();

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
});
app.use(limiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

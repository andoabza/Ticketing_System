require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const { helmet, securityMiddleware } = require("./middleware/security");
const { initializeWebSocket } = require("./utils/socket");
const errorHandler = require("./middleware/error");
//const limiter = require("./middleware/rateLimiter");
const routes = require("./routes");
const logger = require("./utils/logger");

const app = express();
const server = require("http").createServer(app);
const { 
	generalRateLimiter, 
	authRateLimiter,
	securityHeaders
} = require('./middleware/rateLimiter');


// Database connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => logger.info("MongoDB connected"))
  .catch((err) => logger.error(err));

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize());
app.use(helmet());
app.use(securityMiddleware);
//app.use(limiter);
app.use(securityHeaders);
app.use(generalRateLimiter);

// WebSocket initialization
initializeWebSocket(server);

// Routes
app.use("/api/v1", routes);
app.use('/api/auth', authRateLimiter);

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => logger.info(`Server running on port ${PORT}`));

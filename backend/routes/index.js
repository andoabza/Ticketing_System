const router = require("express").Router();
const { protect, authorize, csrfProtection } = require("../middleware/auth");
const { securityHeaders } = require("../middleware/security");
const { uploadFiles } = require("../utils/fileUpload");

router.use(securityHeaders);

// Auth routes
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.post("/auth/refresh", authController.refreshToken);
router.get("/auth/verify/:token", authController.verifyEmail);

// Protected routes
router.use(protect);
router.use(csrfProtection);

// Ticket routes
router
  .route("/tickets")
  .get(ticketController.getTickets)
  .post(uploadFiles, ticketController.createTicket);

router
  .route("/tickets/:id")
  .put(authorize("admin", "agent"), ticketController.updateTicket)
  .delete(authorize("admin"), ticketController.deleteTicket);

// Admin routes
router.use(authorize("admin"));
router
  .route("/users")
  .get(userController.getUsers)
  .post(userController.createUser);

module.exports = router;

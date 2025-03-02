const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const generateToken = {
  // Generate JWT access token
  getSignedJwtToken: (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
  },

  // Generate refresh token
  getRefreshToken: (userId) => {
    return jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRE,
    });
  },

  // Generate email verification token
  getVerificationToken: () => {
    const token = crypto.randomBytes(20).toString("hex");
    const expires =
      Date.now() + process.env.VERIFICATION_TOKEN_EXPIRE * 60 * 1000;
    return { token, expires };
  },

  // Generate password reset token
  getResetPasswordToken: () => {
    const token = crypto.randomBytes(20).toString("hex");
    const expires = Date.now() + process.env.RESET_TOKEN_EXPIRE * 60 * 1000;
    return { token, expires };
  },

  // Verify JWT token
  verifyToken: (token, secret) => {
    return jwt.verify(token, secret);
  },
};

module.exports = generateToken;

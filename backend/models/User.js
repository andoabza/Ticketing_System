const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["customer", "agent", "admin"],
    default: "customer",
  },
  createdAt: { type: Date, default: Date.now },
  avatar: String,
  lastLogin: Date,
  loginAttempts: { type: Number, default: 0 },
  lockUntil: Date,
});

UserSchema.methods.incrementLoginAttempts = function () {
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.update({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 },
    });
  }
  const updates = { $inc: { loginAttempts: 1 } };
  if (this.loginAttempts + 1 >= 5) {
    updates.$set = { lockUntil: Date.now() + 15 * 60 * 1000 }; // 15 min lock
  }
  return this.update(updates);
};

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

UserSchema.methods = {
  getSignedJwtToken() {
    return generateToken.getSignedJwtToken(this._id);
  },

  getRefreshToken() {
    return generateToken.getRefreshToken(this._id);
  },

  getVerificationToken() {
    const { token, expires } = generateToken.getVerificationToken();
    this.verificationToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
    this.verificationExpire = expires;
    return token;
  },

  getResetPasswordToken() {
    const { token, expires } = generateToken.getResetPasswordToken();
    this.resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
    this.resetPasswordExpire = expires;
    return token;
  },
};

module.exports = mongoose.model("User", UserSchema);

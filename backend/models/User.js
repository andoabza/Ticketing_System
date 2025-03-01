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

module.exports = mongoose.model("User", UserSchema);

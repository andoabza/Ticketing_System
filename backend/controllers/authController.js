const sendEmail = require("../utils/email");
const generateToken = require("../utils/generateToken");

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const user = await User.create({ name, email, password, role });

  // Generate verification token
  const verificationToken = user.getVerificationToken();
  await user.save({ validateBeforeSave: false });

  // Send verification email
  const verificationUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/verify/${verificationToken}`;

  await sendEmail({
    email: user.email,
    subject: "Account Verification",
    html: `Click <a href="${verificationUrl}">here</a> to verify your account`,
  });

  sendTokenResponse(user, 201, res);
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ErrorResponse("Please provide email and password", 400);
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    throw new ErrorResponse("Invalid credentials", 401);
  }

  if (!user.verified) {
    throw new ErrorResponse("Account not verified", 401);
  }

  sendTokenResponse(user, 200, res);
});

const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  const refreshToken = user.getRefreshToken();

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, // 24h
  };

  res
    .status(statusCode)
    .cookie("token", token, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json({ success: true, token });
};

exports.requestPasswordReset = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  await sendEmail({
    email: user.email,
    subject: "Password Reset Request",
    html: `Click <a href="${resetUrl}">here</a> to reset your password`,
  });

  res.status(200).json({ success: true });
});

exports.confirmPasswordReset = asyncHandler(async (req, res) => {
  const resetToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: resetToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
});

exports.verifyEmail = asyncHandler(async (req, res) => {
  const verificationToken = req.params.token;
  
  const user = await User.findOne({
    verificationToken,
    verificationExpire: { $gt: Date.now() }
  });

  user.verified = true;
  user.verificationToken = undefined;
  user.verificationExpire = undefined;
  await user.save();

  res.redirect(`${process.env.CLIENT_URL}/login?verified=true`);
});
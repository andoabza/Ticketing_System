const nodemailer = require("nodemailer");
//const logger = require("./logger");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

module.exports = async ({ email, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"Support Team" <${process.env.SMTP_USER}>`,
      to: email,
      subject,
      html,
    });
    console.log(`Email sent to ${email}`);
  } catch   (err) {
    console.log(`Email failed to send: ${err.message}`);
  }
};

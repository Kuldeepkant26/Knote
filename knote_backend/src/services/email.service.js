const nodemailer = require("nodemailer");
const { env } = require("../config/env");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.email.user,
    pass: env.email.pass,
  },
});

async function sendEmail({ to, subject, html }) {
  await transporter.sendMail({
    from: env.email.from,
    to,
    subject,
    html,
  });
}

async function sendPasswordResetEmail(to, resetUrl) {
  await sendEmail({
    to,
    subject: "Reset your Knote password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
        <h2>Reset your password</h2>
        <p>We received a request to reset your Knote account password. This link expires in ${env.resetTokenExpiresMin} minutes.</p>
        <p>
          <a href="${resetUrl}" style="display:inline-block;padding:10px 20px;background:#4f46e5;color:#fff;text-decoration:none;border-radius:6px;">
            Reset Password
          </a>
        </p>
        <p>If you didn't request this, you can safely ignore this email.</p>
        <p style="color:#888;font-size:12px;">If the button doesn't work, copy this link into your browser:<br/>${resetUrl}</p>
      </div>
    `,
  });
}

module.exports = { sendEmail, sendPasswordResetEmail };

const { env } = require("../config/env");

const BREVO_SEND_URL = "https://api.brevo.com/v3/smtp/email";

async function sendEmail({ to, subject, html }) {
  const res = await fetch(BREVO_SEND_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "api-key": env.email.brevoApiKey,
    },
    body: JSON.stringify({
      sender: { email: env.email.from, name: env.email.fromName },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Brevo email send failed (${res.status}): ${body}`);
  }
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

async function sendOtpEmail(to, otp) {
  await sendEmail({
    to,
    subject: "Verify your Knote account",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
        <h2>Verify your email</h2>
        <p>Use this code to finish creating your Knote account. It expires in ${env.otpExpiresMin} minutes.</p>
        <p style="text-align:center; margin: 24px 0;">
          <span style="display:inline-block; padding:14px 28px; background:#f4f4f5; border-radius:8px; font-size:28px; font-weight:700; letter-spacing:8px;">
            ${otp}
          </span>
        </p>
        <p>If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  });
}

module.exports = { sendEmail, sendPasswordResetEmail, sendOtpEmail };

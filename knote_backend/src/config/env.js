const requiredEnvVars = [
  "MONGO_URL",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
  "BREVO_API_KEY",
  "EMAIL_FROM",
];

function validateEnv() {
  const missing = requiredEnvVars.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
}

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: process.env.PORT || 5000,
  mongoUrl: process.env.MONGO_URL,
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
  },
  resetTokenExpiresMin: Number(process.env.RESET_TOKEN_EXPIRES_MIN) || 15,
  otpExpiresMin: Number(process.env.OTP_EXPIRES_MIN) || 10,
  email: {
    brevoApiKey: process.env.BREVO_API_KEY,
    from: process.env.EMAIL_FROM,
    fromName: process.env.EMAIL_FROM_NAME || "Knote",
  },
};

module.exports = { env, validateEnv };

import "dotenv/config";

function required(name: string): string {
  const value = process.env[name];
  if (!value && process.env.NODE_ENV === "production") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value ?? "";
}

export const env = {
  appId: required("APP_ID"),
  appSecret: required("APP_SECRET"),
  isProduction: process.env.NODE_ENV === "production",

  // Database optional for now
  databaseUrl: process.env.DATABASE_URL ?? "",

  // Resend email variables
  resendApiKey: process.env.RESEND_API_KEY ?? "",
  emailFrom: process.env.RESEND_FROM ?? "no-reply@kiwikoru.co.nz",
  emailTo: process.env.RESEND_TO ?? "kiwikoru3d@gmail.com",
};
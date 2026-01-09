import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const validateEnv = () => {
  const requiredEnvVars = [
    "MONGO_URI",
    "JWT_SECRET",
    "JWT_EXPIRES_IN",
    "PORT",

    // Email
    "EMAIL_HOST",
    "EMAIL_PORT",
    "EMAIL_USER",
    "EMAIL_PASS",
    "EMAIL_FROM",
    "ADMIN_EMAIL",

    // Cloudinary
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "CLOUDINARY_FOLDER_NAME",

    // reCAPTCHA
    "RECAPTCHA_SECRET_KEY",
  ];

  const missing = requiredEnvVars.filter(v => !process.env[v]);
  if (missing.length) {
    throw new Error(`❌ Missing env vars: ${missing.join(", ")}`);
  }
};

validateEnv();

export const config = {
  port: Number(process.env.PORT),
  mongoUri: process.env.MONGO_URI!,
  jwt: {
    secret: process.env.JWT_SECRET!,
    expiresIn: process.env.JWT_EXPIRES_IN!,
  },
  email: {
    host: process.env.EMAIL_HOST!,
    port: Number(process.env.EMAIL_PORT),
    user: process.env.EMAIL_USER!,
    pass: process.env.EMAIL_PASS!,
    from: process.env.EMAIL_FROM!,      // sender
    admin: process.env.ADMIN_EMAIL!,    // receiver
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    apiSecret: process.env.CLOUDINARY_API_SECRET!,
    folderName: process.env.CLOUDINARY_FOLDER_NAME!,
  },
  recaptcha: {
    secretKey: process.env.RECAPTCHA_SECRET_KEY!,
  },
};

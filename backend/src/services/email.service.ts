import nodemailer from "nodemailer";
import { config } from "../config/env";

/* ---------------- TRANSPORTER ---------------- */

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: config.email.port === 465,
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

/* ---------------- VERIFY ---------------- */

transporter.verify((error) => {
  if (error) {
    console.error("❌ Email transporter error:", error);
  } else {
    console.log("✅ Email transporter ready");
  }
});

/* ---------------- TYPES ---------------- */

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}

/* ---------------- SEND EMAIL ---------------- */

export const sendEmail = async ({
  to,
  subject,
  html,
  from,
  replyTo,
}: SendEmailOptions): Promise<void> => {
  await transporter.sendMail({
    from: from || `"Vikram Design Studio" <${config.email.from}>`,
    to,
    subject,
    html,
    replyTo,
  });
};

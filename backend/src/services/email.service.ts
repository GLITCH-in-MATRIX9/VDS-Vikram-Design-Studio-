import nodemailer from "nodemailer";
import { config } from "../config/env";

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: config.email.port === 465,
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

transporter.verify((error) => {
  if (error) {
    console.error("❌ Email transporter error:", error);
  } else {
    console.log("✅ Email transporter ready");
  }
});

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  type?: "admin" | "careers";   // 👈 added this
  replyTo?: string;
}

export const sendEmail = async ({
  to,
  subject,
  html,
  type = "admin",  // default = info@
  replyTo,
}: SendEmailOptions): Promise<void> => {

  const senderEmail =
    type === "careers"
      ? config.email.careers
      : config.email.from;

  const senderName =
    type === "careers"
      ? "Vikram Design Studio - Careers"
      : "Vikram Design Studio";

  await transporter.sendMail({
    from: `"${senderName}" <${senderEmail}>`,
    to,
    subject,
    html,
    replyTo,
  });
};
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
  from?: string;
  replyTo?: string;
}

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

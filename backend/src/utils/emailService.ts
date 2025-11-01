import nodemailer from 'nodemailer';
import { config } from '../config/env';

// The configuration now points to Brevo's SMTP server.
// Note that for port 587, `secure` is false because the connection
// starts in plain text and is then upgraded to a secure one using STARTTLS.
const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: false, // Important: false for port 587
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * @function sendEmail
 * @description Sends an email using the pre-configured transporter.
 */
export const sendEmail = async (options: EmailOptions) => {
  try {
    const info = await transporter.sendMail({
       from: `"Vikram Design Studio" <${config.email.from}>`, 
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
    console.log(`Email sent via Brevo: ${info.messageId}`);
  } catch (error) {
    console.error('Error sending email via Brevo:', error);
    // In a production app, integrate a more robust logging service here
    throw new Error('Email could not be sent.');
  }
};

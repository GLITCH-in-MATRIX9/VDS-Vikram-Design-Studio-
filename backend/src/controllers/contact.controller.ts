import { Response } from "express";
import { sendEmail } from "../services/email.service";
import { RecaptchaRequest } from "../middlewares/recaptcha.middleware";
import { config } from "../config/env";

export const sendContactEmail = async (
  req: RecaptchaRequest,
  res: Response
) => {
  try {
    const {
      firstName,
      lastName,
      company,
      mobileNumber,
      emailAddress,
      message,
    } = req.body;

    if (!req.recaptchaValid && process.env.NODE_ENV !== "development") {
      return res.status(400).json({
        success: false,
        message: "reCAPTCHA verification required",
      });
    }

    if (!firstName || !emailAddress || !mobileNumber || !message) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailAddress)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address",
      });
    }

    const sanitizedEmail = emailAddress.trim().toLowerCase();
    const fullName = `${firstName.trim()} ${lastName?.trim() || ""}`.trim();

    /* -------- ADMIN EMAIL -------- */

    const adminEmailHtml = `
      <h2>📩 New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${fullName}</p>
      <p><strong>Email:</strong> <a href="mailto:${sanitizedEmail}">${sanitizedEmail}</a></p>
      <p><strong>Mobile:</strong> ${mobileNumber}</p>
      ${company ? `<p><strong>Company:</strong> ${company}</p>` : ""}
      <hr />
      <p>${message.replace(/\n/g, "<br>")}</p>
      <small>Received on ${new Date().toLocaleString()}</small>
    `;

    await sendEmail({
      to: config.email.admin,
      subject: `📩 New Contact – ${fullName}`,
      html: adminEmailHtml,
      replyTo: sanitizedEmail,
    });


    await new Promise(resolve => setTimeout(resolve, 1500));

    /* -------- USER CONFIRMATION -------- */

    const confirmationHtml = `
      <p>Hi ${fullName},</p>
      <p>Thank you for contacting <strong>Vikram Design Studio</strong>.</p>
      <p>We have received your message and will get back to you shortly.</p>
      <blockquote>${message.replace(/\n/g, "<br>")}</blockquote>
      <p>Warm regards,<br/>VDS Team</p>
    `;

    await sendEmail({
      to: sanitizedEmail,
      subject: "Thank you for contacting Vikram Design Studio",
      html: confirmationHtml,
    });

    return res.json({
      success: true,
      message: "Contact form submitted successfully",
    });
  } catch (err: any) {
    console.error("❌ Contact email error:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

import { Request, Response } from 'express';
import { sendEmail } from '../utils/emailService';

export const sendContactEmail = async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body;

    // Comprehensive validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        message: 'All fields are required: name, email, subject, message',
        success: false
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: 'Please provide a valid email address',
        success: false
      });
    }

    // Input sanitization
    const sanitizedName = name.trim().substring(0, 100);
    const sanitizedEmail = email.trim().toLowerCase();
    const sanitizedSubject = subject.trim().substring(0, 200);
    const sanitizedMessage = message.trim().substring(0, 2000);

    if (sanitizedMessage.length < 10) {
      return res.status(400).json({
        message: 'Message must be at least 10 characters long',
        success: false
      });
    }

    // Create a professional HTML email template for contact form
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>New Contact Form Submission - VDS</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #2c3e50; color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { padding: 30px; background-color: #fff; border: 1px solid #e0e0e0; border-radius: 0 0 8px 8px; }
          .field { margin-bottom: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 5px; }
          .label { font-weight: 600; color: #2c3e50; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; }
          .value { margin-top: 8px; font-size: 16px; }
          .timestamp { color: #666; font-size: 12px; text-align: right; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>New Contact Form Submission</h2>
            <p>Vikram Design Studio</p>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">Name:</div>
              <div class="value">${sanitizedName}</div>
            </div>
            <div class="field">
              <div class="label">Email:</div>
              <div class="value">${sanitizedEmail}</div>
            </div>
            <div class="field">
              <div class="label">Subject:</div>
              <div class="value">${sanitizedSubject}</div>
            </div>
            <div class="field">
              <div class="label">Message:</div>
              <div class="value">${sanitizedMessage.replace(/\n/g, '<br>')}</div>
            </div>
            <div class="timestamp">
              Received: ${new Date().toLocaleString()}
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email to admin
    await sendEmail({
      to: process.env.EMAIL_FROM || 'admin@example.com', // Send to admin
      subject: `Contact Form: ${sanitizedSubject}`,
      html: emailHtml,
    });

    // Send confirmation email to user
    const confirmationHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Thank You for Contacting VDS</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #2c3e50; color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { padding: 30px; background-color: #fff; border: 1px solid #e0e0e0; border-radius: 0 0 8px 8px; }
          .message-box { background-color: #f8f9fa; padding: 20px; border-left: 4px solid #2c3e50; margin: 20px 0; border-radius: 0 5px 5px 0; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Thank You for Contacting Us!</h2>
            <p>Vikram Design Studio</p>
          </div>
          <div class="content">
            <p>Hi ${sanitizedName},</p>
            <p>Thank you for reaching out to us. We have received your message and will get back to you as soon as possible.</p>
            <p><strong>Your message:</strong></p>
            <div class="message-box">
              ${sanitizedMessage.replace(/\n/g, '<br>')}
            </div>
            <p>We typically respond within 24-48 hours during business days.</p>
            <div class="footer">
              <p>Best regards,<br><strong>The VDS Team</strong></p>
              <p style="font-size: 12px; margin-top: 15px;">
                This is an automated response. Please do not reply to this email.
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    await sendEmail({
      to: sanitizedEmail,
      subject: 'Thank you for contacting VDS - We\'ll be in touch soon!',
      html: confirmationHtml,
    });

    res.json({ 
      message: 'Contact form submitted successfully. We will get back to you soon!',
      success: true,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Contact email error:', error);
    
    // Don't expose internal error details in production
    const isProduction = process.env.NODE_ENV === 'production';
    
    res.status(500).json({ 
      message: 'Failed to send contact email. Please try again later.',
      success: false,
      ...(isProduction ? {} : { error: error.message })
    });
  }
};

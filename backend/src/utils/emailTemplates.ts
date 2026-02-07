interface ApplicantConfirmationData {
  name: string;
  jobTitle: string;
}

/**
 * @function getApplicantConfirmationHtml
 * @description Generates a professional, responsive HTML email template for applicant confirmation.
 * @param {ApplicantConfirmationData} data - The dynamic data for the email.
 * @returns {string} - The complete HTML string for the email body.
 */


export const getApplicantConfirmationHtml = (data: ApplicantConfirmationData): string => {
  const { name, jobTitle} = data;


  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Application Confirmation</title>
      <style>
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        table { border-collapse: collapse !important; }
        body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; font-family: 'Segoe UI', 'Roboto', Arial, sans-serif; }

        .container { width: 100%; max-width: 600px; margin: 0 auto; }
        .header { background-color: #ffffff; padding: 20px 30px; text-align: center; border-bottom: 1px solid #eaeaea; }
        .header h1 { margin: 0; color: #333333; font-family: 'Segoe UI', 'Roboto', Arial, sans-serif; font-size: 24px; font-weight: 300; }
        .content { background-color: #ffffff; padding: 40px 30px; font-size: 16px; line-height: 1.6; color: #555555; }
        .content p { margin: 0 0 20px 0; }
        .footer { padding: 20px 30px; text-align: center; font-size: 12px; color: #888888; }
      </style>
    </head>
    <body style="background-color: #f4f4f7; margin: 0 !important; padding: 0 !important;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td align="center" style="background-color: #f4f4f7; padding: 20px 0;">
            <table border="0" cellpadding="0" cellspacing="0" class="container" style="max-width: 600px; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
              <!-- HEADER -->
              <tr>
                <td align="center" class="header">
                  <h1 style="font-weight: 300;">Application Received</h1>
                </td>
              </tr>
              <!-- CONTENT - This is the part we've updated -->
              <tr>
                <td class="content">
                  <p>Hi ${name},</p>
                  <p>Thank you for applying for the <strong>${jobTitle}</strong> position.</p>
                  <p>We have successfully received your application and will review it shortly. If your qualifications match our needs, we will contact you for the next steps.</p>
                  <p style="margin-top: 30px; margin-bottom: 0;">Best regards,</p>
                  <p style="margin-top: 5px; margin-bottom: 0;">The Hiring Team</p>
                </td>
              </tr>
             
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

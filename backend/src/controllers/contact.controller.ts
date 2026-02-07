import { Request, Response } from "express";
import { sendEmail } from "../services/email.service";
import { config } from "../config/env";

const escapeHtml = (str: string) =>
  str.replace(
    /[&<>"']/g,
    (m) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[m]!,
  );

export const sendContactEmail = async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      company,
      mobileNumber,
      emailAddress,
      message,
    } = req.body;

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
    const sanitizedMobile = mobileNumber.trim();
    const fullName = `${firstName.trim()} ${lastName?.trim() || ""}`.trim();

    const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");

    /* ADMIN EMAIL */

    const adminEmailHtml = `
<!doctype html>
<html>
<head>
<meta charset="UTF-8"/>

<style>
@media only screen and (max-width:600px){
.wrapper{ padding:20px !important; }
.stack-column{ display:block !important; width:100% !important; }
.stack-column img{ margin-bottom:20px !important; }
}
</style>

</head>

<body style="margin:0;padding:0;background:#ffffff;">

<div style="font-family:Arial,Helvetica,sans-serif;padding:40px 0;">

<div class="wrapper" style="max-width:600px;margin:auto;padding:40px;background:#fff;color:#000;">

<p><strong>Subject:</strong> New Contact Form Submission</p>

<p>Hello Team,</p>

<p>A new contact enquiry has been received from the website.</p>

<div style="background:#f6f6f6;padding:18px;margin:20px 0;">
<p><strong>Name:</strong> ${fullName}</p>
<p><strong>Email:</strong> <a href="mailto:${sanitizedEmail}">${sanitizedEmail}</a></p>
<p><strong>Mobile:</strong> ${sanitizedMobile}</p>
${company ? `<p><strong>Company:</strong> ${company}</p>` : ""}
</div>

<div style="border-left:3px solid #000;padding-left:12px;">
${safeMessage}
</div>

<p style="margin-top:30px;font-size:14px;color:#555;">
Received on ${new Date().toLocaleString()}
</p>

<p>Regards,<br><strong>Website Contact System</strong></p>

<table width="100%" style="margin-top:30px;border-top:1px solid #444;padding-top:30px;">
<tr>

<td class="stack-column" width="180">
<img src="https://res.cloudinary.com/dlrkoth8o/image/upload/v1770216330/WPS_Photos_1_aswvwq.jpg" width="140"/>
</td>

<td class="stack-column" style="font-size:13px;line-height:1.6;">

<p style="font-weight:bold;">VIKRAM DESIGN STUDIO</p>

<p style="color:#c43b3b;">Architecture | Interior | Landscape | Engineer</p>

<p><i>82 Aastha Plaza, Guwahati - 781007, Assam</i></p>
<p><i>12W2 Mani Casadona, Kolkata - 700156, WB</i></p>

<p>+91 903 807 7180 | 0361 246 7180</p>

<p><a href="https://www.vikramdesignstudio.com">www.vikramdesignstudio.com</a></p>

</td>
</tr>
</table>

</div>

<!-- SOCIAL LINKS -->

<table width="100%" style="margin-top:20px;">
<tr>
<td align="center">

<a href="https://www.facebook.com/VikramDesignStudioOfficial/" style="margin:0 8px;">
<img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" width="20">
</a>

<a href="https://www.instagram.com/vikramdesignstudio/" style="margin:0 8px;">
<img src="https://cdn-icons-png.flaticon.com/512/733/733558.png" width="20">
</a>

<a href="https://www.linkedin.com/company/74880921/" style="margin:0 8px;">
<img src="https://cdn-icons-png.flaticon.com/512/3536/3536505.png" width="20">
</a>

<a href="https://www.youtube.com/@vikramdesignstudio4300/featured" style="margin:0 8px;">
<img src="https://cdn-icons-png.flaticon.com/512/733/733646.png" width="22">
</a>

</td>
</tr>
</table>

</div>

</body>
</html>
`;


    await sendEmail({
      to: config.email.admin,
      subject: `[CONTACT] ${fullName}`,
      html: adminEmailHtml,
      replyTo: sanitizedEmail,
    });

    /* USER CONFIRMATION */

    const confirmationHtml = `
<!doctype html>
<html>
<head>
<meta charset="UTF-8"/>

<style>
@media only screen and (max-width:600px){
.wrapper{ padding:20px !important; }
.stack-column{ display:block !important; width:100% !important; }
.stack-column img{ margin-bottom:20px !important; }
}
</style>

</head>

<body style="margin:0;padding:0;background:#ffffff;">

<div style="font-family:Arial,Helvetica,sans-serif;padding:40px 0;">

<div class="wrapper" style="max-width:600px;margin:auto;padding:40px;background:#fff;color:#000;">

<p><strong>Subject:</strong> Thank you for contacting Vikram Design Studio</p>

<p>Hi <strong>${fullName}</strong>,</p>

<p>
Thank you for reaching out to <strong>Vikram Design Studio</strong>.
We have successfully received your message.
</p>

<div style="background:#f6f6f6;padding:16px;margin:20px 0;">
${safeMessage}
</div>

<p>Warm regards,<br><strong>VDS Team</strong></p>

<table width="100%" style="margin-top:30px;border-top:1px solid #444;padding-top:30px;">
<tr>

<td class="stack-column" width="180">
<img src="https://res.cloudinary.com/dlrkoth8o/image/upload/v1770216330/WPS_Photos_1_aswvwq.jpg" width="140"/>
</td>

<td class="stack-column" style="font-size:13px;line-height:1.6;">

<p style="font-weight:bold;">VIKRAM DESIGN STUDIO</p>

<p style="color:#c43b3b;">Architecture | Interior | Landscape | Engineer</p>

<p><i>82 Aastha Plaza, Guwahati - 781007, Assam</i></p>
<p><i>12W2 Mani Casadona, Kolkata - 700156, WB</i></p>

<p>+91 903 807 7180 | 0361 246 7180</p>

<p><a href="https://www.vikramdesignstudio.com">www.vikramdesignstudio.com</a></p>

</td>
</tr>
</table>

</div>

</div>

</body>
</html>
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

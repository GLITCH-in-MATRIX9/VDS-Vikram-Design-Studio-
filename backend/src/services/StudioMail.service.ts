import { sendEmail } from "./email.service";
import { config } from "../config/env";

interface StudioMailData {
  applicantName: string;
  applicantEmail: string;
  position: string;
  answers: Record<string, any>;
}

/**
 * Send new application notification to studio
 */
export const sendStudioApplicationEmail = async (
  data: StudioMailData
): Promise<void> => {
  const { applicantName, applicantEmail, position, answers } = data;

  const htmlContent = `
<!doctype html>
<html>
<head>
<meta charset="UTF-8">

<style>

@media only screen and (max-width:600px){

.wrapper{
  padding:20px !important;
}

.stack-column{
  display:block !important;
  width:100% !important;
  max-width:100% !important;
}

.stack-column img{
  margin-bottom:20px !important;
}

}

</style>
</head>

<body style="margin:0;padding:0;background:#ffffff;">

<div style="font-family:Arial,Helvetica,sans-serif;background:#ffffff;padding:40px 0;">

<div class="wrapper" style="max-width:600px;margin:0 auto;background:#ffffff;color:#000;padding:40px;">



<p style="font-size:15px;margin-bottom:16px;">
Hello Team,
</p>

<p style="font-size:15px;margin-bottom:16px;">
A new job application has been submitted for the role of
<strong>${position}</strong>.
</p>

<div style="background:#f6f6f6;padding:18px;margin-bottom:20px;">
<p style="margin:0 0 6px;"><strong>Applicant Name:</strong> ${applicantName}</p>
<p style="margin:0 0 6px;"><strong>Email:</strong> ${applicantEmail}</p>
</div>

<p style="font-size:15px;margin-top:24px;">
Please log in to the admin dashboard to review and take action.
</p>

<p style="font-size:15px;margin-bottom:30px;">
Regards,<br>
<strong>Careers System</strong>
</p>

<!-- FOOTER -->

<table width="100%" cellpadding="0" cellspacing="0"
style="margin-top:30px;border-top:1px solid #444;padding-top:30px;">

<tr>

<td class="stack-column" width="180" valign="top" style="padding-right:20px;">

<img
src="https://res.cloudinary.com/dlrkoth8o/image/upload/v1770216330/WPS_Photos_1_aswvwq.jpg"
alt="Vikram Design Studio"
width="140"
style="display:block;border:0;outline:none;"
/>

</td>

<td class="stack-column" valign="top"
style="font-size:13px;line-height:1.6;color:#000;">

<p style="margin:0;font-weight:bold;letter-spacing:1px;">
VIKRAM DESIGN STUDIO
</p>

<p style="margin:6px 0;color:#c43b3b;font-weight:500;">
Architecture | Interior | Landscape | Engineer
</p>

<p style="margin:14px 0 0;font-style:italic;">
82 Aastha Plaza, Guwahati - 781007, Assam
</p>

<p style="margin:2px 0;font-style:italic;">
12W2 Mani Casadona, Kolkata - 700156, WB
</p>

<p style="margin:14px 0;">
+91 903 807 7180 | 0361 246 7180
</p>

<p style="margin:0;">
<a href="https://www.vikramdesignstudio.com"
style="color:#1a5cff;text-decoration:underline;">
www.vikramdesignstudio.com
</a>
</p>

</td>

</tr>

</table>

</div>

<!-- SOCIAL MEDIA -->

<table width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;">
<tr>
<td align="center" style="padding-top:10px;">

<a href="https://www.facebook.com/VikramDesignStudioOfficial/" style="margin:0 8px;display:inline-block;">
<img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" width="20">
</a>

<a href="https://www.instagram.com/vikramdesignstudio/" style="margin:0 8px;display:inline-block;">
<img src="https://cdn-icons-png.flaticon.com/512/733/733558.png" width="20">
</a>

<a href="https://www.linkedin.com/company/74880921/" style="margin:0 8px;display:inline-block;">
<img src="https://cdn-icons-png.flaticon.com/512/3536/3536505.png" width="20">
</a>

<a href="https://www.youtube.com/@vikramdesignstudio4300/featured" style="margin:0 8px;display:inline-block;">
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
    to: config.email.careers, // Studio / HR inbox
    subject: `New Application Received – ${position}`,
    html: htmlContent,
    replyTo: applicantEmail, // HR can reply directly
  });
};

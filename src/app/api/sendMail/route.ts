import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const {
      first_name,
      last_name,
      dob,
      phone,
      address,
      message,
    } = await req.json();

    // ==============================
    // VALIDATION
    // ==============================

    if (
      !first_name ||
      !last_name ||
      !dob ||
      !phone ||
      !address ||
      !message
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please fill all fields.",
        },
        { status: 400 }
      );
    }

    // ==============================
    // SMTP
    // ==============================

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // ==============================
    // COMPANY DETAILS
    // ==============================

    const companyName = "Ucast Media Private Limited";
    const managerName = "Surekha Chaparala";
    const companyEmail = "mailsupport@ulka.tv";
    const companyPhone = "+91 7416410222";

    const location = "Ameerpet, Hyderabad, Telangana";

    const companyAddress =
      "709, 7th Floor, Aditya Trade Center, Ameerpet, Hyderabad";

    // ==============================
    // ADMIN EMAIL
    // ==============================

    const mailOptions = {
      from: `"Ulka TV" <${process.env.SMTP_USER}>`,

      to: process.env.EMAIL_RECEIVER,

      subject: `New Application Submitted - ${first_name} ${last_name}`,

      attachments: [
        {
          filename: "ulka.jpg",
          path: `${process.cwd()}/public/ulka.jpg`,
          cid: "ulka-logo",
        },
      ],

      html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>

<body
style="
margin:0;
padding:0;
background:#f3f6fb;
font-family:Arial,Helvetica,sans-serif;
color:#1f2937;
"
>

<table
width="100%"
cellpadding="0"
cellspacing="0"
border="0"
style="background:#f3f6fb;padding:30px 15px;"
>
<tr>
<td align="center">

<table
width="650"
cellpadding="0"
cellspacing="0"
border="0"
style="
max-width:650px;
width:100%;
background:#ffffff;
border-radius:18px;
overflow:hidden;
border:1px solid #e5e7eb;
"
>

<!-- HEADER -->

<tr>
<td
style="
background:#172554;
padding:30px 25px;
text-align:center;
"
>

<img
src="cid:ulka-logo"
alt="Ulka TV"
style="
width:260px;
max-width:80%;
height:auto;
display:block;
margin:0 auto 18px;
"
/>

<h1
style="
margin:0;
color:#ffffff;
font-size:24px;
line-height:32px;
"
>
New Application Submitted
</h1>

<p
style="
margin:8px 0 0;
color:#dbeafe;
font-size:14px;
"
>
UlkaTV Customer Application
</p>

</td>
</tr>

<!-- BODY -->

<tr>
<td style="padding:30px 25px;">

<p
style="
margin:0 0 22px;
font-size:15px;
line-height:24px;
color:#4b5563;
"
>
A new customer application has been submitted
through the UlkaTV website.
</p>

<!-- CUSTOMER DETAILS -->

<div
style="
border:1px solid #e5e7eb;
border-radius:14px;
overflow:hidden;
"
>

<div
style="
background:#f8fafc;
padding:15px 18px;
border-bottom:1px solid #e5e7eb;
"
>

<strong
style="
font-size:16px;
color:#172554;
"
>
Customer Details
</strong>

</div>

<table
width="100%"
cellpadding="0"
cellspacing="0"
border="0"
>

<tr>
<td
style="
padding:13px 18px;
border-bottom:1px solid #f1f5f9;
width:40%;
color:#64748b;
"
>
First Name
</td>

<td
style="
padding:13px 18px;
border-bottom:1px solid #f1f5f9;
font-weight:600;
"
>
${first_name}
</td>
</tr>

<tr>
<td
style="
padding:13px 18px;
border-bottom:1px solid #f1f5f9;
color:#64748b;
"
>
Last Name
</td>

<td
style="
padding:13px 18px;
border-bottom:1px solid #f1f5f9;
font-weight:600;
"
>
${last_name}
</td>
</tr>

<tr>
<td
style="
padding:13px 18px;
border-bottom:1px solid #f1f5f9;
color:#64748b;
"
>
Date of Birth
</td>

<td
style="
padding:13px 18px;
border-bottom:1px solid #f1f5f9;
"
>
${dob}
</td>
</tr>

<tr>
<td
style="
padding:13px 18px;
border-bottom:1px solid #f1f5f9;
color:#64748b;
"
>
Phone
</td>

<td
style="
padding:13px 18px;
border-bottom:1px solid #f1f5f9;
"
>
<a
href="tel:${phone}"
style="color:#1d4ed8;text-decoration:none;"
>
${phone}
</a>
</td>
</tr>

<tr>
<td
style="
padding:13px 18px;
border-bottom:1px solid #f1f5f9;
color:#64748b;
vertical-align:top;
"
>
Address
</td>

<td
style="
padding:13px 18px;
border-bottom:1px solid #f1f5f9;
line-height:22px;
"
>
${address}
</td>
</tr>

<tr>
<td
style="
padding:13px 18px;
color:#64748b;
vertical-align:top;
"
>
Message
</td>

<td
style="
padding:13px 18px;
line-height:22px;
"
>
${message}
</td>
</tr>

</table>
</div>

<!-- COMPANY INFORMATION -->

<div
style="
margin-top:25px;
background:#eff6ff;
border:1px solid #dbeafe;
border-radius:14px;
padding:20px;
"
>

<h3
style="
margin:0 0 15px;
color:#172554;
font-size:17px;
"
>
Company Information
</h3>

<p style="margin:7px 0;font-size:14px;">
<strong>Manager:</strong>
${managerName}
</p>

<p style="margin:7px 0;font-size:14px;">
<strong>Company:</strong>
${companyName}
</p>

<p style="margin:7px 0;font-size:14px;">
<strong>Location:</strong>
${location}
</p>

<p style="margin:7px 0;font-size:14px;">
<strong>Phone:</strong>

<a
href="tel:${companyPhone}"
style="color:#1d4ed8;text-decoration:none;"
>
${companyPhone}
</a>

</p>

<p style="margin:7px 0;font-size:14px;">
<strong>Email:</strong>

<a
href="mailto:${companyEmail}"
style="color:#1d4ed8;text-decoration:none;"
>
${companyEmail}
</a>

</p>

<p
style="
margin:7px 0;
font-size:14px;
line-height:21px;
"
>
<strong>Office:</strong><br />
${companyAddress}
</p>

</div>

</td>
</tr>

<!-- FOOTER -->

<tr>
<td
style="
background:#f8fafc;
padding:20px;
text-align:center;
border-top:1px solid #e5e7eb;
"
>

<p
style="
margin:0;
font-size:13px;
color:#64748b;
"
>
This email was generated automatically from the UlkaTV website.
</p>

<p
style="
margin:7px 0 0;
font-size:13px;
color:#94a3b8;
"
>
© ${new Date().getFullYear()} ${companyName}
</p>

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`,
    };

    // ==============================
    // SEND EMAIL
    // ==============================

    await transporter.sendMail(mailOptions);

    console.log(
      `✅ Application email sent to ${process.env.EMAIL_RECEIVER}`
    );

    // ==============================
    // SUCCESS
    // ==============================

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully.",
    });
  } catch (error) {
    console.error("❌ Email send error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to send email. Please try again.",
      },
      { status: 500 }
    );
  }
}

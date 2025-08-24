const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", // or use host: "smtp.gmail.com"
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

async function sendEmail(email, otp) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Attendify - OTP Verification",
      html: `
  <div style="font-family: Arial, sans-serif; color: #333;">
    <h2 style="color: #4CAF50;">🔐 Verify Your Email Address</h2>
    <p>Dear User,</p>
    <p>Thank you for signing up with <strong>Attendify</strong>! To complete your registration, please use the OTP code below:</p>
    
    <h1 style="color: #000; background: #f4f4f4; padding: 10px; display: inline-block; border-radius: 5px;">
      ${otp}
    </h1>
    
    <p>This OTP is valid for <strong>5 minutes</strong>. Please do not share this code with anyone.</p>
    
    <p>If you did not request this, please ignore this email.</p>
    
    <p style="margin-top:20px;">Best regards,<br>
    <strong>The Attendify Team</strong></p>
    
    <hr>
    <small style="color: #777;">This is an automated email, please do not reply.</small>
  </div>
`,
    });
  console.log("Email sent to", email);
  } catch (err) {
    console.error("Email error:", err);
    throw new Error("Email sending failed");
  }
}

module.exports = sendEmail;

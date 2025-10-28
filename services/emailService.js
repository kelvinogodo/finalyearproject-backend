// services/emailService.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // app password
  },
  logger: true,
  debug: true,
});


/**
 * Send motion alert email
 * @param {string} to - Receiver email address
 * @param {string|null} imageUrl - Optional image URL
 */
export async function sendMotionEmail(to = process.env.ALERT_EMAIL, imageUrl = null) {
  const subject = "🚨 Motion Detected Alert";
  const htmlContent = `
    <div style="font-family:Arial, sans-serif; line-height:1.5;">
      <h2 style="color:#d9534f;">Motion Detected!</h2>
      <p>This is to notify you that motion was detected by your surveillance system.</p>
      ${
        imageUrl
          ? `<p>Here’s the latest captured image:</p>
             <img src="${imageUrl}" alt="Captured Image" style="max-width:100%; border-radius:8px;">`
          : `<p>No image was attached for this alert.</p>`
      }
      <p style="margin-top:20px;">Timestamp: ${new Date().toLocaleString()}</p>
    </div>
  `;

  const mailOptions = {
    from: `"Motion Alert System" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("📧 Motion alert email sent successfully to", to);
    console.log("✉️ Message ID:", info.messageId);
  } catch (error) {
    console.error("❌ Failed to send motion alert email:", error); // full error for debugging
    throw new Error("Email sending failed");
  }
}

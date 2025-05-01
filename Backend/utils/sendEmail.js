import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async (to, subject, otp) => {
  const msg = {
    to,
    from: process.env.SENDGRID_SENDER_EMAIL,
    replyTo: process.env.SENDGRID_REPLY_TO_EMAIL,
    subject,
    html: `
      <html>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f0f0; padding: 20px; margin: 0;">
          <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; padding: 40px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
            
            <!-- Title -->
            <h1 style="text-align: center; color: #0e594a; font-size: 32px; font-weight: 800; margin-bottom: 15px; letter-spacing: 1px;">
              IWB Technologies
            </h1>

            <!-- Welcome Message -->
            <p style="font-size: 16px; color: #555; line-height: 1.8; text-align: center;">
              Hello <strong>Customer</strong>,<br><br>
              We're thrilled to have you on board! To complete your registration, please verify your email address by entering the OTP below on our platform.
            </p>

            <!-- OTP Section -->
            <div style="background-color: #fbba3f; padding: 15px; border-radius: 8px; text-align: center; margin-top: 30px;">
              <h3 style="font-size: 36px; font-weight: bold; color: #ffffff; margin: 0;">${otp}</h3>
              <p style="font-size: 16px; color: #ffffff; margin-top: 10px;">This is your one-time verification code.</p>
            </div>

            <!-- Instructions -->
            <p style="font-size: 16px; color: #555; line-height: 1.6; text-align: center; margin-top: 40px;">
              Please enter this OTP to complete your registration process.<br><br>
              If you did not request this, please ignore this email.
            </p>

            <!-- Footer -->
            <hr style="border: 0; border-top: 1px solid #ddd; margin: 40px 0;" />
            <footer style="text-align: center; font-size: 14px; color: #0e594a;">
              <p>© ${new Date().getFullYear()} IWB Technologies. All rights reserved.</p>
            </footer>
          </div>
        </body>
      </html>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log(`Email successfully sent to ${to}`);
  } catch (error) {
    console.error(
      "Failed to send email:",
      error.response?.body || error.message
    );
  }
};

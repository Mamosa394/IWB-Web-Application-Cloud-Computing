import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js"; // Import sendEmail utility

export const signUp = async (req, res) => {
  const { username, email, password, adminCode } = req.body;

  try {
    // Check if the email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use." });
    }

    // Create new user
    const newUser = new User({
      username,
      email,
      password,
      role: adminCode === "IWB-ADMIN-2024" ? "admin" : "user",
    });

    await newUser.save();

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Send OTP email to the user
    await sendEmail(email, otp);

    // Optionally, you can save the OTP in a database if needed for later verification (not required by your current setup)
    // Example: await Otp.create({ email, otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) });

    res
      .status(201)
      .json({ message: "Sign up successful. OTP sent to your email." });
  } catch (error) {
    console.error("SignUp Error:", error);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again." });
  }
};

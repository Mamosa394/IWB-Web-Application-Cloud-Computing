import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const ADMIN_CODE = "IWB-ADMIN-2024";
const MAX_ADMINS = 3;

export const signup = async (req, res) => {
  try {
    const { username, email, password, role, adminCode } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (role === "admin") {
      const adminCount = await User.countDocuments({ role: "admin" });
      if (adminCount >= MAX_ADMINS)
        return res.status(403).json({ message: "Admin limit reached." });
      if (adminCode !== ADMIN_CODE)
        return res.status(401).json({ message: "Invalid admin code." });
    }

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ message: "Email already registered." });

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
      // Removed isVerified property
    });

    res.status(201).json({ message: "Signup successful. You can now log in." });
  } catch (error) {
    res.status(500).json({ message: "Signup failed", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Removed verification check (isVerified field)

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ token, isAdmin: user.role === "admin" });
  } catch (err) {
    res.status(500).json({ message: "Login error", error: err.message });
  }
};

export const getAdminCount = async (req, res) => {
  try {
    const count = await User.countDocuments({ role: "admin" });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: "Could not fetch admin count" });
  }
};

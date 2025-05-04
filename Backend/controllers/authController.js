import User from "../models/User.js";
import bcrypt from "bcryptjs";

// Signup Controller
export const signup = async (req, res) => {
  const { username, email, password, role, adminCode } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    let finalRole = "user";

    if (role === "admin") {
      if (adminCode !== "IWB-ADMIN-2024") {
        return res.status(401).json({ message: "Invalid admin code" });
      }
      finalRole = "admin";
    }

    const user = new User({
      username,
      email,
      password,
      role: finalRole,
    });

    await user.save();
    console.log("User saved:", user); // DEBUG LOG
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Signup error:", err); // DEBUG LOG
    res.status(500).json({ message: "Server error" });
  }
};

// Login Controller
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      message: "Logged in successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin count controller
export const getAdminCount = async (req, res) => {
  try {
    const adminCount = await User.countDocuments({ role: "admin" });
    res.json({ adminCount });
  } catch (err) {
    console.error("Error fetching admin count:", err);
    res.status(500).json({ message: "Server error" });
  }
};

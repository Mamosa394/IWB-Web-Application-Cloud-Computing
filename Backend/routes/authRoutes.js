import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";

const router = express.Router();

// Define max allowed users per role
const MAX_USERS = {
  sales: 3,
  admin: 3,
  finance: 3,
  investor: 3,
  client: Infinity // Allow unlimited clients
};

// SIGNUP
router.post("/signup", async (req, res) => {
  const { username, email, password, role = "client" } = req.body;

  if (!["sales", "admin", "finance", "investor", "client"].includes(role)) {
    return res.status(400).json({ error: "Invalid role." });
  }

  if (username.length < 3) {
    return res.status(400).json({ error: "Username must be at least 3 characters." });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ error: "Email already exists." });

    // Check if max number of users for this role has been reached
    const roleCount = await User.countDocuments({ role });
    if (roleCount >= MAX_USERS[role]) {
      return res.status(403).json({ error: `Maximum number of ${role} users reached.` });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role
    });

    await newUser.save();
    res.status(201).json({ message: "Signup successful." });
  } catch (err) {
    res.status(500).json({ error: "Server error during signup." });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid email or password." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid email or password." });

    res.status(200).json({
      message: "Login successful",
      user: {
        email: user.email,
        username: user.username,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Server error during login." });
  }
});

export default router;

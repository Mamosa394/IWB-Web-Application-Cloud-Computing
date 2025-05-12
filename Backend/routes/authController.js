import User from "../models/User.js";
import bcrypt from "bcryptjs";

// Define max users per role
const MAX_USERS = {
  sales: 3,
  admin: 3,
  finance: 3,
  investor: 3,
  client: Infinity, // Unlimited clients
};

export const signup = async (req, res) => {
  const { username, email, password, role, adminCode } = req.body;

  try {
    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Validate role
    if (!["sales", "admin", "finance", "investor", "client"].includes(role)) {
      return res.status(400).json({ message: "Invalid role specified." });
    }

    // Check if role has reached the max allowed users
    const roleCount = await User.countDocuments({ role });
    if (roleCount >= MAX_USERS[role]) {
      return res.status(403).json({ message: `Maximum number of ${role} users reached.` });
    }

    // Prevent random users from signing up as admin
    if (role === "admin" && adminCode !== process.env.ADMIN_CODE) {
      return res.status(403).json({ message: "Invalid admin registration code." });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    res.status(201).json({ message: "Signup successful. Please verify your email." });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

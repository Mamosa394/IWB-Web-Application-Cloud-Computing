import User from "../models/User.js";
import bcrypt from "bcryptjs";

// Signup Controller
export const signup = async (req, res) => {
  const { username, email, password, role, adminCode } = req.body;

  try {
    // Check if email already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Check if it's an admin signup and validate the admin code
    if (role === "admin" && adminCode !== "IWB-ADMIN-2024") {
      return res.status(401).json({ message: "Invalid admin code" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "user", // If no role, default to 'user'
    });

    await user.save();

    // Send back the user data and the redirection path based on the role
    const userData = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    if (user.role === "admin") {
      res.json({
        message: "Admin created successfully",
        user: userData,
        redirectTo: "/admin-dashboard", // Redirect to admin dashboard
      });
    } else {
      res.json({
        message: "User created successfully",
        user: userData,
        redirectTo: "/home-page", // Redirect to home page for regular users
      });
    }
  } catch (err) {
    console.error("Error during signup:", err);
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

    // Check if the user is verified (optional, for now we'll skip)
    if (!user.isVerified) {
      return res.status(401).json({ message: "User is not verified" });
    }

    // Store session userId (assuming session is used)
    req.session.userId = user._id;

    const userData = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role, // Send the role (user/admin)
    };

    if (user.role === "admin") {
      res.json({
        message: "Logged in successfully",
        user: userData,
        redirectTo: "/admin-dashboard", // Admin is redirected to admin dashboard
      });
    } else {
      res.json({
        message: "Logged in successfully",
        user: userData,
        redirectTo: "/home-page", // Regular user is redirected to home page
      });
    }
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: "Server error" });
  }
};

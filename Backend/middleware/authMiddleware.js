import jwt from "jsonwebtoken";
import User from "../models/userModel.js"; // Adjust the path if needed

// Middleware to verify the JWT token
export const protect = async (req, res, next) => {
  let token;

  // Check if token is present in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Decode the token to get user data
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user from the token's userId
      const user = await User.findById(decoded.id);

      // If user is not found
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Attach user to the request object
      req.user = user;

      // Proceed to the next middleware
      next();
    } catch (err) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  // If no token, send an error
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }
};

// Middleware to check if the user is an admin
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next(); // Proceed if the user is an admin
  } else {
    return res.status(403).json({ message: "Access denied, admin only" });
  }
};

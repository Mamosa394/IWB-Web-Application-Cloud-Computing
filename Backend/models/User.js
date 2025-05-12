import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, minLength: 3, maxLength: 20 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["sales", "admin", "finance", "investor", "client"],
    default: "client",
  }
});

const User = mongoose.model("User", userSchema);
export default User;

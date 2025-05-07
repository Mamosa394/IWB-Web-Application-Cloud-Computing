import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import "../styles/SignUp.css";
import robotImage from "/images/ROBOT.png";
import logo from "/images/logo.jpg";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    adminCode: "",
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { username, email, password, adminCode } = formData;

    if (!username || !email || !password) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    if (isAdmin && adminCode !== "IWB-ADMIN-2024") {
      setError("Invalid admin code.");
      setLoading(false);
      return;
    }

    const payload = {
      username,
      email,
      password,
      role: isAdmin ? "admin" : "user",
      ...(isAdmin && { adminCode }),
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        payload
      );

      if (response.status === 201) {
        const otpRoute = isAdmin ? "/otp/admin" : "/otp";
        navigate(otpRoute, { state: { email } });
      } else {
        setError("Signup failed. Please try again.");
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data?.message || "An error occurred.");
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-ui-container">
      <div className="left-panel">
        <div className="robot-wrapper">
          <img src={robotImage} alt="Robot" className="robot-img" />
          <div className="knee-caption">IWB Technologies</div>
        </div>
      </div>

      <div className="right-panel">
        <div className="signup-form-box">
          <div className="glow-border"></div>

          <h2>{isAdmin ? "Admin Sign Up" : "Create an account"}</h2>

          <div className="logo-wrapper">
            <img src={logo} alt="logo" className="logo" />
          </div>

          <p className="login-text">
            Already have an account?{" "}
            <span className="login-link" onClick={() => navigate("/login")}>
              Login
            </span>
          </p>

          <form onSubmit={handleSubmit}>
            <div className="input-wrapper">
              <FaUser className="input-icon" />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="sign-input"
                required
              />
            </div>

            <div className="input-wrapper">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="sign-input"
                required
              />
            </div>

            <div className="input-wrapper">
              <FaLock className="input-icon" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="sign-input"
                required
              />
            </div>

            {isAdmin && (
              <div className="input-wrapper">
                <FaLock className="input-icon" />
                <input
                  type="text"
                  name="adminCode"
                  placeholder="Enter Admin Code"
                  value={formData.adminCode}
                  onChange={handleChange}
                  className="sign-input"
                  required
                />
              </div>
            )}

            <div className="terms">
              <input type="checkbox" required className="tick" id="terms" />
              <label htmlFor="terms">I agree to the Terms & Conditions</label>
            </div>

            <div className="terms">
              <input
                type="checkbox"
                id="adminMode"
                className="tick"
                checked={isAdmin}
                onChange={() => setIsAdmin(!isAdmin)}
              />
              <label htmlFor="adminMode">Register as Admin</label>
            </div>

            {error && <p className="error">{error}</p>}

            <button type="submit" className="signup-btn" disabled={loading}>
              {loading
                ? "Submitting..."
                : isAdmin
                ? "Register Admin"
                : "Create account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaEnvelope, FaLock, FaShieldAlt } from "react-icons/fa";
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
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdminToggle = () => {
    setIsAdmin(!isAdmin);
    // Clear admin code when toggling
    if (!isAdmin) {
      setFormData((prev) => ({ ...prev, adminCode: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const { username, email, password, adminCode } = formData;

    // Validation
    if (!username || !email || !password) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    if (isAdmin && !adminCode) {
      setError("Admin registration code is required.");
      setLoading(false);
      return;
    }

    const payload = {
      username,
      email,
      password,
      role: isAdmin ? "admin" : "user",
      ...(isAdmin && { adminCode }), // Only include adminCode if registering as admin
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/signup`,
        payload,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setSuccess("Account created successfully! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      if (err.response) {
        setError(
          err.response.data?.message || "Registration failed. Please try again."
        );
      } else if (err.request) {
        setError("No response from server. Please try again later.");
      } else {
        setError("An unexpected error occurred.");
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

          <h2>{isAdmin ? "Admin Registration" : "Create an account"}</h2>

          <div className="logo-wrapper">
            <img src={logo} alt="logo" className="logo" />
          </div>

          <p className="login-text">
            Already have an account?{" "}
            <span className="login-link" onClick={() => navigate("/login")}>
              Login
            </span>
          </p>

          {error && <div className="alert error">{error}</div>}
          {success && <div className="alert success">{success}</div>}

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
                minLength={3}
                maxLength={20}
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
                placeholder="Password (min 6 characters)"
                value={formData.password}
                onChange={handleChange}
                className="sign-input"
                required
                minLength={6}
              />
            </div>

            {isAdmin && (
              <div className="input-wrapper">
                <FaShieldAlt className="input-icon" />
                <input
                  type="password"
                  name="adminCode"
                  placeholder="Admin Registration Code"
                  value={formData.adminCode}
                  onChange={handleChange}
                  className="sign-input"
                  required={isAdmin}
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
                onChange={handleAdminToggle}
              />
              <label htmlFor="adminMode">Register as Admin</label>
            </div>

            <button
              type="submit"
              className="signup-btn"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? (
                <span className="spinner"></span>
              ) : isAdmin ? (
                "Register Admin"
              ) : (
                "Create Account"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaEnvelope, FaLock, FaKey } from "react-icons/fa";
import "../styles/SignUp.css";
import "../styles/LoadingScreen.css";
import robotImage from "/images/ROBOT.png";
import logo from "/images/logo.jpg";

const LoadingScreen = () => (
  <div className="loading-screen">
    <div className="loader"><div></div><div></div><div></div><div></div></div>
    <p>Signing you up, please wait...</p>
  </div>
);

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "client",
    registrationCode: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [roleLimits, setRoleLimits] = useState({ current: {}, max: {} });
  const [showCodeField, setShowCodeField] = useState(false);

  const PRIVILEGED_ROLES = ["sales", "finance", "admin", "iwc"];

  useEffect(() => {
    // Fetch role limits from backend
    const fetchRoleLimits = async () => {
      try {
        const res = await axios.get("https://backend-8-gn1i.onrender.com/api/auth/role-limits");
        setRoleLimits(res.data);
      } catch (err) {
        console.error("Failed to fetch role limits.");
      }
    };

    fetchRoleLimits();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Show/hide registration code field based on role selection
    if (name === "role") {
      setShowCodeField(PRIVILEGED_ROLES.includes(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validate registration code for privileged roles
    if (PRIVILEGED_ROLES.includes(formData.role) && !formData.registrationCode) {
      setError("Registration code is required for this role");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("https://backend-8-gn1i.onrender.com/api/auth/signup", formData);
      setSuccess(res.data.message || "Account created successfully!");
      
      if (res.data.requiresMFA) {
        setTimeout(() => navigate("/setup-mfa"), 2000);
      } else {
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      const serverMessage = err.response?.data?.error || "Something went wrong. Please try again.";

      // Special handling for different error types
      if (serverMessage.includes("Maximum number")) {
        setError("That role is currently full. Please choose a different one.");
      } else if (serverMessage.includes("registration code")) {
        setError("Invalid registration code for this role");
      } else {
        setError(serverMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingScreen />;

  const roles = ["client", "admin", "sales", "finance", "investor", "iwc"];

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

          <h2>Create an Account</h2>

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
                placeholder="Username (min 3 characters)"
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

            <div className="input-wrapper">
              <label htmlFor="role">Select Role:</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="sign-input"
                required
              >
                {roles.map((role) => {
                  const current = roleLimits.current?.[role] ?? 0;
                  const max = roleLimits.max?.[role] ?? Infinity;
                  const isFull = current >= max;

                  return (
                    <option key={role} value={role} disabled={isFull}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                      {isFull ? " (Full)" : ""}
                      {PRIVILEGED_ROLES.includes(role) && !isFull ? " (Code Required)" : ""}
                    </option>
                  );
                })}
              </select>
            </div>

            {showCodeField && (
              <div className="input-wrapper">
                <FaKey className="input-icon" />
                <input
                  type="password"
                  name="registrationCode"
                  placeholder="Registration Code"
                  value={formData.registrationCode}
                  onChange={handleChange}
                  className="sign-input"
                  required={showCodeField}
                />
                <small className="code-hint">
                  Contact your administrator for the registration code
                </small>
              </div>
            )}

            <div className="terms">
              <input type="checkbox" required className="tick" id="terms" />
              <label htmlFor="terms">I agree to the Terms & Conditions</label>
            </div>

            <button
              type="submit"
              className="signup-btn"
              disabled={loading}
              aria-busy={loading}
            >
              Create Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
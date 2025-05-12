import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
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
    role: "client"
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [roleLimits, setRoleLimits] = useState({ current: {}, max: {} });

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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.post("https://backend-8-gn1i.onrender.com/api/auth/signup", formData);
      setSuccess(res.data.message || "Account created successfully!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      const serverMessage = err.response?.data?.error || "Something went wrong. Please try again.";

      // If it's a "role full" error, customize message
      if (serverMessage.includes("Maximum number")) {
        setError("That role is currently full. Please choose a different one.");
      } else {
        setError(serverMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingScreen />;

  const roles = ["client", "admin", "sales", "finance", "investor"];

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
                    </option>
                  );
                })}
              </select>
            </div>

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

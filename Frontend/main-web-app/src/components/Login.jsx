import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Login.css";
import "../styles/LoadingScreen.css";
import robotImage from "/images/ROBOT.png";
import { FaEnvelope, FaLock, FaShieldAlt } from "react-icons/fa";

const LoadingScreen = () => (
  <div className="loading-screen">
    <div className="loader">
      <div></div><div></div><div></div><div></div>
    </div>
    <p>Logging you in, please wait...</p>
  </div>
);

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    email: "", 
    password: "",
    mfaCode: "" 
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [requiresMFA, setRequiresMFA] = useState(false);
  const [mfaSetupRequired, setMfaSetupRequired] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email: formData.email,
          password: formData.password,
          ...(requiresMFA && { mfaCode: formData.mfaCode })
        }
      );

      // Handle MFA setup requirement
      if (response.data.requiresMfaSetup) {
        setMfaSetupRequired(true);
        navigate("/setup-mfa", { state: { email: formData.email } });
        return;
      }

      // Store user info and token
      const { user, token } = response.data;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      // Redirect based on role with proper permissions
      redirectBasedOnRole(user.role);
      
    } catch (err) {
      if (err.response?.status === 206) {
        // Partial content - MFA required but not provided
        setRequiresMFA(true);
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const redirectBasedOnRole = (role) => {
    switch(role) {
      case "admin":
        navigate("/developer-dashboard"); // Matches brief's "developer" terminology
        break;
      case "sales":
        navigate("/sales-dashboard", { state: { canEdit: true } });
        break;
      case "finance":
        navigate("/income-statements", { state: { canEdit: true } });
        break;
      case "investor":
        navigate("/income-statements", { state: { canEdit: false } }); // Read-only
        break;
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="login-page-body">
      <div className="login-page-container">
        <div className="login-page-left-panel-container">
          <div className="login-page-left-panel">
            <div className="login-page-robot-container">
              <img src={robotImage} alt="Robot" className="login-page-robot-img" />
              <p className="login-page-knee-caption">
                YOUR IDEAS START HERE!
                <br />
                LOG IN TO MAKE THEM REAL.
              </p>
            </div>
          </div>
        </div>

        <div className="login-page-right-panel-container">
          <div className="login-page-right-panel">
            <div className="login-page-signup-form-box">
              <div className="login-page-glow-border"></div>
              <h2>Welcome back</h2>
              <p className="login-page-login-text">
                Don't have an account? <a href="/signup">Sign Up</a>
              </p>

              {error && <p className="login-page-error">{error}</p>}

              <form onSubmit={handleSubmit}>
                <div className="login-page-input-wrapper">
                  <FaEnvelope className="login-page-input-icon" />
                  <input
                    type="email"
                    className="login-page-input"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                  />
                </div>

                <div className="login-page-input-wrapper">
                  <FaLock className="login-page-input-icon" />
                  <input
                    type="password"
                    className="login-page-input"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                  />
                </div>

                {requiresMFA && (
                  <div className="login-page-input-wrapper">
                    <FaShieldAlt className="login-page-input-icon" />
                    <input
                      type="text"
                      className="login-page-input"
                      name="mfaCode"
                      value={formData.mfaCode}
                      onChange={handleChange}
                      placeholder="MFA Code"
                      required
                    />
                    <small className="mfa-hint">
                      Check your authenticator app for the 6-digit code
                    </small>
                  </div>
                )}

                <button
                  type="submit"
                  className="login-page-signup-btn"
                  disabled={loading}
                >
                  {requiresMFA ? "Verify MFA" : "Login"}
                </button>
              </form>

              <div className="login-page-footer">
                <a href="/forgot-password">Forgot password?</a>
                {requiresMFA && (
                  <a href="/recover-mfa" className="mfa-recovery-link">
                    Can't access your MFA device?
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
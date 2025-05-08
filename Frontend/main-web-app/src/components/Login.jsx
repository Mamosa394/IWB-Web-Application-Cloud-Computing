import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // import axios
import "../styles/Login.css";
import robotImage from "/images/ROBOT.png";

const Login = () => {
  const navigate = useNavigate();

  // form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", formData);

      // Save token/user info if needed
      // localStorage.setItem("token", response.data.token); // optional

      // Navigate to dashboard or home page
      navigate("/home-page"); // replace with your route
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-body">
      <div className="login-page-container">
        <div className="login-page-left-panel-container">
          <div className="login-page-left-panel">
            <div className="login-page-robot-container">
              <img
                src={robotImage}
                alt="Robot"
                className="login-page-robot-img"
              />
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
                Do not have an account? <a href="/signup">Sign Up</a>
              </p>

              <form onSubmit={handleSubmit}>
                <div className="login-page-input-wrapper">
                  <input
                    type="email"
                    className="login-page-input"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                  />
                </div>

                <div className="login-page-input-wrapper">
                  <input
                    type="password"
                    className="login-page-input"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                  />
                </div>

                {error && <p className="login-page-error">{error}</p>}

                <button
                  type="submit"
                  className="login-page-signup-btn"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

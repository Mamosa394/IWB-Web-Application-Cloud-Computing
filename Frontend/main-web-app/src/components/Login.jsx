import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import robotImage from "/images/ROBOT.png";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      setError("Please fill in both fields.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        if (!data.isVerified) {
          setError("Your account is not verified. Please check your email.");
          return;
        }

        // Save token to localStorage
        localStorage.setItem("token", data.token);

        // Verify token and fetch user profile
        const token = localStorage.getItem("token");

        // Make sure the token exists before attempting to use it
        if (!token) {
          setError("Failed to retrieve authentication token.");
          return;
        }

        const profileRes = await fetch(
          "http://localhost:5000/api/auth/profile",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          console.log("✅ Profile:", profileData);

          // Save profile to localStorage
          localStorage.setItem("userProfile", JSON.stringify(profileData));

          setTimeout(() => {
            navigate(profileData.isAdmin ? "/admin-dashboard" : "/home-page");
          }, 1500);
        } else {
          const profileError = await profileRes.json();
          setError(
            profileError.message || "Failed to fetch user profile with token."
          );
        }
      } else {
        setError(data.message || "Invalid email or password.");
      }
    } catch (err) {
      setLoading(false);
      setError("Unable to connect to the server. Please try again later.");
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
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="login-page-input-wrapper">
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
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

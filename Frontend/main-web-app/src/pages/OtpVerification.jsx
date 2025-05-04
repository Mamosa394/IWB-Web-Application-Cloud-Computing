import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/OtpVerification.css";

const OTPVerification = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "user@example.com";

  // Auto-fill dummy OTP on mount
  useEffect(() => {
    const randomOtp = Array.from({ length: 6 }, () =>
      Math.floor(Math.random() * 10).toString()
    );
    setOtp(randomOtp);
  }, []);

  const handleChange = (element, index) => {
    const value = element.value.replace(/\D/g, "");

    if (value.length === 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (element.nextSibling) {
        element.nextSibling.focus();
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const enteredOTP = otp.join("");

    if (enteredOTP.length !== 6) {
      setError("Please enter a 6-digit OTP.");
      setSuccess("");
      return;
    }

    // Dummy success
    setSuccess("OTP accepted . Redirecting...");
    setError("");
    setTimeout(() => navigate("/login"), 2000);
  };

  return (
    <div className="otp-container">
      <div className="otp-box">
        <h2>OTP Verification</h2>
        <p>
          Enter OTP sent to <b>{email}</b>
        </p>
        <form onSubmit={handleSubmit} className="otp-input-form">
          <div className="otp-input-group">
            {otp.map((data, i) => (
              <input
                key={i}
                type="text"
                maxLength="1"
                value={data}
                onChange={(e) => handleChange(e.target, i)}
                onFocus={(e) => e.target.select()}
                className="otp-input-box"
                style={{ color: "white" }}
              />
            ))}
          </div>

          {error && <p className="otp-error">{error}</p>}
          {success && <p className="otp-success">{success}</p>}

          <button type="submit" className="otp-verify-btn">
            Verify & Proceed
          </button>
        </form>
      </div>
    </div>
  );
};

export default OTPVerification;

// src/pages/Login.jsx
import "../styles/Login.css";
import Logo from "../images/logo.jpg";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showVideo, setShowVideo] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const { login, isAuthenticated, loading } = useAuth();

  // If already authenticated, skip login page
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  // Auto-hide intro video after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowVideo(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const uname = username.trim();
      if (!uname || !password) {
        setError("Please fill in both fields.");
        setSubmitting(false);
        return;
      }
      await login(uname, password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Login failed:", err);
      const msg =
        err?.message ||
        err?.response?.data?.message ||
        "Invalid username or password. Please try again.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // While /check-auth is running
  if (loading) {
    return (
      <div className="login-background">
        <div className="login-container">
          <p>Checking session...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {showVideo ? (
        // Intro video
        <div className="intro-container">
          <video
            autoPlay
            muted
            className="intro-video"
            onEnded={() => setShowVideo(false)}
          >
            <source
              src="/Green Modern Grocery Delivery Video.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>
      ) : (
        // Login form
        <div className="login-background">
          <form onSubmit={handleLogin}>
            <div className="login-container">
              <img src={Logo} alt="logo" />
              <h1>
                <b>Grocery Store Login</b>
              </h1>

              <input
                type="text"
                value={username}
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
                required
              />

              <input
                type="password"
                value={password}
                placeholder="Password"
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <div className="login-links">
                <p>
                  <Link to="/signup">Forgot Password? or SignUp</Link>
                </p>
              </div>

              <button type="submit" disabled={submitting}>
                {submitting ? "Logging in..." : "𝕃𝕠𝕘𝕚𝕟"}
              </button>

              {error && <p className="error">{error}</p>}
            </div>
          </form>
        </div>
      )}
    </>
  );
}

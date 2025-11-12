import "../styles/Login.css";
import Logo from "../images/logo.jpg";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showVideo, setShowVideo] = useState(true); // 👈 show video initially
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(username, password);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Invalid username or password");
    }
  };

  // ⏳ Automatically hide video after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowVideo(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showVideo ? (
        // 🎬 Intro video screen
        <div className="intro-container">
          <video
            autoPlay
            muted
            className="intro-video"
            onEnded={() => setShowVideo(false)}
          >
            <source src="/Green Modern Grocery Delivery Video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      ) : (
        // 🔐 Login form after video
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

            <button type="submit">𝕃𝕠𝕘𝕚𝕟</button>
            {error && <p className="error">{error}</p>}
          </div>

          <div className="login-links">
            <p>
              <Link to="/signup">Forgot Password? or SignUp</Link>
            </p>
          </div>
        </form>
      )}
    </>
  );
}

import "../styles/Signup.css";
import Logo from "../images/logo.jpg";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post(
        "https://expireyeye.onrender.com/signup",
        { username, password, email },
        { withCredentials: true }
      );
      navigate("/"); // go to login after signup
    } catch (err) {
      console.error(err);
      setError("Signup failed: " + (err.response?.data?.error || "Server error"));
    }
  };

  return (
    <div className="login-background">
    <div className="signup-container">
      <img src={Logo} alt="logo" />
      <h1><b>Grocery Store Signup</b></h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSignup}>
        <input
          id="name"
          value={username}
          type="text"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          id="email"
          type="email"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          id="password"
          type="password"
          value={password}
          placeholder="Password"
          autoComplete="new-password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">𝕊𝕚𝕘𝕟 𝕌𝕡</button>
        <p><Link to="/">Already have an account? Login</Link></p>
      </form>
    </div>
    </div>
  );
}

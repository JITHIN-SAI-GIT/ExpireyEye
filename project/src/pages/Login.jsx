import "../styles/Login.css";
import Logo from "../images/logo.jpg";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext"; // ✅ import auth context

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ access login function

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // ✅ Use the login function from the context directly
      // It handles the API call AND updates the global state.
      await login(username, password);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Invalid username or password");
    }
  };

  return (
    <>
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

          <button type="submit">Login</button>
          {error && <p className="error">{error}</p>}
        </div>
      </form>

      <div>
        <p>
          <Link to="/signup">Forgot Password? or SignUp</Link>
        </p>
      </div>
    </>
  );
}

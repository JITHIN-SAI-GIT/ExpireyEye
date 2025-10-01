import { Navbar, Container, Form, Button } from "react-bootstrap";
import logo from "../images/fulllogo.jpg";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/header.css";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Header() {
  const [expanded, setExpanded] = useState(false); 
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );
  const navigate = useNavigate();

  // Keep login state updated if localStorage changes
  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(localStorage.getItem("isAuthenticated") === "true");
    };
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("username");
    setIsAuthenticated(false);
    navigate("/"); // redirect to login
  };

  const handleProtectedNav = (path) => {
    if (isAuthenticated) navigate(path);
    else navigate("/"); // redirect to login if not authenticated
  };

  return (
    <Navbar
      expand="lg"
      expanded={expanded}
      onToggle={setExpanded}
      fixed="top"
      className="shadow-sm py-3 navbar-gradient"
    >
      <Container className="d-flex align-items-center justify-content-between">
        <Navbar.Brand>
          <img
            src={logo}
            alt="Logo"
            style={{ height: 50, borderRadius: 10, cursor: "pointer" }}
            onClick={() => handleProtectedNav("/dashboard")}
          />
        </Navbar.Brand>

        <Form
          className="d-flex search-bar"
          style={{ flex: 1, maxWidth: 400, margin: "0 20px" }}
          onSubmit={(e) => e.preventDefault()}
        >
          <Form.Control
            type="text"
            placeholder="Search groceries..."
            className="me-2"
          />
          <Button type="submit" style={{ backgroundColor: "#35742f", borderColor: "#35742f" }}>
            Search
          </Button>
        </Form>

        <div className="d-flex align-items-center">
          {isAuthenticated && (
            <span
              className="me-3 text-dark"
              style={{ cursor: "pointer" }}
              onClick={() => handleProtectedNav("/alerts")}
            >
              <i className="fa-solid fa-triangle-exclamation fa-lg"></i>
            </span>
          )}

          {isAuthenticated ? (
            <Button variant="link" onClick={handleLogout} className="text-dark">
              Logout
            </Button>
          ) : (
            <>
              <Link to="/" className="me-3 text-dark">Login</Link>
              <Link to="/signup" className="text-dark">Signup</Link>
            </>

          )}
        </div>
      </Container>
    </Navbar>
  );
}

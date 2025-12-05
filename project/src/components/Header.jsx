import { Navbar, Container, Form, Button } from "react-bootstrap";
import logo from "../images/fulllogo.jpg";
import { Link, useNavigate } from "react-router-dom";
import "../styles/header.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../contexts/AuthContext"; // ✅ correct path

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleProtectedNav = (path) => {
    if (isAuthenticated) navigate(path);
    else navigate("/");
  };

  return (
    <Navbar
      expand="lg"
      fixed="top"
      className="shadow-sm py-3 navbar-gradient"
      collapseOnSelect
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
        <div className="d-flex align-items-center">
          {isAuthenticated && (
            <span
              className="me-3 text-white"
              style={{ cursor: "pointer" }}
              onClick={() => handleProtectedNav("/alerts")}
            >
              <i className="fa-solid fa-triangle-exclamation fa-lg"></i>
            </span>
          )}
          {/* here performing the terenary operator */}
          {isAuthenticated ? (
            <>
              <span className="me-3 text-white">
                Hi, {user?.username || "User"}
              </span>
              <Button
                variant="link"
                onClick={handleLogout}
                className="text-dark"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/" className="me-3 text-white">
                <b>Login</b>
              </Link>
              <Link to="/signup" className="me-4 text-white">
                <b>Signup</b>
              </Link>
            </>
          )}  
        </div>
      </Container>
    </Navbar>
  );
}

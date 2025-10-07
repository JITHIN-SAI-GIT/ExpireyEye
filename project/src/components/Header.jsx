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
          <Button
            type="submit"
            style={{ backgroundColor: "#35742f", borderColor: "#35742f" }}
          >
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
          {/* here performing the terenary operator */}
          {isAuthenticated ? (
            <>
              <span className="me-3 text-dark">
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
              <Link to="/" className="me-3 text-dark">
                Login
              </Link>
              <Link to="/signup" className="text-dark">
                Signup
              </Link>
            </>
          )}
        </div>
      </Container>
    </Navbar>
  );
}

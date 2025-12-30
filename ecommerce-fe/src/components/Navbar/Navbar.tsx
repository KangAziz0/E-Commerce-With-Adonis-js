import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import { RootState } from "../../store/store";
import { Navbar as BSNavbar, Nav, Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const navigate = useNavigate();

  return (
    <BSNavbar expand="lg" className="mb-4" sticky="top" bg="white">
      <Container>
        <BSNavbar.Brand href="/" className="d-flex align-items-center fw-bold">
          <img
            src="/images/logo.jpg"
            alt="Happy Shop"
            style={{
              width: "50px",
              height: "50px",
              objectFit: "contain",
            }}
          />
        </BSNavbar.Brand>

        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            {user ? (
              <>
                <span className="navbar-text me-3">{user.name}</span>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => dispatch(logout())}
                  className="fw-bold"
                >
                  Logout
                </Button>
              </>
            ) : (
              <a
                href="/login"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/login");
                }}
                className="fw-bold"
                style={{
                  color: "#00AA5B",
                  textDecoration: "none",
                  fontWeight: "600",
                }}
              >
                Login
              </a>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
}

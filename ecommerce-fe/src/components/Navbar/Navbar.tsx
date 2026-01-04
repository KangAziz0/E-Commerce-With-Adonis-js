import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import { RootState } from "../../store/store";
import "./nav.css";
import {
  Navbar as BSNavbar,
  Nav,
  Container,
  Button,
  Dropdown,
  Image,
} from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const isAdmin = user?.is_admin;

  return (
    <BSNavbar expand="lg" className="mb-4" sticky="top" bg="white">
      <Container>
        <BSNavbar.Brand
          as={Link}
          to="/"
          className="d-flex align-items-center fw-bold"
        >
          <img
            src="/images/logo.jpg"
            alt="Happy Shop"
            style={{ width: 50, height: 50, objectFit: "contain" }}
          />
        </BSNavbar.Brand>

        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            {user ? (
              <Dropdown align="end">
                <Dropdown.Toggle className="profile-toggle d-flex align-items-center gap-2 p-0">
                  <Image
                    src={user.avatar || "/images/default-avatar.jpg"}
                    roundedCircle
                    width={32}
                    height={32}
                    alt="Profile"
                  />
                  <span className="fw-semibold text-dark">{user.name}</span>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {/* Admin Panel Link - Only show for admin/seller */}
                  {isAdmin && (
                    <>
                      <Dropdown.Item onClick={() => navigate("/cms")}>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          style={{
                            marginRight: "8px",
                            display: "inline-block",
                            verticalAlign: "middle",
                          }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          />
                        </svg>
                        <span className="fw-semibold text-success">
                          Dashboard Admin
                        </span>
                      </Dropdown.Item>
                      <Dropdown.Divider />
                    </>
                  )}

                  <Dropdown.Item onClick={() => navigate("/profile")}>
                    👤 Lihat Profile
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => navigate("/orders")}>
                    📦 Pesanan Saya
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => navigate("/wishlist")}>
                    ❤️ Wishlist
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout} className="text-danger">
                    🚪 Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Button
                variant="link"
                className="fw-bold text-success text-decoration-none"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
}

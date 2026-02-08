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
  Badge,
  Form,
  InputGroup,
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
    <BSNavbar
      expand="lg"
      className="modern-navbar shadow-sm"
      sticky="top"
      style={{
        backgroundColor: "white",
        padding: "1rem 0",
      }}
    >
      <Container>
        {/* Logo/Brand */}
        <BSNavbar.Brand
          as={Link}
          to="/"
          className="d-flex align-items-center gap-2"
          style={{ marginRight: "2rem" }}
        >
          <div
            style={{
              width: "45px",
              height: "45px",
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
            }}
          >
            <span
              style={{ fontSize: "24px", fontWeight: "bold", color: "white" }}
            >
              🛍️
            </span>
          </div>
          <span
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            HappyShop
          </span>
        </BSNavbar.Brand>

        <BSNavbar.Toggle
          aria-controls="basic-navbar-nav"
          style={{
            border: "none",
            padding: "0.5rem",
          }}
        >
          <span style={{ fontSize: "1.5rem" }}>☰</span>
        </BSNavbar.Toggle>

        <BSNavbar.Collapse id="basic-navbar-nav">
          {/* Search Bar - Desktop */}
          <div
            className="d-none d-lg-flex mx-auto"
            style={{ maxWidth: "500px", width: "100%" }}
          >
            <InputGroup>
              <Form.Control
                placeholder="Cari produk..."
                style={{
                  borderRadius: "50px 0 0 50px",
                  border: "2px solid #e5e7eb",
                  padding: "0.7rem 1.2rem",
                  fontSize: "0.95rem",
                }}
              />
              <Button
                style={{
                  background:
                    "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  border: "none",
                  borderRadius: "0 50px 50px 0",
                  padding: "0.7rem 1.5rem",
                  fontWeight: "600",
                }}
              >
                🔍
              </Button>
            </InputGroup>
          </div>

          <Nav className="ms-auto align-items-lg-center gap-3">
            {/* Search Bar - Mobile */}
            <div className="d-lg-none mb-3">
              <InputGroup>
                <Form.Control
                  placeholder="Cari produk..."
                  style={{
                    borderRadius: "50px 0 0 50px",
                    border: "2px solid #e5e7eb",
                    padding: "0.7rem 1.2rem",
                  }}
                />
                <Button
                  style={{
                    background:
                      "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    border: "none",
                    borderRadius: "0 50px 50px 0",
                    padding: "0.7rem 1.5rem",
                  }}
                >
                  🔍
                </Button>
              </InputGroup>
            </div>

            {/* Navigation Icons */}
            <Nav.Link as={Link} to="/categories" className="nav-icon-link">
              <div className="nav-icon-wrapper">
                <span style={{ fontSize: "1.3rem" }}>🏷️</span>
                <span className="nav-icon-text">Kategori</span>
              </div>
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/cart"
              className="nav-icon-link position-relative"
            >
              <div className="nav-icon-wrapper">
                <span style={{ fontSize: "1.3rem" }}>🛒</span>
                <Badge
                  bg="danger"
                  pill
                  style={{
                    position: "absolute",
                    top: "-5px",
                    right: "-5px",
                    fontSize: "0.7rem",
                    padding: "0.25rem 0.5rem",
                  }}
                >
                  3
                </Badge>
                <span className="nav-icon-text">Keranjang</span>
              </div>
            </Nav.Link>

            {user ? (
              <>
                <Nav.Link
                  as={Link}
                  to="/wishlist"
                  className="nav-icon-link position-relative d-none d-lg-block"
                >
                  <div className="nav-icon-wrapper">
                    <span style={{ fontSize: "1.3rem" }}>❤️</span>
                    <Badge
                      bg="danger"
                      pill
                      style={{
                        position: "absolute",
                        top: "-5px",
                        right: "-5px",
                        fontSize: "0.7rem",
                        padding: "0.25rem 0.5rem",
                      }}
                    >
                      5
                    </Badge>
                  </div>
                </Nav.Link>

                <Dropdown align="end">
                  <Dropdown.Toggle
                    className="profile-dropdown-toggle"
                    style={{
                      background:
                        "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
                      border: "2px solid #10b981",
                      borderRadius: "50px",
                      padding: "0.4rem 1rem 0.4rem 0.4rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.7rem",
                      fontWeight: "600",
                      color: "#059669",
                    }}
                  >
                    <Image
                      src={user.avatar || "/images/default-avatar.jpg"}
                      roundedCircle
                      width={35}
                      height={35}
                      alt="Profile"
                      style={{
                        border: "2px solid white",
                        objectFit: "cover",
                      }}
                    />
                    <span className="d-none d-lg-inline">{user.name}</span>
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="modern-dropdown-menu">
                    {/* User Info Header */}
                    <div
                      style={{
                        padding: "1rem",
                        background:
                          "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                        color: "white",
                        borderRadius: "12px 12px 0 0",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <div className="d-flex align-items-center gap-3">
                        <Image
                          src={user.avatar || "/images/default-avatar.jpg"}
                          roundedCircle
                          width={50}
                          height={50}
                          alt="Profile"
                          style={{ border: "3px solid white" }}
                        />
                        <div>
                          <div className="fw-bold fs-6">{user.name}</div>
                          <small style={{ opacity: 0.9 }}>{user.email}</small>
                        </div>
                      </div>
                    </div>

                    {isAdmin && (
                      <>
                        <Dropdown.Item
                          onClick={() => navigate("/cms")}
                          className="modern-dropdown-item"
                        >
                          <span className="dropdown-icon">📊</span>
                          <div>
                            <div
                              className="fw-semibold"
                              style={{ color: "#10b981" }}
                            >
                              Dashboard Admin
                            </div>
                            <small className="text-muted">
                              Kelola toko Anda
                            </small>
                          </div>
                        </Dropdown.Item>
                        <Dropdown.Divider />
                      </>
                    )}

                    <Dropdown.Item
                      onClick={() => navigate("/profile")}
                      className="modern-dropdown-item"
                    >
                      <span className="dropdown-icon">👤</span>
                      <span>Profile Saya</span>
                    </Dropdown.Item>

                    <Dropdown.Item
                      onClick={() => navigate("/orders")}
                      className="modern-dropdown-item"
                    >
                      <span className="dropdown-icon">📦</span>
                      <div className="d-flex align-items-center justify-content-between w-100">
                        <span>Pesanan Saya</span>
                        <Badge bg="success" pill style={{ fontSize: "0.7rem" }}>
                          2
                        </Badge>
                      </div>
                    </Dropdown.Item>

                    <Dropdown.Item
                      onClick={() => navigate("/wishlist")}
                      className="modern-dropdown-item"
                    >
                      <span className="dropdown-icon">❤️</span>
                      <span>Wishlist</span>
                    </Dropdown.Item>

                    <Dropdown.Item
                      onClick={() => navigate("/settings")}
                      className="modern-dropdown-item"
                    >
                      <span className="dropdown-icon">⚙️</span>
                      <span>Pengaturan</span>
                    </Dropdown.Item>

                    <Dropdown.Divider />

                    <Dropdown.Item
                      onClick={handleLogout}
                      className="modern-dropdown-item logout-item"
                    >
                      <span className="dropdown-icon">🚪</span>
                      <span>Keluar</span>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              <div className="d-flex gap-2">
                <Button
                  variant="outline-success"
                  onClick={() => navigate("/login")}
                  style={{
                    borderRadius: "50px",
                    padding: "0.6rem 1.5rem",
                    fontWeight: "600",
                    border: "2px solid #10b981",
                  }}
                >
                  Masuk
                </Button>
                <Button
                  onClick={() => navigate("/register")}
                  style={{
                    background:
                      "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    border: "none",
                    borderRadius: "50px",
                    padding: "0.6rem 1.5rem",
                    fontWeight: "600",
                  }}
                >
                  Daftar
                </Button>
              </div>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
}

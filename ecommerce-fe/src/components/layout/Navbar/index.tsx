import { useState } from "react";
import { Container, Dropdown } from "react-bootstrap";
import { FaClipboardList, FaShoppingCart, FaStore } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";

import { logout } from "@/features/auth/authSlice";
import { openCart } from "@/features/cart/cartSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import SearchDropdown from "./SearchDropdown";

const NAV_ITEMS = [
  { name: "Home", url: "/" },
  { name: "Shop", url: "/shop" },
] as const;

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const countCart = useAppSelector((state) => state.cart.items.length);
  const countWishlist = useAppSelector((state) => state.wishlist.items.length);
  const user = useAppSelector((state) => state.auth.user);

  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      {/* Search Dropdown — rendered above everything */}
      <SearchDropdown isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Top Bar */}
      <div
        className="text-white py-2 px-3"
        style={{ backgroundColor: "#1a1a1a", fontSize: "13px" }}
      >
        <Container className="d-flex justify-content-between align-items-center">
          <div
            style={{
              background: "#111",
              color: "#fff",
              fontSize: "12px",
              textAlign: "center",
              padding: "8px 16px",
              letterSpacing: "1.2px",
            }}
          >
            FREE SHIPPING on orders over $50{" "}
            <span style={{ color: "#f5c842", margin: "0 6px" }}>|</span>
            Use code:{" "}
            <span style={{ color: "#f5c842", fontWeight: 500 }}>
              WELCOME20
            </span>{" "}
            for 20% off{" "}
            <span style={{ color: "#f5c842", margin: "0 6px" }}>|</span> New
            arrivals every Friday
          </div>
          <div className="d-flex gap-4 align-items-center">
            {!user && (
              <NavLink
                to="/login"
                className="text-white text-decoration-none fw-semibold"
              >
                SIGN IN
              </NavLink>
            )}
            <a href="#" className="text-white text-decoration-none fw-semibold">
              FAQS
            </a>
          </div>
        </Container>
      </div>

      {/* Main Navbar */}
      <nav
        className="navbar navbar-expand-lg navbar-light bg-white border-bottom py-3 px-4"
        style={{ borderColor: "#e9ecef" }}
      >
        <Container>
          <div
            className="navbar-brand fw-bold fs-4 me-5"
            style={{
              fontSize: "20px",
              fontWeight: 600,
              letterSpacing: "3px",
              color: "#111",
            }}
          >
            LUMIÈRE
          </div>

          <button
            className="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNav"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="mainNav">
            <ul className="navbar-nav me-auto gap-1">
              {NAV_ITEMS.map((item) => (
                <li className="nav-item" key={item.name}>
                  <NavLink
                    to={item.url}
                    className={({ isActive }) =>
                      `nav-link px-3 fw-medium ${isActive ? "active-link" : ""}`
                    }
                    style={({ isActive }) => ({
                      color: isActive ? "#111" : "#555",
                      fontSize: "15px",
                      borderBottom: isActive ? "2px solid #e53935" : "none",
                      paddingBottom: "4px",
                    })}
                  >
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>

            <div className="d-flex align-items-center gap-3">
              {/* Search trigger */}
              <button
                onClick={() => setSearchOpen(true)}
                className="btn btn-link p-0 text-dark"
                style={{ fontSize: "18px" }}
                aria-label="Search"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>

              <button
                onClick={() => navigate("/wishlist")}
                className="btn btn-link p-0 text-dark position-relative"
                style={{ fontSize: "18px" }}
                aria-label="Wishlist"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {countWishlist > 0 && (
                  <span
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                    style={{ fontSize: "10px" }}
                  >
                    {countWishlist}
                  </span>
                )}
              </button>

              {!!user && (
                <button
                  onClick={() => navigate("/orders")}
                  className="btn btn-link p-0 text-dark position-relative"
                  style={{ fontSize: "18px" }}
                  aria-label="My Orders"
                >
                  <FaClipboardList />
                </button>
              )}

              <button
                onClick={() => dispatch(openCart())}
                className="btn btn-link p-0 text-dark position-relative"
                style={{ fontSize: "18px" }}
                aria-label="Cart"
              >
                <FaShoppingCart />
                {countCart > 0 && (
                  <span
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                    style={{ fontSize: "10px" }}
                  >
                    {countCart}
                  </span>
                )}
              </button>

              {!!user && (
                <Dropdown align="end">
                  <Dropdown.Toggle
                    variant="link"
                    className="p-0 text-dark d-flex align-items-center no-caret"
                    style={{ textDecoration: "none" }}
                  >
                    <div
                      className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center"
                      style={{
                        width: "32px",
                        height: "32px",
                        fontSize: "14px",
                      }}
                    >
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    {/* User info header */}
                    <div className="px-3 py-2">
                      <div className="fw-semibold" style={{ fontSize: "14px", color: "#111" }}>
                        {user.name}
                      </div>
                      <div className="text-muted" style={{ fontSize: "12px" }}>
                        {user.email}
                      </div>
                    </div>
                    <Dropdown.Divider />

                    <Dropdown.Item onClick={() => navigate("/profile")}>
                      <svg className="me-2" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      Lihat Profile
                    </Dropdown.Item>

                    <Dropdown.Item onClick={() => navigate("/orders")}>
                      <svg className="me-2" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M9 11l3 3L22 4" />
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                      </svg>
                      Pesanan Saya
                    </Dropdown.Item>

                    {user?.is_admin && (
                      <>
                        <Dropdown.Divider />
                        <Dropdown.Item
                          onClick={() => navigate("/admin")}
                          className="d-flex align-items-center gap-2"
                          style={{ color: "#1a1a1a", fontWeight: 600 }}
                        >
                          <span
                            className="d-inline-flex align-items-center justify-content-center rounded"
                            style={{
                              width: "22px",
                              height: "22px",
                              backgroundColor: "#111",
                              color: "#fff",
                              flexShrink: 0,
                            }}
                          >
                            <FaStore size={11} />
                          </span>
                          Dashboard Admin
                        </Dropdown.Item>
                      </>
                    )}

                    <Dropdown.Divider />
                    <Dropdown.Item
                      onClick={() => dispatch(logout())}
                      className="text-danger"
                    >
                      <svg className="me-2" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              )}
            </div>
          </div>
        </Container>
      </nav>
    </>
  );
};

export default Navbar;

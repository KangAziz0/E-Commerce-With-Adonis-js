import { logout } from "@/features/auth/authSlice";
import { openCart } from "@/features/cart/cardSlice";
import { RootState } from "@/store/store";
import React from "react";
import { Container, Dropdown } from "react-bootstrap";
import { FaShoppingCart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
const Navbar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const countCart = useSelector((state: RootState) => state.cart.items.length);
  const user = useSelector((state: RootState) => state.auth.user);

  const NavItem = [
    {
      name: "Home",
      url: "/",
    },
    {
      name: "Shop",
      url: "/shop",
    },
    {
      name: "Blog",
      url: "/blog",
    },
    {
      name: "Contact",
      url: "/contact",
    },
  ];

  return (
    <>
      {/* Top Bar */}
      <div
        className="text-white py-2 px-3 "
        style={{ backgroundColor: "#1a1a1a", fontSize: "13px" }}
      >
        <Container className="d-flex justify-content-between align-items-center">
          <span>Free shipping, 30-day return or refund guarantee.</span>
          <div className="d-flex gap-4 align-items-center">
            {!user && (
              <NavLink
                to={"/login"}
                className="text-white text-decoration-none fw-semibold"
              >
                SIGN IN
              </NavLink>
            )}
            <a href="#" className="text-white text-decoration-none fw-semibold">
              FAQS
            </a>
            <div className="d-flex align-items-center gap-1">
              <span className="fw-semibold">USD</span>
              <span>&#x25BE;</span>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Navbar */}
      <nav
        className="navbar navbar-expand-lg navbar-light bg-white border-bottom py-3 px-4"
        style={{ borderColor: "#e9ecef" }}
      >
        <Container>
          {/* Brand */}
          <a
            className="navbar-brand fw-bold fs-4 me-5"
            href="#"
            style={{ color: "#111", letterSpacing: "-0.5px" }}
          >
            Male fashion
            <span style={{ color: "#e53935" }}>.</span>
          </a>

          <button
            className="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Nav Links */}
          <div className="collapse navbar-collapse" id="mainNav">
            <ul className="navbar-nav me-auto gap-1">
              {NavItem.map((item) => (
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

            {/* Icons */}
            <div className="d-flex align-items-center gap-3">
              {/* Search */}
              <button
                className="btn btn-link p-0 text-dark"
                style={{ fontSize: "18px" }}
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

              {/* Wishlist */}
              <button
                className="btn btn-link p-0 text-dark"
                style={{ fontSize: "18px" }}
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
              </button>

              {/* Cart */}
              <button
                onClick={() => dispatch(openCart())}
                className="btn btn-link p-0 text-dark position-relative"
                style={{ fontSize: "18px" }}
              >
                <FaShoppingCart />

                {/* Badge */}
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
                    {/* Avatar */}
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
                    <Dropdown.Item onClick={() => navigate("/profile")}>
                      Lihat Profile
                    </Dropdown.Item>

                    <Dropdown.Divider />

                    <Dropdown.Item
                      onClick={() => dispatch(logout())}
                      className="text-danger"
                    >
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

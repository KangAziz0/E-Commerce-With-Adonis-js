import React, { useState } from "react";
import { Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";
const Navbar: React.FC = () => {
  const [cartCount] = useState(0);
  const [cartTotal] = useState(0.0);

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
            <a href="#" className="text-white text-decoration-none fw-semibold">
              SIGN IN
            </a>
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
              <a
                href="#"
                className="d-flex align-items-center gap-2 text-dark text-decoration-none"
                style={{ fontSize: "15px" }}
              >
                <span className="position-relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                  {cartCount > 0 && (
                    <span
                      className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                      style={{
                        backgroundColor: "#e53935",
                        fontSize: "10px",
                      }}
                    >
                      {cartCount}
                    </span>
                  )}
                </span>
                <span className="fw-medium">${cartTotal.toFixed(2)}</span>
              </a>
            </div>
          </div>
        </Container>
      </nav>
    </>
  );
};

export default Navbar;

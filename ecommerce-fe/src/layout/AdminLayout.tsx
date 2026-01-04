import React, { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Container, Nav, Dropdown } from "react-bootstrap";
import "./AdminLayout.css";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    // Add your logout logic here
    navigate("/");
  };

  return (
    <div className="admin-wrapper">
      {/* Modern Top Navbar */}
      <nav className="admin-navbar">
        <div className="navbar-content">
          <div className="navbar-left">
            <button className="toggle-btn" onClick={toggleSidebar}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <span className="navbar-brand">
              <span className="brand-icon">⚡</span>
              Admin Dashboard
            </span>
          </div>

          <div className="navbar-right">
            <button className="icon-btn" title="Notifications">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className="badge">3</span>
            </button>

            <Dropdown align="end">
              <Dropdown.Toggle as="button" className="user-dropdown">
                <div className="user-avatar">
                  <span>A</span>
                </div>
                <span className="user-name">Admin</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </Dropdown.Toggle>

              <Dropdown.Menu className="user-menu">
                <Dropdown.Item onClick={() => navigate("/")}>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  View Public Site
                </Dropdown.Item>
                <Dropdown.Item>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Profile Settings
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout}>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </nav>

      <div className="admin-container">
        {/* Modern Sidebar */}
        <aside className={`admin-sidebar ${sidebarOpen ? "open" : "closed"}`}>
          <div className="sidebar-content">
            {/* Dashboard */}
            <div className="sidebar-section">
              <div className="section-label">DASHBOARD</div>
              <Nav className="flex-column">
                <Nav.Item>
                  <Link
                    to="/cms"
                    className={`nav-link ${isActive("/cms") ? "active" : ""}`}
                  >
                    <svg
                      className="icon"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    <span className="text">Dashboard</span>
                  </Link>
                </Nav.Item>
                <Nav.Item>
                  <Link
                    to="/cms/analytics"
                    className={`nav-link ${
                      isActive("/cms/analytics") ? "active" : ""
                    }`}
                  >
                    <svg
                      className="icon"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    <span className="text">Analytics</span>
                  </Link>
                </Nav.Item>
              </Nav>
            </div>

            {/* Manajemen Produk */}
            <div className="sidebar-section">
              <div className="section-label">MANAJEMEN PRODUK</div>
              <Nav className="flex-column">
                <Nav.Item>
                  <Link
                    to="/cms/products"
                    className={`nav-link ${
                      isActive("/cms/products") ? "active" : ""
                    }`}
                  >
                    <svg
                      className="icon"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                    <span className="text">Produk</span>
                  </Link>
                </Nav.Item>
                <Nav.Item>
                  <Link
                    to="/cms/categories"
                    className={`nav-link ${
                      isActive("/cms/categories") ? "active" : ""
                    }`}
                  >
                    <svg
                      className="icon"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                    <span className="text">Kategori</span>
                  </Link>
                </Nav.Item>
                <Nav.Item>
                  <Link
                    to="/cms/brands"
                    className={`nav-link ${
                      isActive("/cms/brands") ? "active" : ""
                    }`}
                  >
                    <svg
                      className="icon"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                      />
                    </svg>
                    <span className="text">Brand</span>
                  </Link>
                </Nav.Item>
                <Nav.Item>
                  <Link
                    to="/cms/inventory"
                    className={`nav-link ${
                      isActive("/cms/inventory") ? "active" : ""
                    }`}
                  >
                    <svg
                      className="icon"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                      />
                    </svg>
                    <span className="text">Stok & Inventory</span>
                  </Link>
                </Nav.Item>
              </Nav>
            </div>

            {/* Transaksi & Pesanan */}
            <div className="sidebar-section">
              <div className="section-label">TRANSAKSI</div>
              <Nav className="flex-column">
                <Nav.Item>
                  <Link
                    to="/cms/orders"
                    className={`nav-link ${
                      isActive("/cms/orders") ? "active" : ""
                    }`}
                  >
                    <svg
                      className="icon"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    <span className="text">Pesanan</span>
                    <span className="badge-count">12</span>
                  </Link>
                </Nav.Item>
                <Nav.Item>
                  <Link
                    to="/cms/transactions"
                    className={`nav-link ${
                      isActive("/cms/transactions") ? "active" : ""
                    }`}
                  >
                    <svg
                      className="icon"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <span className="text">Transaksi</span>
                  </Link>
                </Nav.Item>
                <Nav.Item>
                  <Link
                    to="/cms/invoices"
                    className={`nav-link ${
                      isActive("/cms/invoices") ? "active" : ""
                    }`}
                  >
                    <svg
                      className="icon"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <span className="text">Invoice</span>
                  </Link>
                </Nav.Item>
              </Nav>
            </div>

            {/* Customer & Marketing */}
            <div className="sidebar-section">
              <div className="section-label">CUSTOMER & MARKETING</div>
              <Nav className="flex-column">
                <Nav.Item>
                  <Link
                    to="/cms/customers"
                    className={`nav-link ${
                      isActive("/cms/customers") ? "active" : ""
                    }`}
                  >
                    <svg
                      className="icon"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                    <span className="text">Pelanggan</span>
                  </Link>
                </Nav.Item>
                <Nav.Item>
                  <Link
                    to="/cms/reviews"
                    className={`nav-link ${
                      isActive("/cms/reviews") ? "active" : ""
                    }`}
                  >
                    <svg
                      className="icon"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                      />
                    </svg>
                    <span className="text">Review & Rating</span>
                  </Link>
                </Nav.Item>
                <Nav.Item>
                  <Link
                    to="/cms/promotions"
                    className={`nav-link ${
                      isActive("/cms/promotions") ? "active" : ""
                    }`}
                  >
                    <svg
                      className="icon"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                      />
                    </svg>
                    <span className="text">Promosi & Diskon</span>
                  </Link>
                </Nav.Item>
                <Nav.Item>
                  <Link
                    to="/cms/vouchers"
                    className={`nav-link ${
                      isActive("/cms/vouchers") ? "active" : ""
                    }`}
                  >
                    <svg
                      className="icon"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text">Voucher</span>
                  </Link>
                </Nav.Item>
              </Nav>
            </div>

            {/* Content Management */}
            <div className="sidebar-section">
              <div className="section-label">CONTENT</div>
              <Nav className="flex-column">
                <Nav.Item>
                  <Link
                    to="/cms/banners"
                    className={`nav-link ${
                      isActive("/cms/banners") ? "active" : ""
                    }`}
                  >
                    <svg
                      className="icon"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text">Banner & Slider</span>
                  </Link>
                </Nav.Item>
                <Nav.Item>
                  <Link
                    to="/cms/pages"
                    className={`nav-link ${
                      isActive("/cms/pages") ? "active" : ""
                    }`}
                  >
                    <svg
                      className="icon"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                      />
                    </svg>
                    <span className="text">Halaman</span>
                  </Link>
                </Nav.Item>
                <Nav.Item>
                  <Link
                    to="/cms/blog"
                    className={`nav-link ${
                      isActive("/cms/blog") ? "active" : ""
                    }`}
                  >
                    <svg
                      className="icon"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    <span className="text">Blog & Artikel</span>
                  </Link>
                </Nav.Item>
              </Nav>
            </div>

            {/* Pengaturan */}
            <div className="sidebar-section">
              <div className="section-label">PENGATURAN</div>
              <Nav className="flex-column">
                <Nav.Item>
                  <Link
                    to="/cms/shipping"
                    className={`nav-link ${
                      isActive("/cms/shipping") ? "active" : ""
                    }`}
                  >
                    <svg
                      className="icon"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
                      />
                    </svg>
                    <span className="text">Pengiriman</span>
                  </Link>
                </Nav.Item>
                <Nav.Item>
                  <Link
                    to="/cms/payments"
                    className={`nav-link ${
                      isActive("/cms/payments") ? "active" : ""
                    }`}
                  >
                    <svg
                      className="icon"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                    <span className="text">Metode Pembayaran</span>
                  </Link>
                </Nav.Item>
                <Nav.Item>
                  <Link
                    to="/cms/settings"
                    className={`nav-link ${
                      isActive("/cms/settings") ? "active" : ""
                    }`}
                  >
                    <svg
                      className="icon"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span className="text">Pengaturan Toko</span>
                  </Link>
                </Nav.Item>
              </Nav>
            </div>

            <div className="sidebar-section">
              <div className="section-label">QUICK ACCESS</div>
              <Nav className="flex-column">
                <Nav.Item>
                  <Link to="/" className="nav-link">
                    <svg
                      className="icon"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    <span className="text">Lihat Website</span>
                  </Link>
                </Nav.Item>
              </Nav>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main
          className={`admin-main ${
            sidebarOpen ? "sidebar-open" : "sidebar-closed"
          }`}
        >
          <Container fluid className="p-4">
            <Outlet />
          </Container>
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}
    </div>
  );
}

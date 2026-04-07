import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import "./nav.css";

const navLinks = [
  { name: "Men", path: "/products?category=men" },
  { name: "Women", path: "/products?category=women" },
  { name: "Stores", path: "/products" },
  { name: "Customer Support", path: "/support" },
];

const categories = [
  {
    name: "Winter Collections",
    columns: [
      ["Mobile Phones", "Shoes", "Sunglasses", "Accessories", "Bags"],
      ["Women Cloths", "Men Cloths", "Kids Collections", "Bags"],
    ],
    promo: { title: "Exclusive Winter Collection 2022", label: "Explore All" },
  },
];

export default function Navbar() {
  const [activeLink, setActiveLink] = useState("");
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [allCategoryOpen, setAllCategoryOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCatOpen, setMobileCatOpen] = useState(false);
  const [mobileCatExpanded, setMobileCatExpanded] = useState<string | null>(
    null,
  );
  const megaRef = useRef<any>(null);
  const catBtnRef = useRef<any>(null);

  // Close mega menu on outside click
  useEffect(() => {
    const handleClick = (e: any) => {
      if (
        megaRef.current &&
        !megaRef.current.contains(e.target) &&
        catBtnRef.current &&
        !catBtnRef.current.contains(e.target)
      ) {
        setAllCategoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setMobileMenuOpen(false);
        setMobileCatOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <nav
        className="navbar navbar-light bg-white border-bottom"
        style={{ position: "relative", zIndex: 1100, padding: "0.6rem 1.5rem" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            gap: 0,
          }}
        >
          {/* ── Brand ── */}
          <NavLink className="nb-brand me-3" to="/">
            <span className="slash">/</span>RARESTOEUR
          </NavLink>

          {/* ══ DESKTOP NAV ══ */}
          <div className="nb-desktop-nav d-flex align-items-center flex-grow-1">
            <button
              ref={catBtnRef}
              className={`all-cat-btn ${allCategoryOpen ? "open" : ""}`}
              onClick={() => setAllCategoryOpen((v) => !v)}
            >
              <svg
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
              All Category
              <svg
                width="12"
                height="12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
                style={{
                  transform: allCategoryOpen ? "rotate(180deg)" : "rotate(0)",
                  transition: "transform 0.2s",
                }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            <div className="divider-v" />

            <div className="d-flex align-items-center">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  onClick={() => setActiveLink(link.name)}
                  to={link.path}
                  className={`nav-top-link ${
                    activeLink === link.name ? "active" : ""
                  }`}
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          </div>

          {/* ══ DESKTOP ICONS ══ */}
          <div className="nb-desktop-icons d-flex align-items-center ms-auto gap-1">
            <button className="icon-btn" title="Account">
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
            </button>
            <button className="icon-btn" title="Wishlist">
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                viewBox="0 0 24 24"
              >
                <path d="M12 21C12 21 3 13.5 3 8a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 5.5-9 13-9 13z" />
              </svg>
            </button>
            <button className="icon-btn" title="Cart">
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                viewBox="0 0 24 24"
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <span className="cart-badge">2</span>
            </button>
          </div>

          {/* ══ MOBILE: Cart + Hamburger ══ */}
          <div className="ms-auto d-flex align-items-center gap-2 d-lg-none">
            <button className="icon-btn" title="Cart">
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                viewBox="0 0 24 24"
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <span className="cart-badge">2</span>
            </button>
            <button
              className="nb-toggler"
              onClick={() => {
                setMobileMenuOpen((v) => !v);
                setAllCategoryOpen(false);
              }}
            >
              <span
                style={{
                  transform: mobileMenuOpen
                    ? "rotate(45deg) translate(4px, 5px)"
                    : "none",
                  transition: "transform 0.22s",
                }}
              />
              <span
                style={{
                  opacity: mobileMenuOpen ? 0 : 1,
                  transition: "opacity 0.18s",
                }}
              />
              <span
                style={{
                  transform: mobileMenuOpen
                    ? "rotate(-45deg) translate(4px, -5px)"
                    : "none",
                  transition: "transform 0.22s",
                }}
              />
            </button>
          </div>
        </div>

        {/* ════════ DESKTOP MEGA MENU ════════ */}
        {allCategoryOpen && (
          <div className="mega-menu-wrapper" ref={megaRef}>
            <div className="mega-sidebar">
              {categories.map((cat) => (
                <div
                  key={cat.name}
                  className={`mega-sidebar-item ${activeCategory.name === cat.name ? "active" : ""}`}
                  onMouseEnter={() => setActiveCategory(cat)}
                  onClick={() => setActiveCategory(cat)}
                >
                  <span>{cat.name}</span>
                  {cat.columns.length > 0 && <span className="chevron">›</span>}
                </div>
              ))}
            </div>

            <div className="mega-content">
              {activeCategory.columns.length > 0 ? (
                activeCategory.columns.map((col, ci) => (
                  <div key={ci} className="mega-col">
                    {col.map((item) => (
                      <NavLink
                        key={item}
                        to={`/products?category=${item.toLowerCase().replace(/\s+/g, "-")}`}
                        className={({ isActive }) =>
                          `mega-link ${isActive ? "active" : ""}`
                        }
                      >
                        {item}
                      </NavLink>
                    ))}
                  </div>
                ))
              ) : (
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#bbb",
                    fontSize: "0.9rem",
                  }}
                >
                  Konten segera tersedia
                </div>
              )}
              {activeCategory.promo && (
                <div className="mega-promo ms-auto">
                  <div className="mega-promo-title">
                    {activeCategory.promo.title}
                  </div>
                  <button className="mega-promo-btn">
                    {activeCategory.promo.label}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ════════ MOBILE DRAWER ════════ */}
        {mobileMenuOpen && (
          <div className="mobile-drawer">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href="#"
                className={`mobile-nav-link ${activeLink === link.name ? "active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveLink(link.name);
                  setMobileMenuOpen(false);
                }}
              >
                {link.name}
                {activeLink === link.name && (
                  <svg
                    width="14"
                    height="14"
                    fill="none"
                    stroke="#e25c1a"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </a>
            ))}

            {/* All Category accordion */}
            <div
              className="mobile-cat-header"
              onClick={() => setMobileCatOpen((v) => !v)}
            >
              <span>All Category</span>
              <svg
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
                style={{
                  transform: mobileCatOpen ? "rotate(180deg)" : "rotate(0)",
                  transition: "transform 0.2s",
                }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>

            {mobileCatOpen && (
              <div>
                {categories.map((cat) => (
                  <div key={cat.name}>
                    <div
                      className={`mobile-cat-item ${mobileCatExpanded === cat.name ? "active" : ""}`}
                      onClick={() =>
                        setMobileCatExpanded(
                          mobileCatExpanded === cat.name ? null : cat.name,
                        )
                      }
                    >
                      <span>{cat.name}</span>
                      {cat.columns.length > 0 && (
                        <svg
                          width="12"
                          height="12"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          viewBox="0 0 24 24"
                          style={{
                            transform:
                              mobileCatExpanded === cat.name
                                ? "rotate(90deg)"
                                : "rotate(0)",
                            transition: "transform 0.2s",
                          }}
                        >
                          <polyline points="9 6 15 12 9 18" />
                        </svg>
                      )}
                    </div>
                    {mobileCatExpanded === cat.name &&
                      cat.columns.length > 0 && (
                        <div className="mobile-cat-subitems">
                          {[...new Set(cat.columns.flat())].map((item) => (
                            <NavLink
                              key={item}
                              to={`/products?category=${item.toLowerCase()}`}
                              className="mobile-cat-subitem"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {item}
                            </NavLink>
                          ))}
                        </div>
                      )}
                  </div>
                ))}
              </div>
            )}

            {/* Mobile icons row */}
            <div className="mobile-icons">
              {[
                {
                  label: "Account",
                  icon: (
                    <svg
                      width="22"
                      height="22"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                    </svg>
                  ),
                },
                {
                  label: "Wishlist",
                  icon: (
                    <svg
                      width="22"
                      height="22"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 21C12 21 3 13.5 3 8a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 5.5-9 13-9 13z" />
                    </svg>
                  ),
                },
              ].map(({ label, icon }) => (
                <div key={label} className="mobile-icon-item">
                  <button className="icon-btn" title={label}>
                    {icon}
                  </button>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

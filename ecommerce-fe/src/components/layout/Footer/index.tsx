import React, { useState } from "react";
import { Container } from "react-bootstrap";

const Footer: React.FC = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Subscribed:", email);
    setEmail("");
  };

  const paymentIcons: { label: string; color: string; text: string }[] = [
    { label: "Bitcoin", color: "#f7931a", text: "₿" },
    { label: "Amex", color: "#016fd0", text: "AMEX" },
    { label: "PayPal", color: "#003087", text: "PayPal" },
    { label: "Mastercard", color: "#eb001b", text: "MC" },
    { label: "Visa", color: "#1a1f71", text: "VISA" },
  ];

  return (
    <footer style={{ backgroundColor: "#1a1a1a", color: "#ccc" }}>
      <Container className="py-5">
        <div className="row">
          {/* Brand + Description */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h4
              className="fw-bold mb-3"
              style={{
                color: "#fff",
                letterSpacing: "-0.5px",
                fontSize: "22px",
              }}
            >
              Male fashion
              <span style={{ color: "#e53935" }}> .</span>
            </h4>
            <p
              style={{
                fontSize: "14px",
                lineHeight: "1.7",
                color: "#aaa",
                maxWidth: "230px",
              }}
            >
              The customer is at the heart of our unique business model, which
              includes design.
            </p>

            {/* Payment Icons */}
            <div className="d-flex flex-wrap gap-2 mt-3">
              {paymentIcons.map((icon) => (
                <div
                  key={icon.label}
                  title={icon.label}
                  className="d-flex align-items-center justify-content-center rounded"
                  style={{
                    backgroundColor: icon.color,
                    color: "#fff",
                    fontSize: "10px",
                    fontWeight: "bold",
                    width: "42px",
                    height: "28px",
                    letterSpacing: "0.3px",
                  }}
                >
                  {icon.text}
                </div>
              ))}
            </div>
          </div>

          {/* Shopping Links 1 */}
          <div className="col-lg-2 col-md-3 mb-4 offset-lg-1">
            <h6
              className="fw-bold mb-3 text-uppercase"
              style={{ color: "#fff", letterSpacing: "1px", fontSize: "13px" }}
            >
              Shopping
            </h6>
            <ul className="list-unstyled" style={{ fontSize: "14px" }}>
              {["Clothing Store", "Trending Shoes", "Accessories", "Sale"].map(
                (item) => (
                  <li key={item} className="mb-2">
                    <a
                      href="#"
                      className="text-decoration-none"
                      style={{ color: "#aaa", transition: "color 0.2s" }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.color = "#fff")
                      }
                      onMouseOut={(e) => (e.currentTarget.style.color = "#aaa")}
                    >
                      {item}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Shopping Links 2 */}
          <div className="col-lg-2 col-md-3 mb-4">
            <h6
              className="fw-bold mb-3 text-uppercase"
              style={{ color: "#fff", letterSpacing: "1px", fontSize: "13px" }}
            >
              Shopping
            </h6>
            <ul className="list-unstyled" style={{ fontSize: "14px" }}>
              {[
                "Contact Us",
                "Payment Methods",
                "Delivery",
                "Return & Exchanges",
              ].map((item) => (
                <li key={item} className="mb-2">
                  <a
                    href="#"
                    className="text-decoration-none"
                    style={{ color: "#aaa", transition: "color 0.2s" }}
                    onMouseOver={(e) => (e.currentTarget.style.color = "#fff")}
                    onMouseOut={(e) => (e.currentTarget.style.color = "#aaa")}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-lg-4 col-md-6 mb-4">
            <h6
              className="fw-bold mb-3 text-uppercase"
              style={{ color: "#fff", letterSpacing: "1px", fontSize: "13px" }}
            >
              Newsletter
            </h6>
            <p style={{ fontSize: "14px", color: "#aaa", lineHeight: "1.6" }}>
              Be the first to know about new arrivals, look books, sales &
              promos!
            </p>
            <form onSubmit={handleSubscribe} className="mt-3">
              <div
                className="d-flex align-items-center"
                style={{
                  borderBottom: "1px solid #555",
                  paddingBottom: "4px",
                }}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="bg-transparent border-0 flex-grow-1 text-white"
                  style={{
                    outline: "none",
                    fontSize: "14px",
                    color: "#aaa",
                  }}
                />
                <button
                  type="submit"
                  className="btn btn-link p-0 ms-2"
                  style={{ color: "#aaa" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      </Container>

      {/* Bottom Bar */}
      <div
        style={{
          borderTop: "1px solid #333",
          padding: "16px 0",
          textAlign: "center",
          fontSize: "13px",
          color: "#777",
        }}
      >
        Copyright &copy; 2024 All rights reserved | This template is made with{" "}
        <span style={{ color: "#e53935" }}>&#9825;</span> by{" "}
        <a href="#" style={{ color: "#e53935", textDecoration: "none" }}>
          Colorlib
        </a>
      </div>
    </footer>
  );
};

export default Footer;

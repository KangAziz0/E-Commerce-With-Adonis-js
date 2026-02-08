import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./footer.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="simple-footer">
      {/* Main Footer Content */}
      <div className="footer-content">
        <Container>
          <Row className="g-4">
            {/* Brand Column */}
            <Col lg={4} md={6}>
              <div className="footer-brand-simple">
                <div className="brand-logo">
                  <span className="logo-icon">🛍️</span>
                  <span className="logo-text">HappyShop</span>
                </div>
                <p className="brand-tagline">
                  Belanja mudah, harga terbaik, kualitas terjamin
                </p>
                <div className="social-icons">
                  <a href="#" className="social-icon">
                    📘
                  </a>
                  <a href="#" className="social-icon">
                    📷
                  </a>
                  <a href="#" className="social-icon">
                    🐦
                  </a>
                  <a href="#" className="social-icon">
                    💬
                  </a>
                </div>
              </div>
            </Col>

            {/* Quick Links */}
            <Col lg={2} md={6} sm={6}>
              <h6 className="footer-heading">Produk</h6>
              <ul className="footer-list">
                <li>
                  <Link to="/products">Semua Produk</Link>
                </li>
                <li>
                  <Link to="/categories">Kategori</Link>
                </li>
                <li>
                  <Link to="/new">Terbaru</Link>
                </li>
                <li>
                  <Link to="/promo">Promo</Link>
                </li>
              </ul>
            </Col>

            {/* Support Links */}
            <Col lg={3} md={6} sm={6}>
              <h6 className="footer-heading">Bantuan</h6>
              <ul className="footer-list">
                <li>
                  <Link to="/help">Pusat Bantuan</Link>
                </li>
                <li>
                  <Link to="/shipping">Pengiriman</Link>
                </li>
                <li>
                  <Link to="/track">Lacak Pesanan</Link>
                </li>
                <li>
                  <Link to="/faq">FAQ</Link>
                </li>
              </ul>
            </Col>

            {/* Contact */}
            <Col lg={3} md={6}>
              <h6 className="footer-heading">Kontak</h6>
              <ul className="footer-contact-list">
                <li>
                  <span className="icon">📍</span>
                  <span>Jakarta, Indonesia</span>
                </li>
                <li>
                  <span className="icon">📞</span>
                  <span>+62 812-3456-7890</span>
                </li>
                <li>
                  <span className="icon">✉️</span>
                  <span>info@happyshop.com</span>
                </li>
              </ul>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="text-center text-md-start mb-2 mb-md-0">
              <p className="copyright">
                © {currentYear} HappyShop. All rights reserved.
              </p>
            </Col>
            <Col md={6} className="text-center text-md-end">
              <div className="payment-info">
                <span className="payment-text">💳 Pembayaran Aman</span>
                <span className="divider">•</span>
                <span className="payment-text">✅ Terpercaya</span>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </footer>
  );
}

import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Accordion,
  Badge,
  Form,
  InputGroup,
  Button,
} from "react-bootstrap";
import { faqData } from "@/data/faq";

const categories = [
  "Semua",
  "Pemesanan",
  "Pembayaran",
  "Pengiriman",
  "Pengembalian",
];

const categoryColors: Record<string, string> = {
  Pemesanan: "primary",
  Pembayaran: "success",
  Pengiriman: "warning",
  Pengembalian: "danger",
};

const FAQ: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const filtered = faqData.filter((item) => {
    const matchCat =
      activeCategory === "Semua" || item.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      item.question.toLowerCase().includes(q) ||
      item.answer.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Lora:ital,wght@0,500;1,400&display=swap');

        .faq-wrapper {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #f8f6f2;
          min-height: 100vh;
          padding: 64px 0 96px;
        }

        .faq-hero-badge {
          display: inline-block;
          background: #1a1a2e;
          color: #e8c97e;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          padding: 6px 16px;
          border-radius: 100px;
          margin-bottom: 20px;
        }

        .faq-title {
          font-family: 'Lora', serif;
          font-size: clamp(2rem, 5vw, 3.2rem);
          font-weight: 500;
          color: #1a1a2e;
          line-height: 1.2;
          margin-bottom: 14px;
        }

        .faq-title em {
          font-style: italic;
          color: #c8873a;
        }

        .faq-subtitle {
          color: #6b6b7b;
          font-size: 1rem;
          line-height: 1.7;
          max-width: 480px;
        }

        .faq-search-box {
          border: 2px solid #e0ddd7 !important;
          border-radius: 12px !important;
          padding: 14px 20px !important;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.95rem;
          background: #fff !important;
          color: #1a1a2e !important;
          box-shadow: none !important;
          transition: border-color 0.2s;
        }

        .faq-search-box:focus {
          border-color: #c8873a !important;
          box-shadow: 0 0 0 3px rgba(200,135,58,0.12) !important;
        }

        .faq-search-box::placeholder {
          color: #b0aaa0;
        }

        .search-icon-btn {
          border: 2px solid #e0ddd7 !important;
          border-left: none !important;
          border-radius: 0 12px 12px 0 !important;
          background: #fff !important;
          color: #b0aaa0 !important;
          padding: 0 18px !important;
          transition: all 0.2s;
        }

        .search-icon-btn:hover {
          background: #fff9f2 !important;
          color: #c8873a !important;
        }

        .cat-pill {
          border: 2px solid #e0ddd7;
          background: #fff;
          color: #6b6b7b;
          font-size: 0.875rem;
          font-weight: 600;
          padding: 8px 20px;
          border-radius: 100px;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .cat-pill:hover {
          border-color: #c8873a;
          color: #c8873a;
        }

        .cat-pill.active {
          background: #1a1a2e;
          border-color: #1a1a2e;
          color: #e8c97e;
        }

        .faq-card {
          background: #fff;
          border: 2px solid #ede9e2;
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: 12px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .faq-card:hover {
          border-color: #c8873a;
          box-shadow: 0 4px 24px rgba(200,135,58,0.08);
        }

        .faq-card.open-card {
          border-color: #1a1a2e;
          box-shadow: 0 6px 32px rgba(26,26,46,0.1);
        }

        .faq-question-btn {
          background: transparent !important;
          border: none !important;
          width: 100%;
          text-align: left;
          padding: 22px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          cursor: pointer;
          transition: background 0.15s;
        }

        .faq-question-btn:hover {
          background: #fdf9f4 !important;
        }

        .faq-question-text {
          font-size: 1rem;
          font-weight: 700;
          color: #1a1a2e;
          line-height: 1.4;
        }

        .faq-question-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #f3f0ea;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #1a1a2e;
          font-size: 18px;
          font-weight: 300;
          transition: all 0.25s ease;
        }

        .faq-question-icon.rotated {
          transform: rotate(45deg);
          background: #1a1a2e;
          color: #e8c97e;
        }

        .faq-answer {
          overflow: hidden;
          max-height: 0;
          transition: max-height 0.35s ease, opacity 0.25s ease;
          opacity: 0;
        }

        .faq-answer.open {
          max-height: 400px;
          opacity: 1;
        }

        .faq-answer-inner {
          padding: 0 24px 24px;
          color: #555462;
          font-size: 0.95rem;
          line-height: 1.75;
          border-top: 1px solid #f0ece5;
          padding-top: 18px;
        }

        .faq-cat-badge {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          padding: 3px 10px;
          border-radius: 100px;
          margin-right: 10px;
          flex-shrink: 0;
        }

        .faq-empty {
          text-align: center;
          padding: 64px 24px;
          color: #9b9690;
        }

        .faq-empty-icon {
          font-size: 3rem;
          margin-bottom: 16px;
        }

        .faq-stats {
          font-size: 0.85rem;
          color: #9b9690;
          font-weight: 500;
        }

        .contact-card {
          background: linear-gradient(135deg, #1a1a2e 0%, #2d2d50 100%);
          border-radius: 20px;
          padding: 40px;
          color: #fff;
          position: relative;
          overflow: hidden;
        }

        .contact-card::before {
          content: '';
          position: absolute;
          top: -40px;
          right: -40px;
          width: 180px;
          height: 180px;
          border-radius: 50%;
          background: rgba(232,201,126,0.08);
        }

        .contact-card::after {
          content: '';
          position: absolute;
          bottom: -60px;
          right: 40px;
          width: 240px;
          height: 240px;
          border-radius: 50%;
          background: rgba(200,135,58,0.06);
        }

        .contact-title {
          font-family: 'Lora', serif;
          font-size: 1.6rem;
          font-weight: 500;
          margin-bottom: 10px;
          color: #e8c97e;
        }

        .contact-desc {
          color: #a8a8c0;
          font-size: 0.9rem;
          line-height: 1.7;
          margin-bottom: 24px;
        }

        .contact-btn {
          background: #c8873a !important;
          border: none !important;
          border-radius: 10px !important;
          font-weight: 700 !important;
          font-family: 'Plus Jakarta Sans', sans-serif !important;
          padding: 12px 28px !important;
          font-size: 0.9rem !important;
          letter-spacing: 0.3px;
          transition: all 0.2s !important;
        }

        .contact-btn:hover {
          background: #a86c28 !important;
          transform: translateY(-1px);
        }

        .divider-line {
          height: 2px;
          background: linear-gradient(to right, transparent, #e0ddd7, transparent);
          margin: 48px 0;
          border: none;
        }

        @media (max-width: 768px) {
          .faq-wrapper { padding: 40px 0 64px; }
          .faq-question-btn { padding: 18px 16px; }
          .faq-answer-inner { padding: 14px 16px 18px; }
          .contact-card { padding: 28px 24px; }
        }
      `}</style>

      <div className="faq-wrapper">
        <Container>
          {/* Hero Section */}
          <Row className="mb-5">
            <Col lg={7}>
              <span className="faq-hero-badge">Pusat Bantuan</span>
              <h1 className="faq-title">
                Ada yang bisa kami
                <br />
                <em>bantu jelaskan?</em>
              </h1>
              <p className="faq-subtitle">
                Temukan jawaban atas pertanyaan yang paling sering ditanyakan
                seputar belanja, pembayaran, pengiriman, dan pengembalian
                barang.
              </p>
            </Col>
          </Row>

          {/* Search */}
          <Row className="mb-4">
            <Col md={8} lg={6}>
              <InputGroup>
                <Form.Control
                  className="faq-search-box"
                  placeholder="Cari pertanyaan..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setActiveKey(null);
                  }}
                  style={{ borderRadius: "12px 0 0 12px" }}
                />
              </InputGroup>
            </Col>
          </Row>

          {/* Category Filter */}
          <Row className="mb-4">
            <Col>
              <div className="d-flex flex-wrap gap-2 align-items-center">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`cat-pill ${activeCategory === cat ? "active" : ""}`}
                    onClick={() => {
                      setActiveCategory(cat);
                      setActiveKey(null);
                    }}
                  >
                    {cat}
                  </button>
                ))}
                <span className="faq-stats ms-2">
                  {filtered.length} pertanyaan
                </span>
              </div>
            </Col>
          </Row>

          <hr className="divider-line" />

          {/* FAQ Items */}
          <Row>
            <Col lg={8}>
              {filtered.length === 0 ? (
                <div className="faq-empty">
                  <div className="faq-empty-icon">🔍</div>
                  <p
                    style={{
                      fontWeight: 600,
                      color: "#1a1a2e",
                      marginBottom: 8,
                    }}
                  >
                    Tidak ada hasil ditemukan
                  </p>
                  <p style={{ fontSize: "0.9rem" }}>
                    Coba kata kunci lain atau pilih kategori berbeda.
                  </p>
                </div>
              ) : (
                filtered.map((item) => {
                  const isOpen = activeKey === item.id;
                  return (
                    <div
                      key={item.id}
                      className={`faq-card ${isOpen ? "open-card" : ""}`}
                    >
                      <button
                        className="faq-question-btn"
                        onClick={() => setActiveKey(isOpen ? null : item.id)}
                        aria-expanded={isOpen}
                      >
                        <div className="d-flex align-items-start gap-2 flex-grow-1">
                          <Badge
                            bg={categoryColors[item.category]}
                            className="faq-cat-badge mt-1"
                          >
                            {item.category}
                          </Badge>
                          <span className="faq-question-text">
                            {item.question}
                          </span>
                        </div>
                        <span
                          className={`faq-question-icon ${isOpen ? "rotated" : ""}`}
                        >
                          +
                        </span>
                      </button>
                      <div className={`faq-answer ${isOpen ? "open" : ""}`}>
                        <div className="faq-answer-inner">{item.answer}</div>
                      </div>
                    </div>
                  );
                })
              )}
            </Col>

            {/* Contact Card */}
            <Col lg={4} className="mt-5 mt-lg-0">
              <div
                className="contact-card"
                style={{ position: "sticky", top: 24 }}
              >
                <div style={{ position: "relative", zIndex: 1 }}>
                  <p className="contact-title">Masih butuh bantuan?</p>
                  <p className="contact-desc">
                    Tim customer service kami siap membantu Anda 7 hari
                    seminggu, dari pukul 08.00 hingga 21.00 WIB.
                  </p>
                  <div className="d-flex flex-column gap-2">
                    <Button className="contact-btn w-100">💬 Live Chat</Button>
                    <Button
                      variant="outline-light"
                      className="w-100"
                      style={{
                        borderRadius: 10,
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontWeight: 600,
                        fontSize: "0.9rem",
                        padding: "12px 28px",
                        borderColor: "rgba(255,255,255,0.2)",
                        color: "#a8a8c0",
                      }}
                    >
                      📧 Kirim Email
                    </Button>
                  </div>
                  <p
                    style={{
                      fontSize: "0.78rem",
                      color: "#6b6b80",
                      marginTop: 20,
                      marginBottom: 0,
                    }}
                  >
                    Respons rata-rata dalam &lt; 5 menit
                  </p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default FAQ;

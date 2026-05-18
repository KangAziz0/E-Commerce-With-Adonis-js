import { Card, Row, Col } from "react-bootstrap";
import { FiBox, FiTag, FiStar, FiShoppingBag } from "react-icons/fi";

const stats = [
  {
    label: "Total Produk",
    value: "—",
    icon: <FiBox size={22} />,
    color: "#6366f1",
    bg: "rgba(99, 102, 241, 0.1)",
  },
  {
    label: "Total Kategori",
    value: "—",
    icon: <FiTag size={22} />,
    color: "#06b6d4",
    bg: "rgba(6, 182, 212, 0.1)",
  },
  {
    label: "Total Brand",
    value: "—",
    icon: <FiStar size={22} />,
    color: "#f59e0b",
    bg: "rgba(245, 158, 11, 0.1)",
  },
  {
    label: "Pesanan Baru",
    value: "—",
    icon: <FiShoppingBag size={22} />,
    color: "#10b981",
    bg: "rgba(16, 185, 129, 0.1)",
  },
];

export default function DashboardPage() {
  return (
    <div>
      {/* Page Header */}
      <div className="mb-4">
        <h4 className="fw-bold mb-1" style={{ color: "#0f172a" }}>
          Dashboard
        </h4>
        <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
          Selamat datang kembali! Berikut ringkasan toko Anda.
        </p>
      </div>

      {/* Stats Cards */}
      <Row className="g-3 mb-4">
        {stats.map((stat, i) => (
          <Col key={i} sm={6} lg={3}>
            <Card
              className="border-0 h-100"
              style={{
                borderRadius: 14,
                boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)",
              }}
            >
              <Card.Body className="d-flex align-items-center gap-3 py-3 px-4">
                <div
                  className="d-flex align-items-center justify-content-center rounded-3"
                  style={{
                    width: 48,
                    height: 48,
                    background: stat.bg,
                    color: stat.color,
                    flexShrink: 0,
                  }}
                >
                  {stat.icon}
                </div>
                <div>
                  <div
                    className="text-muted"
                    style={{ fontSize: "0.78rem", fontWeight: 500, letterSpacing: "0.2px" }}
                  >
                    {stat.label}
                  </div>
                  <div className="fw-bold" style={{ fontSize: "1.5rem", color: "#0f172a", lineHeight: 1.2 }}>
                    {stat.value}
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Quick Actions / Welcome */}
      <Row className="g-3">
        <Col lg={8}>
          <Card
            className="border-0 h-100"
            style={{
              borderRadius: 14,
              boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)",
            }}
          >
            <Card.Body className="p-4">
              <h6 className="fw-bold mb-3" style={{ color: "#0f172a" }}>
                Aktivitas Terbaru
              </h6>
              <div className="text-center py-5">
                <div style={{ fontSize: "3rem", opacity: 0.15 }}>
                  <FiShoppingBag />
                </div>
                <p className="text-muted mt-3 mb-0" style={{ fontSize: "0.9rem" }}>
                  Belum ada aktivitas terbaru.
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card
            className="border-0 h-100"
            style={{
              borderRadius: 14,
              background: "linear-gradient(135deg, #6366f1 0%, #818cf8 100%)",
              boxShadow: "0 4px 14px rgba(99, 102, 241, 0.3)",
            }}
          >
            <Card.Body className="p-4 d-flex flex-column justify-content-center text-white">
              <h6 className="fw-bold mb-2">HappyShop Admin</h6>
              <p className="mb-0" style={{ fontSize: "0.85rem", opacity: 0.85 }}>
                Kelola produk, kategori, dan brand melalui menu navigasi di sebelah kiri.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

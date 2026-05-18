import { Card, Row, Col } from "react-bootstrap";

export default function DashboardPage() {
  return (
    <div>
      <h4 className="fw-bold mb-4">Dashboard</h4>
      <Row className="g-4">
        <Col md={3}>
          <Card className="border-0 shadow-sm rounded-4 p-3">
            <Card.Body>
              <div className="text-muted mb-1" style={{ fontSize: "0.85rem" }}>
                Total Produk
              </div>
              <h3 className="fw-bold mb-0">—</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm rounded-4 p-3">
            <Card.Body>
              <div className="text-muted mb-1" style={{ fontSize: "0.85rem" }}>
                Total Kategori
              </div>
              <h3 className="fw-bold mb-0">—</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm rounded-4 p-3">
            <Card.Body>
              <div className="text-muted mb-1" style={{ fontSize: "0.85rem" }}>
                Total Brand
              </div>
              <h3 className="fw-bold mb-0">—</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm rounded-4 p-3">
            <Card.Body>
              <div className="text-muted mb-1" style={{ fontSize: "0.85rem" }}>
                Pesanan Baru
              </div>
              <h3 className="fw-bold mb-0">—</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <Card className="border-0 shadow-sm rounded-4 p-4">
            <Card.Body className="text-center text-muted py-5">
              <h5>Selamat Datang di Admin Panel</h5>
              <p className="mb-0">
                Kelola produk, kategori, dan brand melalui menu di sebelah kiri.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

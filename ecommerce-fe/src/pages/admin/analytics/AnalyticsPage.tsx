import { useEffect } from "react";
import { Card, Row, Col, Spinner, Table } from "react-bootstrap";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { fetchAnalytics } from "@/features/admin/adminSlice";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const STATUS_COLORS: Record<string, string> = {
  PENDING: "#f59e0b",
  PAID: "#10b981",
  PROCESSING: "#f97316",
  SHIPPED: "#0ea5e9",
  DELIVERED: "#6366f1",
  CANCELLED: "#ef4444",
};

const cardStyle = {
  borderRadius: 14,
  boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)",
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(value);

export default function AnalyticsPage() {
  const dispatch = useAppDispatch();
  const { data: analyticsData, loading } = useAppSelector((state) => state.admin.analytics);

  useEffect(() => {
    dispatch(fetchAnalytics());
  }, [dispatch]);

  if (loading || !analyticsData) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  const currentYear = new Date().getFullYear();

  // Revenue Trend - Line chart (current year)
  const revenueTrendData = (() => {
    const monthlyData = new Array(12).fill(0);
    analyticsData.monthlyRevenue.forEach((item) => {
      if (item.year === currentYear && item.month >= 1 && item.month <= 12) {
        monthlyData[item.month - 1] = item.revenue;
      }
    });
    return {
      labels: MONTH_LABELS,
      datasets: [
        {
          label: `Revenue ${currentYear}`,
          data: monthlyData,
          borderColor: "#6366f1",
          backgroundColor: "rgba(99, 102, 241, 0.1)",
          fill: true,
          tension: 0.3,
        },
      ],
    };
  })();

  // Orders by Status Monthly - Stacked Bar
  const ordersByStatusData = (() => {
    const statuses = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
    const datasets = statuses.map((status) => {
      const monthlyData = new Array(12).fill(0);
      analyticsData.ordersByStatusMonthly.forEach((item) => {
        if (item.status === status && item.month >= 1 && item.month <= 12) {
          monthlyData[item.month - 1] = item.count;
        }
      });
      return {
        label: status,
        data: monthlyData,
        backgroundColor: STATUS_COLORS[status] || "#94a3b8",
      };
    });
    return {
      labels: MONTH_LABELS,
      datasets,
    };
  })();

  // Top Selling Products - Horizontal Bar
  const topProductsData = (() => {
    const products = analyticsData.topSellingProducts.slice(0, 10);
    return {
      labels: products.map((p) => p.name),
      datasets: [
        {
          label: "Qty Terjual",
          data: products.map((p) => p.totalQuantity),
          backgroundColor: "rgba(99, 102, 241, 0.7)",
          borderRadius: 4,
        },
      ],
    };
  })();

  // Payment Status - Doughnut
  const paymentStatusData = (() => {
    const colors = ["#10b981", "#f59e0b", "#94a3b8", "#ef4444"];
    return {
      labels: analyticsData.paymentStatusDistribution.map((p) => p.status),
      datasets: [
        {
          data: analyticsData.paymentStatusDistribution.map((p) => p.count),
          backgroundColor: analyticsData.paymentStatusDistribution.map(
            (_, i) => colors[i % colors.length]
          ),
          borderWidth: 1,
        },
      ],
    };
  })();

  // Shipment Status - Doughnut
  const shipmentStatusData = (() => {
    const colors = ["#0ea5e9", "#6366f1", "#f59e0b", "#ef4444", "#10b981", "#94a3b8"];
    return {
      labels: analyticsData.shipmentStatusDistribution.map((s) => s.status),
      datasets: [
        {
          data: analyticsData.shipmentStatusDistribution.map((s) => s.count),
          backgroundColor: analyticsData.shipmentStatusDistribution.map(
            (_, i) => colors[i % colors.length]
          ),
          borderWidth: 1,
        },
      ],
    };
  })();

  // Low Stock - Horizontal Bar
  const lowStockData = (() => {
    const products = analyticsData.lowStockProducts.slice(0, 15);
    return {
      labels: products.map((p) => p.name),
      datasets: [
        {
          label: "Stock",
          data: products.map((p) => p.stock),
          backgroundColor: products.map((p) =>
            p.stock <= 3 ? "rgba(239, 68, 68, 0.7)" : "rgba(249, 115, 22, 0.7)"
          ),
          borderRadius: 4,
        },
      ],
    };
  })();

  return (
    <div>
      <div className="mb-4">
        <h4 className="fw-bold mb-1" style={{ color: "#0f172a" }}>
          Analytics
        </h4>
        <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
          Visualisasi data dan tren bisnis Anda.
        </p>
      </div>

      {/* Revenue Trend */}
      <Row className="g-3 mb-4">
        <Col lg={8}>
          <Card className="border-0 h-100" style={cardStyle}>
            <Card.Body className="p-4">
              <h6 className="fw-bold mb-3" style={{ color: "#0f172a" }}>
                Revenue Trend
              </h6>
              <div style={{ height: 280 }}>
                <Line
                  data={revenueTrendData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: "top", labels: { font: { size: 11 } } },
                    },
                    scales: {
                      y: { beginAtZero: true, ticks: { font: { size: 10 } } },
                      x: { ticks: { font: { size: 10 } } },
                    },
                  }}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="border-0 h-100" style={cardStyle}>
            <Card.Body className="p-4">
              <h6 className="fw-bold mb-3" style={{ color: "#0f172a" }}>
                Payment Status
              </h6>
              <div style={{ height: 280 }}>
                <Doughnut
                  data={paymentStatusData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: "bottom", labels: { font: { size: 11 } } },
                    },
                  }}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Order Trend per Status - Stacked Bar */}
      <Row className="g-3 mb-4">
        <Col lg={12}>
          <Card className="border-0" style={cardStyle}>
            <Card.Body className="p-4">
              <h6 className="fw-bold mb-3" style={{ color: "#0f172a" }}>
                Order Trend per Status
              </h6>
              <div style={{ height: 300 }}>
                <Bar
                  data={ordersByStatusData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: "top", labels: { font: { size: 11 } } },
                    },
                    scales: {
                      x: { stacked: true, ticks: { font: { size: 10 } } },
                      y: { stacked: true, beginAtZero: true, ticks: { font: { size: 10 } } },
                    },
                  }}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Top Selling Products and Shipment Status */}
      <Row className="g-3 mb-4">
        <Col lg={6}>
          <Card className="border-0 h-100" style={cardStyle}>
            <Card.Body className="p-4">
              <h6 className="fw-bold mb-3" style={{ color: "#0f172a" }}>
                Top Selling Products
              </h6>
              <div style={{ height: 300 }}>
                <Bar
                  data={topProductsData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: "y",
                    plugins: {
                      legend: { display: false },
                    },
                    scales: {
                      x: { beginAtZero: true, ticks: { font: { size: 10 } } },
                      y: { ticks: { font: { size: 10 } } },
                    },
                  }}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6}>
          <Card className="border-0 h-100" style={cardStyle}>
            <Card.Body className="p-4">
              <h6 className="fw-bold mb-3" style={{ color: "#0f172a" }}>
                Shipment Status
              </h6>
              <div style={{ height: 300 }}>
                <Doughnut
                  data={shipmentStatusData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: "bottom", labels: { font: { size: 11 } } },
                    },
                  }}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Low Stock Alert */}
      <Row className="g-3 mb-4">
        <Col lg={12}>
          <Card className="border-0" style={cardStyle}>
            <Card.Body className="p-4">
              <h6 className="fw-bold mb-3" style={{ color: "#0f172a" }}>
                Low Stock Alert
              </h6>
              <div style={{ height: 300 }}>
                <Bar
                  data={lowStockData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: "y",
                    plugins: {
                      legend: { display: false },
                    },
                    scales: {
                      x: { beginAtZero: true, ticks: { font: { size: 10 } } },
                      y: { ticks: { font: { size: 10 } } },
                    },
                  }}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Alerts */}
      <Row className="g-3 mb-4">
        <Col lg={12}>
          <Card className="border-0" style={cardStyle}>
            <Card.Body className="p-4">
              <h6 className="fw-bold mb-3" style={{ color: "#0f172a" }}>
                Recent Alerts
              </h6>
              <Row>
                <Col md={6}>
                  <h6 className="fw-semibold mb-2" style={{ fontSize: "0.85rem", color: "#475569" }}>
                    Pengiriman Gagal Terbaru
                  </h6>
                  <div className="table-responsive">
                    <Table hover size="sm" style={{ fontSize: "0.82rem" }}>
                      <thead>
                        <tr style={{ background: "#f8fafc" }}>
                          <th className="border-0">Order ID</th>
                          <th className="border-0">Courier</th>
                          <th className="border-0">Status</th>
                          <th className="border-0">Tanggal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analyticsData.recentFailedShipments.length > 0 ? (
                          analyticsData.recentFailedShipments.map((s) => (
                            <tr key={s.id}>
                              <td>#{s.orderId}</td>
                              <td>{s.courierCompany}</td>
                              <td>{s.status}</td>
                              <td>{new Date(s.createdAt).toLocaleDateString("id-ID")}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="text-center text-muted py-3">
                              Tidak ada data.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>
                </Col>
                <Col md={6}>
                  <h6 className="fw-semibold mb-2" style={{ fontSize: "0.85rem", color: "#475569" }}>
                    Pembayaran Pending
                  </h6>
                  <div className="table-responsive">
                    <Table hover size="sm" style={{ fontSize: "0.82rem" }}>
                      <thead>
                        <tr style={{ background: "#f8fafc" }}>
                          <th className="border-0">Order ID</th>
                          <th className="border-0">Amount</th>
                          <th className="border-0">Method</th>
                          <th className="border-0">Tanggal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analyticsData.recentPendingPayments.length > 0 ? (
                          analyticsData.recentPendingPayments.map((p) => (
                            <tr key={p.id}>
                              <td>#{p.orderId}</td>
                              <td>{formatCurrency(p.amount)}</td>
                              <td>{p.paymentMethod}</td>
                              <td>{new Date(p.createdAt).toLocaleDateString("id-ID")}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="text-center text-muted py-3">
                              Tidak ada data.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

import { useEffect, useMemo } from "react";
import { Card, Row, Col, Spinner, Table, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  FiBox,
  FiTag,
  FiStar,
  FiShoppingBag,
  FiDollarSign,
  FiClock,
  FiTruck,
  FiAlertTriangle,
} from "react-icons/fi";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { fetchDashboardStats, fetchAnalytics } from "@/features/admin/adminSlice";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(value);

const STATUS_COLORS: Record<string, string> = {
  PENDING: "#f59e0b",
  PAID: "#10b981",
  PROCESSING: "#f97316",
  SHIPPED: "#0ea5e9",
  DELIVERED: "#6366f1",
  CANCELLED: "#ef4444",
  SHIPMENT_FAILED: "#dc2626",
};

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { stats, loading } = useAppSelector((state) => state.admin.dashboard);
  const { data: analyticsData } = useAppSelector((state) => state.admin.analytics);

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchAnalytics());
  }, [dispatch]);

  const statCards = [
    {
      label: "Total Produk",
      value: stats?.totalProducts ?? 0,
      icon: <FiBox size={22} />,
      color: "#6366f1",
      bg: "rgba(99, 102, 241, 0.1)",
      link: "/admin/products",
    },
    {
      label: "Total Kategori",
      value: stats?.totalCategories ?? 0,
      icon: <FiTag size={22} />,
      color: "#06b6d4",
      bg: "rgba(6, 182, 212, 0.1)",
      link: "/admin/categories",
    },
    {
      label: "Total Brand",
      value: stats?.totalBrands ?? 0,
      icon: <FiStar size={22} />,
      color: "#f59e0b",
      bg: "rgba(245, 158, 11, 0.1)",
      link: "/admin/brands",
    },
    {
      label: "Pesanan Baru",
      value: stats?.ordersByStatus?.PENDING ?? 0,
      icon: <FiShoppingBag size={22} />,
      color: "#10b981",
      bg: "rgba(16, 185, 129, 0.1)",
      link: "/admin/orders",
    },
    {
      label: "Total Revenue",
      value: formatCurrency(stats?.totalRevenue ?? 0),
      icon: <FiDollarSign size={22} />,
      color: "#8b5cf6",
      bg: "rgba(139, 92, 246, 0.1)",
      link: "/admin/transactions",
    },
    {
      label: "Processing",
      value: stats?.ordersByStatus?.PROCESSING ?? 0,
      icon: <FiClock size={22} />,
      color: "#f97316",
      bg: "rgba(249, 115, 22, 0.1)",
      link: "/admin/orders",
    },
    {
      label: "Shipping",
      value: stats?.ordersByStatus?.SHIPPED ?? 0,
      icon: <FiTruck size={22} />,
      color: "#0ea5e9",
      bg: "rgba(14, 165, 233, 0.1)",
      link: "/admin/shipping",
    },
    {
      label: "Failed Shipment",
      value: stats?.ordersByStatus?.SHIPMENT_FAILED ?? 0,
      icon: <FiAlertTriangle size={22} />,
      color: "#ef4444",
      bg: "rgba(239, 68, 68, 0.1)",
      link: "/admin/shipping",
    },
  ];

  const orderDistributionData = useMemo(() => {
    if (!stats?.ordersByStatus) return null;
    const entries = Object.entries(stats.ordersByStatus);
    if (entries.length === 0) return null;
    return {
      labels: entries.map(([status]) => status),
      datasets: [
        {
          data: entries.map(([, count]) => count),
          backgroundColor: entries.map(
            ([status]) => STATUS_COLORS[status] || "#94a3b8"
          ),
          borderWidth: 1,
        },
      ],
    };
  }, [stats?.ordersByStatus]);

  const revenueBarData = useMemo(() => {
    if (!analyticsData?.monthlyRevenue) return null;
    const currentYear = new Date().getFullYear();
    const prevYear = currentYear - 1;

    const currentYearData = new Array(12).fill(0);
    const prevYearData = new Array(12).fill(0);

    analyticsData.monthlyRevenue.forEach((item) => {
      const idx = item.month - 1;
      if (idx >= 0 && idx < 12) {
        if (item.year === currentYear) {
          currentYearData[idx] = item.revenue;
        } else if (item.year === prevYear) {
          prevYearData[idx] = item.revenue;
        }
      }
    });

    return {
      labels: MONTH_LABELS,
      datasets: [
        {
          label: `${currentYear}`,
          data: currentYearData,
          backgroundColor: "rgba(99, 102, 241, 0.7)",
          borderRadius: 4,
        },
        {
          label: `${prevYear}`,
          data: prevYearData,
          backgroundColor: "rgba(203, 213, 225, 0.7)",
          borderRadius: 4,
        },
      ],
    };
  }, [analyticsData?.monthlyRevenue]);

  const topProductsPieData = useMemo(() => {
    if (!analyticsData?.topSellingProducts) return null;
    const top5 = analyticsData.topSellingProducts.slice(0, 5);
    if (top5.length === 0) return null;
    const colors = ["#6366f1", "#10b981", "#f59e0b", "#0ea5e9", "#ef4444"];
    return {
      labels: top5.map((p) => p.name),
      datasets: [
        {
          data: top5.map((p) => p.totalQuantity),
          backgroundColor: colors.slice(0, top5.length),
          borderWidth: 1,
        },
      ],
    };
  }, [analyticsData?.topSellingProducts]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <h4 className="fw-bold mb-1" style={{ color: "#0f172a" }}>
          Dashboard
        </h4>
        <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
          Selamat datang kembali! Berikut ringkasan toko Anda.
        </p>
      </div>

      <Row className="g-3 mb-4">
        {statCards.map((stat, i) => (
          <Col key={i} sm={6} lg={3}>
            <Card
              className="border-0 h-100"
              style={{
                borderRadius: 14,
                boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)",
                cursor: "pointer",
              }}
              onClick={() => navigate(stat.link)}
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
                  <div
                    className="fw-bold"
                    style={{ fontSize: "1.3rem", color: "#0f172a", lineHeight: 1.2 }}
                  >
                    {stat.value}
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="g-3 mb-4">
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
                Pendapatan Bulanan
              </h6>
              {revenueBarData ? (
                <div style={{ height: 260 }}>
                  <Bar
                    data={revenueBarData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "top",
                          labels: { font: { size: 11 } },
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: { font: { size: 10 } },
                        },
                        x: {
                          ticks: { font: { size: 10 } },
                        },
                      },
                    }}
                  />
                </div>
              ) : (
                <div className="text-center py-5">
                  <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
                    Belum ada data pendapatan.
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card
            className="border-0 h-100"
            style={{
              borderRadius: 14,
              boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)",
            }}
          >
            <Card.Body className="p-4">
              <h6 className="fw-bold mb-3" style={{ color: "#0f172a" }}>
                Produk Terlaris
              </h6>
              {topProductsPieData ? (
                <div style={{ height: 260 }}>
                  <Pie
                    data={topProductsPieData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "bottom",
                          labels: { font: { size: 11 } },
                        },
                      },
                    }}
                  />
                </div>
              ) : (
                <div className="text-center py-5">
                  <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
                    Belum ada data produk.
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

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
                Pesanan Terbaru
              </h6>
              {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                <div className="table-responsive">
                  <Table hover size="sm" style={{ fontSize: "0.85rem" }}>
                    <thead>
                      <tr style={{ background: "#f8fafc" }}>
                        <th className="border-0">Order ID</th>
                        <th className="border-0">Email</th>
                        <th className="border-0">Amount</th>
                        <th className="border-0">Status</th>
                        <th className="border-0">Tanggal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentOrders.map((order) => (
                        <tr
                          key={order.id}
                          style={{ cursor: "pointer" }}
                          onClick={() => navigate(`/admin/orders/${order.id}`)}
                        >
                          <td>{order.externalId || `#${order.id}`}</td>
                          <td>{order.email}</td>
                          <td>{formatCurrency(order.amount)}</td>
                          <td>
                            <Badge
                              bg={
                                order.status === "PAID"
                                  ? "success"
                                  : order.status === "PENDING"
                                    ? "warning"
                                    : order.status === "CANCELLED"
                                      ? "danger"
                                      : "info"
                              }
                            >
                              {order.status}
                            </Badge>
                          </td>
                          <td>
                            {new Date(order.createdAt).toLocaleDateString("id-ID")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-5">
                  <div style={{ fontSize: "3rem", opacity: 0.15 }}>
                    <FiShoppingBag />
                  </div>
                  <p className="text-muted mt-3 mb-0" style={{ fontSize: "0.9rem" }}>
                    Belum ada pesanan terbaru.
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card
            className="border-0 h-100"
            style={{
              borderRadius: 14,
              boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)",
            }}
          >
            <Card.Body className="p-4">
              <h6 className="fw-bold mb-3" style={{ color: "#0f172a" }}>
                Distribusi Pesanan
              </h6>
              {orderDistributionData ? (
                <div style={{ height: 220 }}>
                  <Pie
                    data={orderDistributionData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "bottom",
                          labels: { font: { size: 11 } },
                        },
                      },
                    }}
                  />
                </div>
              ) : (
                <div className="text-center py-5">
                  <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
                    Belum ada data pesanan.
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

import { useEffect } from "react";
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

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { fetchDashboardStats } from "@/features/admin/adminSlice";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(value);

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { stats, loading } = useAppSelector((state) => state.admin.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardStats());
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

import { useEffect, useMemo, useState } from "react";
import { Card, Row, Col, Spinner, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ColumnDef } from "@tanstack/react-table";
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
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  fetchDashboardOrders,
  fetchDashboardStats,
  setDashboardOrderFilters,
} from "@/features/admin/adminSlice";
import DataTable from "@/components/common/Table/DataTable";
import type { AdminOrder } from "@/features/admin/admin.types";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(
    value,
  );

const STATUS_COLORS: Record<string, string> = {
  PENDING: "#f59e0b",
  PAID: "#10b981",
  PROCESSING: "#f97316",
  SHIPPED: "#0ea5e9",
  DELIVERED: "#6366f1",
  CANCELLED: "#ef4444",
  SHIPMENT_FAILED: "#dc2626",
};

const getStatusVariant = (status: string) => {
  switch (status) {
    case "PAID":
    case "DELIVERED":
      return "success";
    case "PENDING":
      return "warning";
    case "CANCELLED":
      return "danger";
    case "SHIPPED":
      return "primary";
    default:
      return "info";
  }
};

const recentOrderColumns: ColumnDef<AdminOrder, unknown>[] = [
  {
    accessorKey: "externalId",
    header: "Order ID",
    cell: ({ row, getValue }) => (getValue() as string) || `#${row.original.id}`,
  },
  { accessorKey: "email", header: "Email" },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ getValue }) => formatCurrency(getValue() as number),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const status = getValue() as string;
      return <Badge bg={getStatusVariant(status)}>{status}</Badge>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Tanggal",
    cell: ({ getValue }) =>
      new Date(getValue() as string).toLocaleDateString("id-ID"),
  },
];

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    stats,
    orders,
    ordersMeta,
    loading,
    ordersLoading,
    orderFilters,
  } = useAppSelector((state) => state.admin.dashboard);
  const [orderSearch, setOrderSearch] = useState(orderFilters.search ?? "");

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchDashboardOrders(orderFilters));
  }, [dispatch, orderFilters]);

  const handleOrderSearch = () => {
    dispatch(setDashboardOrderFilters({ search: orderSearch, page: 1 }));
  };

  const handleOrderPageChange = (page: number) => {
    dispatch(setDashboardOrderFilters({ page }));
  };

  const handleOrderPageSizeChange = (limit: number) => {
    dispatch(setDashboardOrderFilters({ limit, page: 1 }));
  };

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

  const chartData = useMemo(() => {
    if (!stats?.ordersByStatus) return [];
    return Object.entries(stats.ordersByStatus).map(([status, count]) => ({
      name: status,
      value: count,
    }));
  }, [stats?.ordersByStatus]);

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
                boxShadow:
                  "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)",
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
                    style={{
                      fontSize: "0.78rem",
                      fontWeight: 500,
                      letterSpacing: "0.2px",
                    }}
                  >
                    {stat.label}
                  </div>
                  <div
                    className="fw-bold"
                    style={{
                      fontSize: "1.3rem",
                      color: "#0f172a",
                      lineHeight: 1.2,
                    }}
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
          <DataTable<AdminOrder>
            title="Pesanan Terbaru"
            columns={recentOrderColumns}
            data={orders}
            loading={ordersLoading}
            searchPlaceholder="Cari email / order ID..."
            searchValue={orderSearch}
            onSearchChange={setOrderSearch}
            onSearchSubmit={handleOrderSearch}
            showColumnToggle={false}
            serverPagination={
              ordersMeta
                ? {
                    total: ordersMeta.total,
                    perPage: ordersMeta.perPage,
                    currentPage: ordersMeta.currentPage,
                    lastPage: ordersMeta.lastPage,
                    onPageChange: handleOrderPageChange,
                    onPageSizeChange: handleOrderPageSizeChange,
                  }
                : undefined
            }
            onRowClick={(order) => navigate(`/admin/orders/${order.id}`)}
          />
        </Col>
        <Col lg={4}>
          <Card
            className="border-0 h-100"
            style={{
              borderRadius: 14,
              boxShadow:
                "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)",
            }}
          >
            <Card.Body className="p-4">
              <h6 className="fw-bold mb-3" style={{ color: "#0f172a" }}>
                Distribusi Pesanan
              </h6>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }) =>
                        `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                      }
                      labelLine={false}
                    >
                      {chartData.map((entry) => (
                        <Cell
                          key={entry.name}
                          fill={STATUS_COLORS[entry.name] || "#94a3b8"}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      wrapperStyle={{ fontSize: "0.75rem" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
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

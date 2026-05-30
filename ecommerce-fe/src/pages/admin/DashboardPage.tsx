import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Badge, Card, Col, Row, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";
import {
  FiAlertTriangle,
  FiBox,
  FiClock,
  FiDollarSign,
  FiShoppingBag,
  FiStar,
  FiTag,
  FiTruck,
} from "react-icons/fi";
import { Bar, Pie } from "react-chartjs-2";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import type { ChartData, ChartOptions } from "chart.js";

import DataTable from "@/components/common/Table/DataTable";
import {
  fetchAnalytics,
  fetchDashboardOrders,
  fetchDashboardStats,
  setDashboardOrderFilters,
} from "@/features/admin/adminSlice";
import type { AdminOrder, DashboardStats } from "@/features/admin/admin.types";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import type { RootState } from "@/store/store";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const STATUS_COLORS: Record<string, string> = {
  PENDING: "#f59e0b",
  PAID: "#10b981",
  PROCESSING: "#f97316",
  SHIPPED: "#0ea5e9",
  DELIVERED: "#6366f1",
  CANCELLED: "#ef4444",
  SHIPMENT_FAILED: "#dc2626",
};

const TOP_PRODUCT_COLORS = [
  "#6366f1",
  "#10b981",
  "#f59e0b",
  "#0ea5e9",
  "#ef4444",
];

const cardStyle = {
  borderRadius: 14,
  boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)",
};

const pieChartOptions: ChartOptions<"pie"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
      labels: { font: { size: 11 } },
    },
  },
};

const revenueChartOptions: ChartOptions<"bar"> = {
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
};

type StatCardConfig = {
  label: string;
  value: ReactNode;
  icon: ReactNode;
  color: string;
  bg: string;
  link: string;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(value);

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
    cell: ({ row, getValue }) =>
      (getValue() as string) || `#${row.original.id}`,
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

const buildStatCards = (stats: DashboardStats | null): StatCardConfig[] => [
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

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const dashboard = useAppSelector((state) => state.admin.dashboard);
  const analyticsData = useAppSelector(
    (state: RootState) => state.admin.analytics?.data ?? null,
  );
  const {
    stats,
    orders = [],
    ordersMeta,
    loading,
    ordersLoading,
    orderFilters = {
      page: 1,
      limit: 10,
      sort_by: "created_at",
      sort_order: "desc",
    },
  } = dashboard;
  const [orderSearch, setOrderSearch] = useState(orderFilters.search ?? "");

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchAnalytics());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchDashboardOrders(orderFilters));
  }, [dispatch, orderFilters]);

  const statCards = useMemo(() => buildStatCards(stats), [stats]);

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
            ([status]) => STATUS_COLORS[status] || "#94a3b8",
          ),
          borderWidth: 1,
        },
      ],
    } satisfies ChartData<"pie", number[], string>;
  }, [stats?.ordersByStatus]);

  const revenueBarData = useMemo(() => {
    const monthlyRevenue = analyticsData?.monthlyRevenue ?? [];
    if (monthlyRevenue.length === 0) return null;

    const currentYear = new Date().getFullYear();
    const previousYear = currentYear - 1;
    const currentYearData = new Array<number>(12).fill(0);
    const previousYearData = new Array<number>(12).fill(0);

    monthlyRevenue.forEach((item) => {
      const monthIndex = item.month - 1;
      if (monthIndex < 0 || monthIndex > 11) return;

      if (item.year === currentYear) {
        currentYearData[monthIndex] = item.revenue;
      } else if (item.year === previousYear) {
        previousYearData[monthIndex] = item.revenue;
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
          label: `${previousYear}`,
          data: previousYearData,
          backgroundColor: "rgba(203, 213, 225, 0.7)",
          borderRadius: 4,
        },
      ],
    } satisfies ChartData<"bar", number[], string>;
  }, [analyticsData?.monthlyRevenue]);

  const topProductsPieData = useMemo(() => {
    const topProducts = analyticsData?.topSellingProducts?.slice(0, 5) ?? [];
    if (topProducts.length === 0) return null;

    return {
      labels: topProducts.map((product) => product.name),
      datasets: [
        {
          data: topProducts.map((product) => product.totalQuantity),
          backgroundColor: TOP_PRODUCT_COLORS.slice(0, topProducts.length),
          borderWidth: 1,
        },
      ],
    } satisfies ChartData<"pie", number[], string>;
  }, [analyticsData?.topSellingProducts]);

  const serverPagination = useMemo(
    () =>
      ordersMeta
        ? {
            total: ordersMeta.total,
            perPage: ordersMeta.perPage,
            currentPage: ordersMeta.currentPage,
            lastPage: ordersMeta.lastPage,
            onPageChange: (page: number) => {
              dispatch(setDashboardOrderFilters({ page }));
            },
            onPageSizeChange: (limit: number) => {
              dispatch(setDashboardOrderFilters({ limit, page: 1 }));
            },
          }
        : undefined,
    [dispatch, ordersMeta],
  );

  const handleOrderSearch = () => {
    dispatch(setDashboardOrderFilters({ search: orderSearch, page: 1 }));
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader />

      <Row className="g-3 mb-4">
        {statCards.map((stat) => (
          <Col key={stat.label} sm={6} lg={3}>
            <StatCard stat={stat} onClick={() => navigate(stat.link)} />
          </Col>
        ))}
      </Row>

      <Row className="g-3 mb-4">
        <Col lg={8}>
          <DashboardChartCard
            title="Pendapatan Bulanan"
            emptyText="Belum ada data pendapatan."
          >
            {revenueBarData && (
              <Bar data={revenueBarData} options={revenueChartOptions} />
            )}
          </DashboardChartCard>
        </Col>
        <Col lg={4}>
          <DashboardChartCard
            title="Produk Terlaris"
            emptyText="Belum ada data produk."
          >
            {topProductsPieData && (
              <Pie data={topProductsPieData} options={pieChartOptions} />
            )}
          </DashboardChartCard>
        </Col>
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
            serverPagination={serverPagination}
            onRowClick={(order) => navigate(`/admin/orders/${order.id}`)}
          />
        </Col>
        <Col lg={4}>
          <DashboardChartCard
            title="Distribusi Pesanan"
            emptyText="Belum ada data pesanan."
            height={220}
          >
            {orderDistributionData && (
              <Pie data={orderDistributionData} options={pieChartOptions} />
            )}
          </DashboardChartCard>
        </Col>
      </Row>
    </div>
  );
}

function PageHeader() {
  return (
    <div className="mb-4">
      <h4 className="fw-bold mb-1" style={{ color: "#0f172a" }}>
        Dashboard
      </h4>
      <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
        Selamat datang kembali! Berikut ringkasan toko Anda.
      </p>
    </div>
  );
}

function StatCard({
  stat,
  onClick,
}: {
  stat: StatCardConfig;
  onClick: () => void;
}) {
  return (
    <Card
      className="border-0 h-100"
      style={{ ...cardStyle, cursor: "pointer" }}
      onClick={onClick}
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
  );
}

function DashboardChartCard({
  title,
  emptyText,
  children,
  height = 260,
}: {
  title: string;
  emptyText: string;
  children: ReactNode;
  height?: number;
}) {
  return (
    <Card className="border-0 h-100" style={cardStyle}>
      <Card.Body className="p-4">
        <h6 className="fw-bold mb-3" style={{ color: "#0f172a" }}>
          {title}
        </h6>
        {children ? (
          <div style={{ height }}>{children}</div>
        ) : (
          <div className="text-center py-5">
            <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
              {emptyText}
            </p>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

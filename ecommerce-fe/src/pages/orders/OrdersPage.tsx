import { useEffect, useMemo, useState } from "react";
import { Container, Spinner } from "react-bootstrap";
import {
  FaBoxOpen,
  FaCheckCircle,
  FaChevronRight,
  FaClipboardList,
  FaClock,
  FaReceipt,
  FaShoppingBag,
  FaTimesCircle,
  FaWallet,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import type {
  OrderDetailStatus,
  OrderListItem,
} from "@/features/orders/order.types";
import { fetchMyOrdersRequest } from "@/features/orders/orderSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { formatRupiahCurrency } from "@/utils/currency";

import "./OrdersPage.css";

type StatusFilter = "ALL" | OrderDetailStatus;

const statusOptions: { value: StatusFilter; label: string; icon: React.ReactNode }[] = [
  { value: "ALL", label: "Semua", icon: <FaClipboardList /> },
  { value: "PENDING", label: "Menunggu", icon: <FaClock /> },
  { value: "PROCESSING", label: "Diproses", icon: <FaBoxOpen /> },
  { value: "PAID", label: "Lunas", icon: <FaCheckCircle /> },
  { value: "EXPIRED", label: "Kedaluwarsa", icon: <FaClock /> },
  { value: "FAILED", label: "Gagal", icon: <FaTimesCircle /> },
  { value: "CANCELLED", label: "Dibatalkan", icon: <FaTimesCircle /> },
];

function getStatusMeta(status: OrderDetailStatus) {
  switch (status) {
    case "PENDING":
      return {
        label: "Menunggu Pembayaran",
        bg: "linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%)",
        color: "#e65100",
        icon: <FaClock />,
      };
    case "PAID":
      return {
        label: "Lunas",
        bg: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)",
        color: "#2e7d32",
        icon: <FaCheckCircle />,
      };
    case "PROCESSING":
      return {
        label: "Sedang Diproses",
        bg: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
        color: "#1565c0",
        icon: <FaBoxOpen />,
      };
    case "EXPIRED":
      return {
        label: "Kedaluwarsa",
        bg: "linear-gradient(135deg, #efebe9 0%, #d7ccc8 100%)",
        color: "#4e342e",
        icon: <FaClock />,
      };
    case "FAILED":
      return {
        label: "Gagal",
        bg: "linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%)",
        color: "#c62828",
        icon: <FaTimesCircle />,
      };
    case "CANCELLED":
      return {
        label: "Dibatalkan",
        bg: "linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)",
        color: "#424242",
        icon: <FaTimesCircle />,
      };
    default:
      return {
        label: status,
        bg: "linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)",
        color: "#424242",
        icon: <FaClipboardList />,
      };
  }
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatShortDate(value: string) {
  return new Date(value).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function OrderCard({ order, index }: { order: OrderListItem; index: number }) {
  const navigate = useNavigate();
  const status = getStatusMeta(order.status);
  const totalQty = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <motion.article
      className="order-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -4, boxShadow: "0 20px 60px rgba(0,0,0,0.08)" }}
      onClick={() => navigate(`/orders/${order.externalId}`)}
    >
      <div className="order-card__header">
        <div className="order-card__header-left">
          <span className="order-card__icon">
            <FaReceipt />
          </span>
          <div>
            <div className="order-card__id">{order.externalId}</div>
            <div className="order-card__date">{formatShortDate(order.createdAt)}</div>
          </div>
        </div>
        <span
          className="order-card__status"
          style={{ background: status.bg, color: status.color }}
        >
          {status.icon}
          <span>{status.label}</span>
        </span>
      </div>

      <div className="order-card__body">
        <div className="order-card__items-preview">
          {order.items.slice(0, 2).map((item) => (
            <div className="order-card__item" key={item.id}>
              <span className="order-card__item-name">{item.name}</span>
              <span className="order-card__item-qty">x{item.quantity}</span>
            </div>
          ))}
          {order.items.length > 2 && (
            <div className="order-card__item order-card__item--more">
              +{order.items.length - 2} produk lainnya
            </div>
          )}
        </div>

        <div className="order-card__footer">
          <div className="order-card__total">
            <span className="order-card__total-label">{totalQty} item</span>
            <span className="order-card__total-value">
              {formatRupiahCurrency(Number(order.amount))}
            </span>
          </div>
          {order.courierCompany && (
            <span className="order-card__courier text-muted small">
              {order.courierCompany.toUpperCase()} - {order.courierType?.toUpperCase()}
            </span>
          )}
          <button className="order-card__detail-btn">
            Detail <FaChevronRight size={10} />
          </button>
        </div>
      </div>
    </motion.article>
  );
}

export default function OrdersPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { orders, loading, error } = useAppSelector(
    (state) => state.order.myOrders,
  );
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  useEffect(() => {
    dispatch(fetchMyOrdersRequest());
  }, [dispatch]);

  const filteredOrders = useMemo(() => {
    if (statusFilter === "ALL") return orders;
    return orders.filter((order) => order.status === statusFilter);
  }, [orders, statusFilter]);

  const totalSpent = useMemo(() => {
    return orders
      .filter((order) => order.status === "PAID" || order.status === "PROCESSING")
      .reduce((sum, order) => sum + Number(order.amount), 0);
  }, [orders]);

  const activeOrders = orders.filter(
    (order) => order.status === "PENDING" || order.status === "PROCESSING",
  ).length;

  const paidOrders = orders.filter(
    (order) => order.status === "PAID",
  ).length;

  return (
    <main className="orders-page">
      <div className="orders-hero">
        <Container className="orders-shell">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="orders-title">Pesanan Saya</h1>
            <p className="orders-subtitle">
              Kelola dan pantau semua pesananmu di sini
            </p>
          </motion.div>
        </Container>
      </div>

      <Container className="orders-shell">
        {/* Summary Cards */}
        <motion.section
          className="orders-stats"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="stat-card">
            <div className="stat-card__icon stat-card__icon--total">
              <FaClipboardList />
            </div>
            <div className="stat-card__info">
              <span className="stat-card__value">{orders.length}</span>
              <span className="stat-card__label">Total Pesanan</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card__icon stat-card__icon--active">
              <FaClock />
            </div>
            <div className="stat-card__info">
              <span className="stat-card__value">{activeOrders}</span>
              <span className="stat-card__label">Pesanan Aktif</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card__icon stat-card__icon--paid">
              <FaCheckCircle />
            </div>
            <div className="stat-card__info">
              <span className="stat-card__value">{paidOrders}</span>
              <span className="stat-card__label">Sudah Lunas</span>
            </div>
          </div>
          <div className="stat-card stat-card--wide">
            <div className="stat-card__icon stat-card__icon--spent">
              <FaWallet />
            </div>
            <div className="stat-card__info">
              <span className="stat-card__value stat-card__value--currency">
                {formatRupiahCurrency(totalSpent)}
              </span>
              <span className="stat-card__label">Total Pengeluaran</span>
            </div>
          </div>
        </motion.section>

        {/* Filter Tabs */}
        <motion.section
          className="orders-filter-tabs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              className={`filter-tab ${statusFilter === opt.value ? "filter-tab--active" : ""}`}
              onClick={() => setStatusFilter(opt.value)}
            >
              {opt.icon}
              <span>{opt.label}</span>
              {opt.value === "ALL" && orders.length > 0 && (
                <span className="filter-tab__count">{orders.length}</span>
              )}
            </button>
          ))}
        </motion.section>

        {/* Content */}
        {loading ? (
          <motion.div
            className="orders-empty-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Spinner animation="border" className="orders-spinner" />
            <h2>Memuat pesanan...</h2>
            <p>Sebentar ya, daftar pesanan sedang diambil.</p>
          </motion.div>
        ) : error ? (
          <motion.div
            className="orders-empty-state orders-empty-state--error"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="empty-state__icon empty-state__icon--error">
              <FaTimesCircle />
            </div>
            <h2>Gagal memuat pesanan</h2>
            <p>{error}</p>
            <button
              className="orders-btn orders-btn--primary"
              onClick={() => dispatch(fetchMyOrdersRequest())}
            >
              Coba Lagi
            </button>
          </motion.div>
        ) : orders.length === 0 ? (
          <motion.div
            className="orders-empty-state"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="empty-state__icon">
              <FaShoppingBag />
            </div>
            <h2>Belum ada pesanan</h2>
            <p>
              Pesanan yang kamu buat akan muncul di sini setelah checkout berhasil.
            </p>
            <button
              className="orders-btn orders-btn--primary"
              onClick={() => navigate("/shop")}
            >
              Mulai Belanja
            </button>
          </motion.div>
        ) : filteredOrders.length === 0 ? (
          <motion.div
            className="orders-empty-state"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="empty-state__icon">
              <FaClipboardList />
            </div>
            <h2>Tidak ada pesanan</h2>
            <p>Tidak ada pesanan dengan status ini. Coba filter yang lain.</p>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.section
              className="orders-grid"
              key={statusFilter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {filteredOrders.map((order, index) => (
                <OrderCard key={order.id} order={order} index={index} />
              ))}
            </motion.section>
          </AnimatePresence>
        )}
      </Container>
    </main>
  );
}

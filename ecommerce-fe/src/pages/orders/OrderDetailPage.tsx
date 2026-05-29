import { useEffect } from "react";
import { Container, Spinner } from "react-bootstrap";
import {
  FaArrowLeft,
  FaBoxOpen,
  FaCalendarAlt,
  FaCheckCircle,
  FaClipboardList,
  FaClock,
  FaCreditCard,
  FaEnvelope,
  FaHashtag,
  FaMoneyBillWave,
  FaReceipt,
  FaShoppingCart,
  FaTimesCircle,
  FaTruck,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

import type { OrderDetailStatus } from "@/features/orders/order.types";
import { fetchOrderRequest, resetCurrentOrder } from "@/features/orders/orderSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { formatRupiahCurrency } from "@/utils/currency";

import ShippingTimeline from "./ShippingTimeline";
import "./OrderDetailPage.css";

function getStatusMeta(status: OrderDetailStatus) {
  switch (status) {
    case "PENDING":
      return {
        label: "Menunggu Pembayaran",
        bg: "linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%)",
        color: "#e65100",
        icon: <FaClock />,
        description: "Pesanan sedang menunggu pembayaran dari Anda.",
      };
    case "PAID":
      return {
        label: "Lunas",
        bg: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)",
        color: "#2e7d32",
        icon: <FaCheckCircle />,
        description: "Pembayaran telah diterima. Terima kasih!",
      };
    case "PROCESSING":
      return {
        label: "Sedang Diproses",
        bg: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
        color: "#1565c0",
        icon: <FaBoxOpen />,
        description: "Pesanan sedang diproses oleh tim kami.",
      };
    case "EXPIRED":
      return {
        label: "Kedaluwarsa",
        bg: "linear-gradient(135deg, #efebe9 0%, #d7ccc8 100%)",
        color: "#4e342e",
        icon: <FaClock />,
        description: "Waktu pembayaran telah habis.",
      };
    case "FAILED":
      return {
        label: "Gagal",
        bg: "linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%)",
        color: "#c62828",
        icon: <FaTimesCircle />,
        description: "Pembayaran gagal diproses.",
      };
    case "CANCELLED":
      return {
        label: "Dibatalkan",
        bg: "linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)",
        color: "#424242",
        icon: <FaTimesCircle />,
        description: "Pesanan telah dibatalkan.",
      };
    default:
      return {
        label: status,
        bg: "linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)",
        color: "#424242",
        icon: <FaClipboardList />,
        description: "",
      };
  }
}

function getPaymentStatusMeta(status: string) {
  switch (status) {
    case "PENDING":
      return { label: "Menunggu", color: "#e65100", bg: "#fff8e1" };
    case "PAID":
      return { label: "Lunas", color: "#2e7d32", bg: "#e8f5e9" };
    case "EXPIRED":
      return { label: "Kedaluwarsa", color: "#4e342e", bg: "#efebe9" };
    case "FAILED":
      return { label: "Gagal", color: "#c62828", bg: "#fce4ec" };
    case "CANCELLED":
      return { label: "Dibatalkan", color: "#424242", bg: "#f5f5f5" };
    default:
      return { label: status, color: "#424242", bg: "#f5f5f5" };
  }
}

function formatDateTime(value: string | null | undefined) {
  if (!value) return "-";
  return new Date(value).toLocaleString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function formatDate(value: string | null | undefined) {
  if (!value) return "-";
  return new Date(value).toLocaleString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function OrderDetailPage() {
  const { externalId } = useParams<{ externalId: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { order, status: fetchStatus, error } = useAppSelector((state) => state.order);

  useEffect(() => {
    if (externalId) {
      dispatch(fetchOrderRequest(externalId));
    }
    return () => {
      dispatch(resetCurrentOrder());
    };
  }, [dispatch, externalId]);

  if (fetchStatus === "loading") {
    return (
      <main className="order-detail-page">
        <Container className="order-detail-shell">
          <div className="order-detail-loading">
            <Spinner animation="border" className="order-detail-spinner" />
            <h2>Memuat detail pesanan...</h2>
            <p>Mohon tunggu sebentar.</p>
          </div>
        </Container>
      </main>
    );
  }

  if (fetchStatus === "failed" || error) {
    return (
      <main className="order-detail-page">
        <Container className="order-detail-shell">
          <div className="order-detail-loading order-detail-loading--error">
            <div className="detail-error-icon">
              <FaTimesCircle />
            </div>
            <h2>Gagal memuat pesanan</h2>
            <p>{error || "Terjadi kesalahan saat memuat data pesanan."}</p>
            <div className="detail-error-actions">
              <button
                className="detail-btn detail-btn--secondary"
                onClick={() => navigate("/orders")}
              >
                <FaArrowLeft /> Kembali
              </button>
              <button
                className="detail-btn detail-btn--primary"
                onClick={() => externalId && dispatch(fetchOrderRequest(externalId))}
              >
                Coba Lagi
              </button>
            </div>
          </div>
        </Container>
      </main>
    );
  }

  if (!order) return null;

  const statusMeta = getStatusMeta(order.status);
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <main className="order-detail-page">
      {/* Header */}
      <div className="order-detail-hero">
        <Container className="order-detail-shell">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button
              className="order-detail-back"
              onClick={() => navigate("/orders")}
            >
              <FaArrowLeft />
              <span>Kembali ke Pesanan</span>
            </button>
            <div className="order-detail-hero-content">
              <div>
                <h1 className="order-detail-title">Detail Pesanan</h1>
                <p className="order-detail-id">{order.externalId}</p>
              </div>
              <span
                className="order-detail-status-badge"
                style={{ background: statusMeta.bg, color: statusMeta.color }}
              >
                {statusMeta.icon}
                <span>{statusMeta.label}</span>
              </span>
            </div>
          </motion.div>
        </Container>
      </div>

      <Container className="order-detail-shell">
        {/* Status Banner */}
        <motion.div
          className="order-detail-status-banner"
          style={{ background: statusMeta.bg, borderColor: statusMeta.color }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <span className="status-banner-icon" style={{ color: statusMeta.color }}>
            {statusMeta.icon}
          </span>
          <div>
            <strong style={{ color: statusMeta.color }}>{statusMeta.label}</strong>
            <p>{statusMeta.description}</p>
          </div>
        </motion.div>

        <div className="order-detail-grid">
          {/* Left Column */}
          <div className="order-detail-left">
            {/* Order Items */}
            <motion.section
              className="detail-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
            >
              <div className="detail-card__header">
                <FaShoppingCart className="detail-card__header-icon" />
                <h2>Produk Pesanan</h2>
                <span className="detail-card__badge">{totalItems} item</span>
              </div>
              <div className="detail-card__body">
                <div className="order-items-list">
                  {order.items.map((item, index) => (
                    <motion.div
                      className="order-detail-item"
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: 0.2 + index * 0.05 }}
                    >
                      <div className="order-detail-item__info">
                        <div className="order-detail-item__number">{index + 1}</div>
                        <div>
                          <div className="order-detail-item__name">{item.name}</div>
                          <div className="order-detail-item__meta">
                            {item.quantity} x {formatRupiahCurrency(Number(item.price))}
                          </div>
                        </div>
                      </div>
                      <div className="order-detail-item__subtotal">
                        {formatRupiahCurrency(Number(item.price) * item.quantity)}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Total */}
                <div className="order-detail-total">
                  <span>Total Pembayaran</span>
                  <strong>{formatRupiahCurrency(Number(order.amount))}</strong>
                </div>
              </div>
            </motion.section>

            {/* Payment Information */}
            {order.payments && order.payments.length > 0 && (
              <motion.section
                className="detail-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.25 }}
              >
                <div className="detail-card__header">
                  <FaCreditCard className="detail-card__header-icon" />
                  <h2>Informasi Pembayaran</h2>
                </div>
                <div className="detail-card__body">
                  {order.payments.map((payment) => {
                    const pStatus = getPaymentStatusMeta(payment.status);
                    return (
                      <div className="payment-card" key={payment.id}>
                        <div className="payment-card__header">
                          <span className="payment-card__method">
                            <FaMoneyBillWave />
                            {payment.paymentMethod}
                            {payment.paymentChannel && (
                              <span className="payment-card__channel">
                                ({payment.paymentChannel})
                              </span>
                            )}
                          </span>
                          <span
                            className="payment-card__status"
                            style={{ color: pStatus.color, background: pStatus.bg }}
                          >
                            {pStatus.label}
                          </span>
                        </div>
                        <div className="payment-card__details">
                          <div className="payment-detail-row">
                            <span className="payment-detail-label">Jumlah</span>
                            <span className="payment-detail-value">
                              {formatRupiahCurrency(Number(payment.amount))}
                            </span>
                          </div>
                          {payment.externalReferenceId && (
                            <div className="payment-detail-row">
                              <span className="payment-detail-label">Referensi ID</span>
                              <span className="payment-detail-value payment-detail-value--mono">
                                {payment.externalReferenceId}
                              </span>
                            </div>
                          )}
                          {payment.expiryDate && (
                            <div className="payment-detail-row">
                              <span className="payment-detail-label">Batas Pembayaran</span>
                              <span className="payment-detail-value">
                                {formatDateTime(payment.expiryDate)}
                              </span>
                            </div>
                          )}
                          {payment.paidAt && (
                            <div className="payment-detail-row">
                              <span className="payment-detail-label">Dibayar pada</span>
                              <span className="payment-detail-value payment-detail-value--success">
                                {formatDateTime(payment.paidAt)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.section>
            )}

            {/* Shipping Information */}
            {order.courierCompany && (
              <motion.section
                className="detail-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <div className="detail-card__header">
                  <FaTruck className="detail-card__header-icon" />
                  <h2>Informasi Pengiriman</h2>
                </div>
                <div className="detail-card__body">
                  <div className="payment-card">
                    <div className="payment-card__details">
                      <div className="payment-detail-row">
                        <span className="payment-detail-label">Kurir</span>
                        <span className="payment-detail-value">
                          {order.courierCompany.toUpperCase()}
                        </span>
                      </div>
                      {order.courierType && (
                        <div className="payment-detail-row">
                          <span className="payment-detail-label">Layanan</span>
                          <span className="payment-detail-value">
                            {order.courierType.toUpperCase()}
                            {order.courierServiceName && ` - ${order.courierServiceName}`}
                          </span>
                        </div>
                      )}
                      {order.shippingAmount != null && (
                        <div className="payment-detail-row">
                          <span className="payment-detail-label">Biaya Pengiriman</span>
                          <span className="payment-detail-value">
                            {formatRupiahCurrency(Number(order.shippingAmount))}
                          </span>
                        </div>
                      )}
                      {order.waybillId && (
                        <div className="payment-detail-row">
                          <span className="payment-detail-label">Waybill ID</span>
                          <span className="payment-detail-value payment-detail-value--mono">
                            {order.waybillId}
                          </span>
                        </div>
                      )}
                      {order.trackingId && (
                        <div className="payment-detail-row">
                          <span className="payment-detail-label">Tracking ID</span>
                          <span className="payment-detail-value payment-detail-value--mono">
                            {order.trackingId}
                          </span>
                        </div>
                      )}
                      {order.shippingStatus && (
                        <div className="payment-detail-row">
                          <span className="payment-detail-label">Status Pengiriman</span>
                          <span className="payment-detail-value">
                            {order.shippingStatus}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.section>
            )}

            {/* Shipping Timeline */}
            {order.shipment && order.shipment.trackingHistory.length > 0 && (
              <ShippingTimeline shipment={order.shipment} />
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div className="order-detail-right">
            <motion.section
              className="detail-card detail-card--sticky"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="detail-card__header">
                <FaReceipt className="detail-card__header-icon" />
                <h2>Ringkasan Pesanan</h2>
              </div>
              <div className="detail-card__body">
                <div className="summary-list">
                  <div className="summary-row">
                    <span className="summary-row__icon"><FaHashtag /></span>
                    <div className="summary-row__content">
                      <span className="summary-row__label">ID Pesanan</span>
                      <span className="summary-row__value summary-row__value--mono">
                        {order.externalId}
                      </span>
                    </div>
                  </div>

                  <div className="summary-row">
                    <span className="summary-row__icon"><FaEnvelope /></span>
                    <div className="summary-row__content">
                      <span className="summary-row__label">Email</span>
                      <span className="summary-row__value">{order.email}</span>
                    </div>
                  </div>

                  <div className="summary-row">
                    <span className="summary-row__icon"><FaCalendarAlt /></span>
                    <div className="summary-row__content">
                      <span className="summary-row__label">Tanggal Pesanan</span>
                      <span className="summary-row__value">
                        {formatDate(order.paidAt || undefined)}
                      </span>
                    </div>
                  </div>

                  {order.paidAt && (
                    <div className="summary-row">
                      <span className="summary-row__icon"><FaCheckCircle /></span>
                      <div className="summary-row__content">
                        <span className="summary-row__label">Tanggal Bayar</span>
                        <span className="summary-row__value summary-row__value--success">
                          {formatDate(order.paidAt)}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="summary-row">
                    <span className="summary-row__icon"><FaShoppingCart /></span>
                    <div className="summary-row__content">
                      <span className="summary-row__label">Jumlah Produk</span>
                      <span className="summary-row__value">
                        {order.items.length} produk ({totalItems} item)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="summary-total">
                  <div className="summary-total__row">
                    <span>Subtotal</span>
                    <span>
                      {formatRupiahCurrency(
                        Number(order.amount) - (Number(order.shippingAmount) || 0)
                      )}
                    </span>
                  </div>
                  {order.shippingAmount != null && Number(order.shippingAmount) > 0 && (
                    <div className="summary-total__row">
                      <span>Ongkir</span>
                      <span>{formatRupiahCurrency(Number(order.shippingAmount))}</span>
                    </div>
                  )}
                  <div className="summary-total__divider" />
                  <div className="summary-total__row summary-total__row--grand">
                    <span>Total</span>
                    <span>{formatRupiahCurrency(Number(order.amount))}</span>
                  </div>
                </div>
              </div>
            </motion.section>
          </div>
        </div>
      </Container>
    </main>
  );
}

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { motion } from "framer-motion";
import {
  FaArrowLeft,
  FaBoxOpen,
  FaCalendarAlt,
  FaCheckCircle,
  FaClipboardCheck,
  FaCreditCard,
  FaEnvelope,
  FaHashtag,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaReceipt,
  FaRoute,
  FaSearch,
  FaShippingFast,
  FaShoppingCart,
  FaTimesCircle,
  FaTools,
  FaTruck,
  FaUndoAlt,
  FaBan,
  FaClock,
} from "react-icons/fa";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  fetchOrderDetail,
  updateOrderStatus,
  refreshPayment,
  retryShipment,
  updateTracking,
} from "@/features/admin/adminSlice";
import type { TrackingEvent } from "@/features/admin/admin.types";
import type { AdminOrderItem } from "@/features/admin/admin.types";
import ConfirmActionModal from "@/components/common/Modal/ConfirmActionModal";
import "./OrderDetailPage.css";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);

const formatDateTime = (value?: string | null) => {
  if (!value) return "-";
  return new Date(value).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const fadeUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
};

function getOrderStatusMeta(status: string) {
  switch (status) {
    case "PAID":
      return {
        label: "Paid",
        tone: "success",
        color: "#059669",
        bg: "#ecfdf5",
        icon: <FaCheckCircle />,
        description: "Pembayaran sudah diterima dan order siap diproses.",
      };
    case "PROCESSING":
      return {
        label: "Processing",
        tone: "primary",
        color: "#4f46e5",
        bg: "#eef2ff",
        icon: <FaBoxOpen />,
        description: "Order sedang disiapkan sebelum pengiriman.",
      };
    case "SHIPPED":
      return {
        label: "Shipped",
        tone: "info",
        color: "#0284c7",
        bg: "#e0f2fe",
        icon: <FaTruck />,
        description: "Paket sudah masuk proses pengiriman.",
      };
    case "DELIVERED":
      return {
        label: "Delivered",
        tone: "success",
        color: "#047857",
        bg: "#ecfdf5",
        icon: <FaCheckCircle />,
        description: "Order sudah selesai diterima pelanggan.",
      };
    case "CANCELLED":
      return {
        label: "Cancelled",
        tone: "danger",
        color: "#dc2626",
        bg: "#fef2f2",
        icon: <FaTimesCircle />,
        description: "Order dibatalkan dan tidak akan diproses lanjut.",
      };
    default:
      return {
        label: status || "Pending",
        tone: "warning",
        color: "#d97706",
        bg: "#fffbeb",
        icon: <FaClock />,
        description: "Menunggu konfirmasi pembayaran atau tindakan lanjutan.",
      };
  }
}

function getPaymentStatusMeta(status: string) {
  switch (status) {
    case "PAID":
    case "SETTLED":
      return { color: "#059669", bg: "#ecfdf5" };
    case "PENDING":
      return { color: "#d97706", bg: "#fffbeb" };
    default:
      return { color: "#dc2626", bg: "#fef2f2" };
  }
}

function getShippingStatusMeta(status: string) {
  switch (status) {
    case "confirmed":
      return {
        label: "Dikonfirmasi",
        color: "#1565c0",
        bg: "#e3f2fd",
        softBg: "#f4f9ff",
        description: "Order pengiriman sudah diterima oleh Biteship.",
        icon: <FaCheckCircle />,
        step: 1,
      };
    case "allocated":
      return {
        label: "Kurir Ditentukan",
        color: "#1565c0",
        bg: "#e3f2fd",
        softBg: "#f4f9ff",
        description: "Kurir sudah dialokasikan untuk pesanan ini.",
        icon: <FaTruck />,
        step: 2,
      };
    case "picking_up":
      return {
        label: "Dalam Penjemputan",
        color: "#e65100",
        bg: "#fff3e0",
        softBg: "#fffaf3",
        description: "Kurir sedang menuju lokasi pengirim.",
        icon: <FaMapMarkerAlt />,
        step: 3,
      };
    case "picked":
      return {
        label: "Diambil",
        color: "#e65100",
        bg: "#fff3e0",
        softBg: "#fffaf3",
        description: "Paket sudah diambil oleh kurir.",
        icon: <FaBoxOpen />,
        step: 4,
      };
    case "dropping_off":
    case "in_transit":
      return {
        label: "Dalam Pengiriman",
        color: "#4f46e5",
        bg: "#eef2ff",
        softBg: "#f7f7ff",
        description: "Paket sedang dalam perjalanan ke alamat tujuan.",
        icon: <FaShippingFast />,
        step: 5,
      };
    case "delivered":
      return {
        label: "Terkirim",
        color: "#059669",
        bg: "#ecfdf5",
        softBg: "#f3fdf8",
        description: "Paket sudah berhasil diterima.",
        icon: <FaCheckCircle />,
        step: 6,
      };
    case "rejected":
      return {
        label: "Ditolak",
        color: "#c62828",
        bg: "#fce4ec",
        softBg: "#fff6f8",
        description: "Pengiriman ditolak atau tidak dapat diterima.",
        icon: <FaTimesCircle />,
        step: 0,
      };
    case "cancelled":
      return {
        label: "Dibatalkan",
        color: "#424242",
        bg: "#f5f5f5",
        softBg: "#fafafa",
        description: "Pengiriman dibatalkan.",
        icon: <FaBan />,
        step: 0,
      };
    case "courier_not_found":
      return {
        label: "Kurir Tidak Ditemukan",
        color: "#c62828",
        bg: "#fce4ec",
        softBg: "#fff6f8",
        description: "Sistem belum menemukan kurir yang tersedia.",
        icon: <FaSearch />,
        step: 0,
      };
    case "returned":
      return {
        label: "Dikembalikan",
        color: "#e65100",
        bg: "#fff3e0",
        softBg: "#fffaf3",
        description: "Paket sedang atau sudah dikembalikan.",
        icon: <FaUndoAlt />,
        step: 0,
      };
    default:
      return {
        label: status || "Belum Ada Status",
        color: "#64748b",
        bg: "#f1f5f9",
        softBg: "#f8fafc",
        description: "Status pengiriman akan muncul saat tersedia.",
        icon: <FaTruck />,
        step: status ? 1 : 0,
      };
  }
}

const progressSteps = [
  "Dikonfirmasi",
  "Kurir",
  "Jemput",
  "Diambil",
  "Dikirim",
  "Selesai",
];

function getTrackingTime(event: TrackingEvent) {
  return formatDateTime(event.timestamp || event.date);
}

function getTrackingText(event: TrackingEvent) {
  return event.note || event.description || event.status || "-";
}

function getOrderItemName(item: AdminOrderItem) {
  return item.productName || item.name || `Produk #${item.productId ?? item.id}`;
}

function getOrderItemVariant(item: AdminOrderItem) {
  return item.variantName || "Default";
}

function getOrderItemTotal(item: AdminOrderItem) {
  return item.total ?? item.price * item.quantity;
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { detail: order, detailLoading } = useAppSelector(
    (state) => state.admin.orders,
  );
  const { actionLoading } = useAppSelector((state) => state.admin);

  const [showCancel, setShowCancel] = useState(false);
  const [trackingInput, setTrackingInput] = useState("");

  useEffect(() => {
    if (id) dispatch(fetchOrderDetail(Number(id)));
  }, [dispatch, id]);

  const sortedHistory = useMemo(() => {
    const history = order?.shipment?.trackingHistory ?? [];
    return [...history].reverse();
  }, [order?.shipment?.trackingHistory]);

  if (detailLoading || !order) {
    return (
      <div className="admin-order-detail-loading">
        <Spinner
          animation="border"
          style={{ color: "#6366f1", width: "2.5rem", height: "2.5rem" }}
        />
        <p>Memuat detail order...</p>
      </div>
    );
  }

  const orderStatus = getOrderStatusMeta(order.status);
  const shipment = order.shipment;
  const shipmentStatus = getShippingStatusMeta(shipment?.status ?? "");
  const progress = Math.max(
    0,
    Math.min(shipmentStatus.step, progressSteps.length),
  );
  const latestHistory = sortedHistory[0];

  const handleMarkProcessed = () => {
    dispatch(updateOrderStatus({ id: order.id, status: "PROCESSING" }));
  };

  const handleCancel = () => {
    dispatch(updateOrderStatus({ id: order.id, status: "CANCELLED" }));
    setShowCancel(false);
  };

  const handleRefreshPayment = () => {
    dispatch(refreshPayment(order.id));
  };

  const handleRetryShipment = () => {
    dispatch(retryShipment(order.id));
  };

  const handleUpdateTracking = () => {
    const trackingId = trackingInput.trim();
    if (!trackingId) return;
    dispatch(updateTracking({ id: order.id, trackingId }));
    setTrackingInput("");
  };

  console.log("items", order);

  return (
    <div className="admin-order-detail">
      <div className="admin-order-shell">
        <button
          className="order-back-button"
          onClick={() => navigate("/admin/orders")}
        >
          <FaArrowLeft /> Kembali ke Orders
        </button>

        <motion.header
          className="order-hero-card"
          {...fadeUp}
          transition={{ duration: 0.25 }}
        >
          <div className="order-hero-main">
            <div>
              <span className="order-eyebrow">Order Detail</span>
              <h1>#{order.externalId || order.id}</h1>
              <p>
                Internal ID {order.id} dibuat pada{" "}
                {formatDateTime(order.createdAt)}
              </p>
            </div>
            <span
              className={`status-pill status-pill--${orderStatus.tone}`}
              style={{ background: orderStatus.bg, color: orderStatus.color }}
            >
              {orderStatus.icon}
              {orderStatus.label}
            </span>
          </div>

          <div className="order-hero-summary">
            <div className="order-hero-metric">
              <span>Total Order</span>
              <strong>{formatCurrency(order.amount)}</strong>
            </div>
            <div className="order-hero-metric">
              <span>Customer</span>
              <strong>{order.email}</strong>
            </div>
            <div className="order-hero-metric">
              <span>Payment</span>
              <strong>
                {order.paymentStatus || order.payments?.[0]?.status || "-"}
              </strong>
            </div>
            <div className="order-hero-metric">
              <span>Shipping</span>
              <strong>{shipmentStatus.label}</strong>
            </div>
          </div>
        </motion.header>

        <div
          className="order-status-strip"
          style={{ borderColor: orderStatus.color }}
        >
          <span style={{ color: orderStatus.color }}>{orderStatus.icon}</span>
          <div>
            <strong>{orderStatus.label}</strong>
            <p>{orderStatus.description}</p>
          </div>
        </div>

        <div className="order-detail-layout">
          <main className="order-main-column">
            <motion.section
              className="order-card"
              {...fadeUp}
              transition={{ duration: 0.25, delay: 0.05 }}
            >
              <div className="order-card__header">
                <div>
                  <FaShoppingCart />
                  <h2>Produk Dipesan</h2>
                </div>
                <span>{order.items?.length ?? 0} item</span>
              </div>
              <div className="order-card__body">
                {order.items && order.items.length > 0 ? (
                  <>
                    <div className="order-items">
                      {order.items.map((item, index) => (
                        <div className="order-item" key={item.id}>
                          <div className="order-item__index">{index + 1}</div>
                          <div className="order-item__content">
                            <strong>{getOrderItemName(item)}</strong>
                            <span>
                              {getOrderItemVariant(item)} · {item.quantity} x{" "}
                              {formatCurrency(item.price)}
                            </span>
                          </div>
                          <div className="order-item__total">
                            {formatCurrency(getOrderItemTotal(item))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="order-total-row">
                      <span>Grand Total</span>
                      <strong>{formatCurrency(order.amount)}</strong>
                    </div>
                  </>
                ) : (
                  <div className="empty-state">Item order belum tersedia.</div>
                )}
              </div>
            </motion.section>

            <motion.section
              className="order-card"
              {...fadeUp}
              transition={{ duration: 0.25, delay: 0.1 }}
            >
              <div className="order-card__header">
                <div>
                  <FaCreditCard />
                  <h2>Pembayaran</h2>
                </div>
              </div>
              <div className="order-card__body">
                {order.payments && order.payments.length > 0 ? (
                  <div className="payment-list">
                    {order.payments.map((payment) => {
                      const paymentMeta = getPaymentStatusMeta(payment.status);
                      return (
                        <div className="payment-panel" key={payment.id}>
                          <div className="payment-panel__top">
                            <div>
                              <strong>
                                {payment.paymentMethod || "Payment"}
                              </strong>
                              <span>{payment.paymentChannel || "-"}</span>
                            </div>
                            <span
                              style={{
                                color: paymentMeta.color,
                                background: paymentMeta.bg,
                              }}
                            >
                              {payment.status}
                            </span>
                          </div>
                          <div className="payment-info-grid">
                            <InfoTile
                              label="Amount"
                              value={formatCurrency(payment.amount)}
                            />
                            <InfoTile
                              label="Reference"
                              value={payment.externalId || "-"}
                              mono
                            />
                            <InfoTile
                              label="Paid At"
                              value={formatDateTime(payment.paidAt)}
                            />
                            <InfoTile
                              label="Created At"
                              value={formatDateTime(payment.createdAt)}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="empty-state">
                    Data pembayaran belum tersedia.
                  </div>
                )}
              </div>
            </motion.section>

            <motion.section
              className="order-card"
              {...fadeUp}
              transition={{ duration: 0.25, delay: 0.15 }}
            >
              <div className="order-card__header">
                <div>
                  <FaTruck />
                  <h2>Pengiriman</h2>
                </div>
              </div>
              <div className="order-card__body">
                {shipment ? (
                  <>
                    <div
                      className="shipment-overview"
                      style={{ background: shipmentStatus.softBg }}
                    >
                      <div className="shipment-overview__top">
                        <div
                          className="shipment-overview__icon"
                          style={{
                            color: shipmentStatus.color,
                            background: shipmentStatus.bg,
                          }}
                        >
                          {shipmentStatus.icon}
                        </div>
                        <div>
                          <span>Status terbaru</span>
                          <h3 style={{ color: shipmentStatus.color }}>
                            {shipmentStatus.label}
                          </h3>
                          <p>{shipmentStatus.description}</p>
                        </div>
                      </div>

                      <div className="shipment-meta-grid">
                        <InfoTile
                          label="Kurir"
                          value={`${shipment.courierCompany || "-"} ${shipment.courierType || ""}`.trim()}
                        />
                        <InfoTile
                          label="Waybill"
                          value={shipment.waybillId || "Belum tersedia"}
                          mono
                        />
                        <InfoTile
                          label="Tracking ID"
                          value={
                            shipment.trackingId ||
                            shipment.orderExternalId ||
                            "-"
                          }
                          mono
                        />
                      </div>

                      <div
                        className="shipment-progress"
                        aria-label="Progress pengiriman"
                      >
                        <div className="shipment-progress__track">
                          <div
                            className="shipment-progress__bar"
                            style={{
                              width: `${(progress / progressSteps.length) * 100}%`,
                              background: shipmentStatus.color,
                            }}
                          />
                        </div>
                        <div className="shipment-progress__labels">
                          {progressSteps.map((label, index) => (
                            <span
                              key={label}
                              className={
                                index < progress
                                  ? "shipment-progress__label--done"
                                  : ""
                              }
                            >
                              {label}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {latestHistory && (
                      <div className="latest-tracking">
                        <FaMapMarkedAlt />
                        <div>
                          <span>Update terakhir</span>
                          <strong>{getTrackingText(latestHistory)}</strong>
                          <small>{getTrackingTime(latestHistory)}</small>
                        </div>
                      </div>
                    )}

                    <div className="timeline-section-title">
                      <div>
                        <FaRoute />
                        <span>Riwayat Tracking</span>
                      </div>
                      <small>{sortedHistory.length} update</small>
                    </div>

                    {sortedHistory.length > 0 ? (
                      <div className="tracking-timeline">
                        {sortedHistory.map((event, index) => {
                          const eventMeta = getShippingStatusMeta(event.status);
                          const isFirst = index === 0;
                          return (
                            <div
                              className={`tracking-timeline__item ${
                                isFirst ? "tracking-timeline__item--active" : ""
                              }`}
                              key={`${event.status}-${index}`}
                            >
                              <div
                                className="tracking-timeline__node"
                                style={{
                                  color: eventMeta.color,
                                  background: eventMeta.bg,
                                }}
                              >
                                {isFirst ? (
                                  <FaClipboardCheck />
                                ) : (
                                  eventMeta.icon
                                )}
                              </div>
                              <div className="tracking-timeline__content">
                                <div className="tracking-timeline__header">
                                  <span
                                    style={{
                                      color: eventMeta.color,
                                      background: eventMeta.bg,
                                    }}
                                  >
                                    {eventMeta.label}
                                  </span>
                                  <small>{getTrackingTime(event)}</small>
                                </div>
                                <p>{getTrackingText(event)}</p>
                                <div className="tracking-timeline__chips">
                                  <span>
                                    Event #{sortedHistory.length - index}
                                  </span>
                                  <span>{event.status}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="empty-state">
                        Riwayat tracking belum tersedia.
                      </div>
                    )}
                  </>
                ) : (
                  <div className="empty-state">
                    Pengiriman belum dibuat untuk order ini.
                  </div>
                )}
              </div>
            </motion.section>
          </main>

          <aside className="order-side-column order-side-column--sticky">
            <motion.section
              className="order-card"
              {...fadeUp}
              transition={{ duration: 0.25, delay: 0.05 }}
            >
              <div className="order-card__header">
                <div>
                  <FaReceipt />
                  <h2>Ringkasan</h2>
                </div>
              </div>
              <div className="order-card__body">
                <div className="summary-list">
                  <SummaryRow
                    icon={<FaHashtag />}
                    label="External ID"
                    value={order.externalId || "-"}
                    mono
                  />
                  <SummaryRow
                    icon={<FaEnvelope />}
                    label="Email Customer"
                    value={order.email}
                  />
                  <SummaryRow
                    icon={<FaCalendarAlt />}
                    label="Created At"
                    value={formatDateTime(order.createdAt)}
                  />
                  <SummaryRow
                    icon={<FaCreditCard />}
                    label="Total"
                    value={formatCurrency(order.amount)}
                    highlight
                  />
                </div>
              </div>
            </motion.section>

            <motion.section
              className="order-card"
              {...fadeUp}
              transition={{ duration: 0.25, delay: 0.1 }}
            >
              <div className="order-card__header">
                <div>
                  <FaTools />
                  <h2>Admin Actions</h2>
                </div>
              </div>
              <div className="order-card__body">
                <div className="admin-actions">
                  {order.status === "PAID" && (
                    <button
                      className="admin-action admin-action--primary"
                      onClick={handleMarkProcessed}
                      disabled={actionLoading}
                    >
                      <FaCheckCircle /> Mark Processed
                    </button>
                  )}
                  {order.status !== "CANCELLED" &&
                    order.status !== "DELIVERED" && (
                      <button
                        className="admin-action admin-action--danger"
                        onClick={() => setShowCancel(true)}
                        disabled={actionLoading}
                      >
                        <FaTimesCircle /> Cancel Order
                      </button>
                    )}
                  {order.payments && order.payments.length > 0 && (
                    <button
                      className="admin-action admin-action--info"
                      onClick={handleRefreshPayment}
                      disabled={actionLoading}
                    >
                      <FaCreditCard /> Refresh Payment
                    </button>
                  )}
                  {order.status === "PROCESSING" && (
                    <button
                      className="admin-action admin-action--warning"
                      onClick={handleRetryShipment}
                      disabled={actionLoading}
                    >
                      <FaTruck /> Retry Shipment
                    </button>
                  )}
                </div>

                <div className="tracking-update-box">
                  <label htmlFor="tracking-number">
                    Update Tracking Number
                  </label>
                  <div className="tracking-input-group">
                    <input
                      id="tracking-number"
                      type="text"
                      placeholder="Masukkan tracking number"
                      value={trackingInput}
                      onChange={(e) => setTrackingInput(e.target.value)}
                    />
                    <button
                      onClick={handleUpdateTracking}
                      disabled={actionLoading || !trackingInput.trim()}
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </motion.section>
          </aside>
        </div>
      </div>

      <ConfirmActionModal
        show={showCancel}
        onHide={() => setShowCancel(false)}
        onConfirm={handleCancel}
        title="Cancel Order"
        message="Apakah Anda yakin ingin membatalkan order ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Cancel Order"
        confirmVariant="danger"
        loading={actionLoading}
      />
    </div>
  );
}

function InfoTile({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="info-tile">
      <span>{label}</span>
      <strong className={mono ? "is-mono" : ""}>{value}</strong>
    </div>
  );
}

function SummaryRow({
  icon,
  label,
  value,
  mono = false,
  highlight = false,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  mono?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="summary-row">
      <div className="summary-row__icon">{icon}</div>
      <div>
        <span>{label}</span>
        <strong
          className={`${mono ? "is-mono" : ""} ${highlight ? "is-highlight" : ""}`}
        >
          {value}
        </strong>
      </div>
    </div>
  );
}

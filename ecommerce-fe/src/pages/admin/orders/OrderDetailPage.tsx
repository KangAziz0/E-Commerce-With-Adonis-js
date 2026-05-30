import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { motion } from "framer-motion";
import {
  FaArrowLeft,
  FaShoppingCart,
  FaCreditCard,
  FaTruck,
  FaReceipt,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaBoxOpen,
  FaHashtag,
  FaEnvelope,
  FaCalendarAlt,
  FaTools,
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
import ConfirmActionModal from "@/components/common/Modal/ConfirmActionModal";
import "./OrderDetailPage.css";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(value);

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

function getStatusConfig(status: string) {
  switch (status) {
    case "PAID":
      return {
        gradient: "linear-gradient(135deg, #10b981, #059669)",
        bg: "rgba(16, 185, 129, 0.1)",
        borderColor: "#10b981",
        icon: <FaCheckCircle />,
        label: "Paid",
        description: "Payment received. Order is ready to be processed.",
      };
    case "PROCESSING":
      return {
        gradient: "linear-gradient(135deg, #6366f1, #4f46e5)",
        bg: "rgba(99, 102, 241, 0.1)",
        borderColor: "#6366f1",
        icon: <FaBoxOpen />,
        label: "Processing",
        description: "Order is being prepared for shipment.",
      };
    case "SHIPPED":
      return {
        gradient: "linear-gradient(135deg, #06b6d4, #0891b2)",
        bg: "rgba(6, 182, 212, 0.1)",
        borderColor: "#06b6d4",
        icon: <FaTruck />,
        label: "Shipped",
        description: "Order has been shipped and is on the way.",
      };
    case "DELIVERED":
      return {
        gradient: "linear-gradient(135deg, #10b981, #047857)",
        bg: "rgba(16, 185, 129, 0.1)",
        borderColor: "#10b981",
        icon: <FaCheckCircle />,
        label: "Delivered",
        description: "Order has been delivered successfully.",
      };
    case "CANCELLED":
      return {
        gradient: "linear-gradient(135deg, #ef4444, #dc2626)",
        bg: "rgba(239, 68, 68, 0.1)",
        borderColor: "#ef4444",
        icon: <FaTimesCircle />,
        label: "Cancelled",
        description: "This order has been cancelled.",
      };
    case "PENDING":
    default:
      return {
        gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
        bg: "rgba(245, 158, 11, 0.1)",
        borderColor: "#f59e0b",
        icon: <FaClock />,
        label: status || "Pending",
        description: "Waiting for payment confirmation.",
      };
  }
}

function normalizeTrackingTime(event: TrackingEvent): string {
  const raw = event.timestamp || event.date;
  if (!raw) return "-";
  return new Date(raw).toLocaleString("id-ID");
}

function normalizeTrackingText(event: TrackingEvent): string {
  return event.note || event.description || event.status || "-";
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { detail: order, detailLoading } = useAppSelector((state) => state.admin.orders);
  const { actionLoading } = useAppSelector((state) => state.admin);

  const [showCancel, setShowCancel] = useState(false);
  const [trackingInput, setTrackingInput] = useState("");

  useEffect(() => {
    if (id) dispatch(fetchOrderDetail(Number(id)));
  }, [dispatch, id]);

  if (detailLoading || !order) {
    return (
      <div className="admin-order-detail-loading">
        <Spinner animation="border" style={{ color: "#6366f1", width: "2.5rem", height: "2.5rem" }} />
        <p style={{ marginTop: "1rem", color: "#64748b" }}>Loading order details...</p>
      </div>
    );
  }

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
    if (trackingInput.trim()) {
      dispatch(updateTracking({ id: order.id, trackingId: trackingInput.trim() }));
      setTrackingInput("");
    }
  };

  const statusConfig = getStatusConfig(order.status);

  return (
    <div className="admin-order-detail">
      {/* Hero Section */}
      <div className="order-detail-hero">
        <div className="order-detail-shell">
          <button className="order-detail-back" onClick={() => navigate("/admin/orders")}>
            <FaArrowLeft /> Back to Orders
          </button>
          <div className="order-detail-hero-content">
            <div>
              <h1 className="order-detail-title">
                Order #{order.externalId || order.id}
              </h1>
              <p className="order-detail-id">
                Internal ID: {order.id} | Created: {new Date(order.createdAt).toLocaleString("id-ID")}
              </p>
            </div>
            <span
              className="order-detail-status-badge"
              style={{ background: statusConfig.gradient, color: "#fff" }}
            >
              {statusConfig.icon} {statusConfig.label}
            </span>
          </div>
        </div>
      </div>

      {/* Status Banner */}
      <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.1 }}>
        <div
          className="order-detail-status-banner"
          style={{
            background: statusConfig.bg,
            borderColor: statusConfig.borderColor,
            maxWidth: 1100,
            margin: "0 auto 1.5rem",
            padding: "1rem 1.3rem",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <span className="status-banner-icon" style={{ color: statusConfig.borderColor }}>
            {statusConfig.icon}
          </span>
          <div>
            <strong>{statusConfig.label}</strong>
            <p>{statusConfig.description}</p>
          </div>
        </div>
      </motion.div>

      {/* Grid Layout */}
      <div className="order-detail-grid">
        {/* Left Column */}
        <div>
          {/* Order Items Card */}
          {order.items && order.items.length > 0 && (
            <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.15 }}>
              <div className="detail-card">
                <div className="detail-card__header">
                  <FaShoppingCart className="detail-card__header-icon" />
                  <h2>Order Items</h2>
                  <span className="detail-card__badge">{order.items.length} items</span>
                </div>
                <div className="detail-card__body">
                  <div className="order-items-list">
                    {order.items.map((item, idx) => (
                      <div className="order-detail-item" key={item.id}>
                        <div className="order-detail-item__info">
                          <div className="order-detail-item__number">{idx + 1}</div>
                          <div>
                            <div className="order-detail-item__name">{item.productName}</div>
                            <div className="order-detail-item__meta">
                              {item.variantName} &middot; Qty: {item.quantity} &middot; {formatCurrency(item.price)}
                            </div>
                          </div>
                        </div>
                        <div className="order-detail-item__subtotal">
                          {formatCurrency(item.total)}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="order-detail-total">
                    <span>Total</span>
                    <strong>{formatCurrency(order.amount)}</strong>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Payment Card */}
          {order.payments && order.payments.length > 0 && (
            <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.2 }}>
              <div className="detail-card">
                <div className="detail-card__header">
                  <FaCreditCard className="detail-card__header-icon" />
                  <h2>Payment</h2>
                </div>
                <div className="detail-card__body">
                  {order.payments.map((payment) => (
                    <div className="payment-card" key={payment.id}>
                      <div className="payment-card__header">
                        <div className="payment-card__method">
                          {payment.paymentMethod}
                          <span className="payment-card__channel">{payment.paymentChannel}</span>
                        </div>
                        <span
                          className="payment-card__status"
                          style={{
                            background:
                              payment.status === "PAID"
                                ? "rgba(16, 185, 129, 0.1)"
                                : payment.status === "PENDING"
                                  ? "rgba(245, 158, 11, 0.1)"
                                  : "rgba(239, 68, 68, 0.1)",
                            color:
                              payment.status === "PAID"
                                ? "#059669"
                                : payment.status === "PENDING"
                                  ? "#d97706"
                                  : "#dc2626",
                          }}
                        >
                          {payment.status}
                        </span>
                      </div>
                      <div className="payment-card__details">
                        <div className="payment-detail-row">
                          <span className="payment-detail-label">Amount</span>
                          <span className="payment-detail-value">{formatCurrency(payment.amount)}</span>
                        </div>
                        <div className="payment-detail-row">
                          <span className="payment-detail-label">Reference</span>
                          <span className="payment-detail-value payment-detail-value--mono">
                            {payment.externalId || "-"}
                          </span>
                        </div>
                        <div className="payment-detail-row">
                          <span className="payment-detail-label">Paid At</span>
                          <span className="payment-detail-value">
                            {payment.paidAt ? new Date(payment.paidAt).toLocaleString("id-ID") : "-"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Shipping Info Card */}
          <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.25 }}>
            <div className="detail-card">
              <div className="detail-card__header">
                <FaTruck className="detail-card__header-icon" />
                <h2>Shipping</h2>
              </div>
              <div className="detail-card__body">
                {order.shipment ? (
                  <div className="shipping-info-grid">
                    <div className="shipping-info-item">
                      <div className="shipping-info-item__label">Courier</div>
                      <div className="shipping-info-item__value">
                        {order.shipment.courierCompany || "-"}
                      </div>
                    </div>
                    <div className="shipping-info-item">
                      <div className="shipping-info-item__label">Type</div>
                      <div className="shipping-info-item__value">
                        {order.shipment.courierType || "-"}
                      </div>
                    </div>
                    <div className="shipping-info-item">
                      <div className="shipping-info-item__label">Tracking ID</div>
                      <div className="shipping-info-item__value">
                        {order.shipment.trackingId || "-"}
                      </div>
                    </div>
                    <div className="shipping-info-item">
                      <div className="shipping-info-item__label">Waybill</div>
                      <div className="shipping-info-item__value">
                        {order.shipment.waybillId || "-"}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="no-data-message">No shipment data available yet.</div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Shipping Timeline */}
          {order.shipment?.trackingHistory && order.shipment.trackingHistory.length > 0 && (
            <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.3 }}>
              <div className="detail-card">
                <div className="detail-card__header">
                  <FaClock className="detail-card__header-icon" />
                  <h2>Tracking Timeline</h2>
                  <span className="detail-card__badge">
                    {order.shipment.trackingHistory.length} events
                  </span>
                </div>
                <div className="detail-card__body">
                  <div className="admin-shipping-timeline">
                    {order.shipment.trackingHistory.map((event, idx) => (
                      <div
                        key={idx}
                        className={`admin-timeline-item ${idx === 0 ? "admin-timeline-item--active" : ""}`}
                      >
                        <div className="admin-timeline-item__status">{event.status}</div>
                        <div className="admin-timeline-item__note">
                          {normalizeTrackingText(event)}
                        </div>
                        <div className="admin-timeline-item__time">
                          {normalizeTrackingTime(event)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Column */}
        <div>
          {/* Order Summary Card */}
          <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.15 }}>
            <div className="detail-card detail-card--sticky">
              <div className="detail-card__header">
                <FaReceipt className="detail-card__header-icon" />
                <h2>Order Summary</h2>
              </div>
              <div className="detail-card__body">
                <div className="summary-list">
                  <div className="summary-row">
                    <div className="summary-row__icon">
                      <FaHashtag />
                    </div>
                    <div className="summary-row__content">
                      <span className="summary-row__label">External ID</span>
                      <span className="summary-row__value summary-row__value--mono">
                        {order.externalId || "-"}
                      </span>
                    </div>
                  </div>
                  <div className="summary-row">
                    <div className="summary-row__icon">
                      <FaEnvelope />
                    </div>
                    <div className="summary-row__content">
                      <span className="summary-row__label">Customer Email</span>
                      <span className="summary-row__value">{order.email}</span>
                    </div>
                  </div>
                  <div className="summary-row">
                    <div className="summary-row__icon">
                      <FaCalendarAlt />
                    </div>
                    <div className="summary-row__content">
                      <span className="summary-row__label">Created At</span>
                      <span className="summary-row__value">
                        {new Date(order.createdAt).toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                  <div className="summary-row">
                    <div className="summary-row__icon">
                      <FaCreditCard />
                    </div>
                    <div className="summary-row__content">
                      <span className="summary-row__label">Total Amount</span>
                      <span className="summary-row__value" style={{ color: "#059669", fontWeight: 700 }}>
                        {formatCurrency(order.amount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Admin Actions Card */}
          <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.2 }}>
            <div className="detail-card">
              <div className="detail-card__header">
                <FaTools className="detail-card__header-icon" />
                <h2>Admin Actions</h2>
              </div>
              <div className="detail-card__body">
                <div className="admin-actions-grid">
                  {order.status === "PAID" && (
                    <button
                      className="admin-action-btn admin-action-btn--primary"
                      onClick={handleMarkProcessed}
                      disabled={actionLoading}
                    >
                      <FaCheckCircle /> Mark Processed
                    </button>
                  )}
                  {order.status !== "CANCELLED" && order.status !== "DELIVERED" && (
                    <button
                      className="admin-action-btn admin-action-btn--danger"
                      onClick={() => setShowCancel(true)}
                      disabled={actionLoading}
                    >
                      <FaTimesCircle /> Cancel Order
                    </button>
                  )}
                  {order.payments && order.payments.length > 0 && (
                    <button
                      className="admin-action-btn admin-action-btn--info"
                      onClick={handleRefreshPayment}
                      disabled={actionLoading}
                    >
                      <FaCreditCard /> Refresh Payment
                    </button>
                  )}
                  {order.status === "PROCESSING" && (
                    <button
                      className="admin-action-btn admin-action-btn--warning"
                      onClick={handleRetryShipment}
                      disabled={actionLoading}
                    >
                      <FaTruck /> Retry Shipment
                    </button>
                  )}
                </div>

                <div style={{ marginTop: "1.2rem", paddingTop: "1rem", borderTop: "1px solid #e2e8f0" }}>
                  <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#1e293b", marginBottom: "0.5rem" }}>
                    Update Tracking Number
                  </div>
                  <div className="tracking-input-group">
                    <input
                      type="text"
                      placeholder="Enter tracking number..."
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
            </div>
          </motion.div>
        </div>
      </div>

      <ConfirmActionModal
        show={showCancel}
        onHide={() => setShowCancel(false)}
        onConfirm={handleCancel}
        title="Cancel Order"
        message="Are you sure you want to cancel this order? This action cannot be undone."
        confirmText="Cancel Order"
        confirmVariant="danger"
        loading={actionLoading}
      />
    </div>
  );
}

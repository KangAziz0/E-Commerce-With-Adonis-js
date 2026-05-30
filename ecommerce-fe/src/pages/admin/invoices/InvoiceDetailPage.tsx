import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { motion } from "framer-motion";
import {
  FaArrowLeft,
  FaFileInvoiceDollar,
  FaUser,
  FaShoppingCart,
  FaCreditCard,
  FaTruck,
  FaPrint,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
} from "react-icons/fa";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { fetchInvoiceDetail } from "@/features/admin/adminSlice";
import "./InvoiceDetailPage.css";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(value);

const formatDate = (value: string) =>
  new Date(value).toLocaleString("id-ID");

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

function getPaymentStatusConfig(status: string) {
  switch (status) {
    case "PAID":
      return { className: "invoice-status-badge--paid", icon: <FaCheckCircle />, label: "Paid" };
    case "PENDING":
      return { className: "invoice-status-badge--pending", icon: <FaClock />, label: "Pending" };
    default:
      return { className: "invoice-status-badge--failed", icon: <FaTimesCircle />, label: status };
  }
}

export default function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { detail: invoice, detailLoading } = useAppSelector((state) => state.admin.invoices);

  useEffect(() => {
    if (id) dispatch(fetchInvoiceDetail(Number(id)));
  }, [dispatch, id]);

  if (detailLoading || !invoice) {
    return (
      <div className="admin-invoice-detail-loading">
        <Spinner animation="border" style={{ color: "#6366f1", width: "2.5rem", height: "2.5rem" }} />
        <p style={{ marginTop: "1rem", color: "#64748b" }}>Loading invoice details...</p>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const statusConfig = getPaymentStatusConfig(invoice.paymentStatus);

  return (
    <div className="admin-invoice-detail">
      {/* Header */}
      <div className="invoice-header">
        <button
          className="invoice-header__back d-print-none"
          onClick={() => navigate("/admin/invoices")}
        >
          <FaArrowLeft /> Back to Invoices
        </button>

        <div className="invoice-header__title-row">
          <div>
            <h1 className="invoice-header__title">
              <FaFileInvoiceDollar style={{ marginRight: "0.5rem", color: "#6366f1" }} />
              Invoice #{invoice.orderExternalId || invoice.id}
            </h1>
            <p className="invoice-header__meta">
              Created: {formatDate(invoice.createdAt)}
            </p>
          </div>
          <div className="invoice-header__actions">
            <span className={`invoice-status-badge ${statusConfig.className}`}>
              {statusConfig.icon} {statusConfig.label}
            </span>
            <button
              className="invoice-print-btn d-print-none"
              onClick={handlePrint}
            >
              <FaPrint /> Print
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="invoice-content">
        {/* Top Row: Customer Info + Payment Summary */}
        <div className="invoice-grid">
          <motion.section {...fadeUp} transition={{ duration: 0.4, delay: 0.1 }}>
            <div className="invoice-card">
              <div className="invoice-card__header">
                <FaUser className="invoice-card__header-icon" />
                <h2>Customer Info</h2>
              </div>
              <div className="invoice-card__body">
                <div className="customer-info-list">
                  <div className="customer-info-row">
                    <span className="customer-info-row__label">Email</span>
                    <span className="customer-info-row__value">{invoice.email}</span>
                  </div>
                  <div className="customer-info-row">
                    <span className="customer-info-row__label">Order ID</span>
                    <span className="customer-info-row__value customer-info-row__value--mono">
                      {invoice.orderExternalId}
                    </span>
                  </div>
                  <div className="customer-info-row">
                    <span className="customer-info-row__label">Invoice ID</span>
                    <span className="customer-info-row__value customer-info-row__value--mono">
                      #{invoice.id}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section {...fadeUp} transition={{ duration: 0.4, delay: 0.15 }}>
            <div className="invoice-card">
              <div className="invoice-card__header">
                <FaCreditCard className="invoice-card__header-icon" />
                <h2>Payment Summary</h2>
              </div>
              <div className="invoice-card__body">
                <div className="amount-summary">
                  <div className="amount-summary__label">Total Amount</div>
                  <div className="amount-summary__value">{formatCurrency(invoice.amount)}</div>
                </div>
              </div>
            </div>
          </motion.section>
        </div>

        {/* Order Items Card */}
        {invoice.items && invoice.items.length > 0 && (
          <motion.section {...fadeUp} transition={{ duration: 0.4, delay: 0.2 }}>
            <div className="invoice-card">
              <div className="invoice-card__header">
                <FaShoppingCart className="invoice-card__header-icon" />
                <h2>Order Items</h2>
                <span className="invoice-card__badge">{invoice.items.length} items</span>
              </div>
              <div className="invoice-card__body" style={{ padding: 0 }}>
                <table className="invoice-items-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Variant</th>
                      <th className="text-center">Qty</th>
                      <th className="text-end">Price</th>
                      <th className="text-end">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item) => (
                      <tr key={item.id}>
                        <td className="invoice-items-table__product">{item.productName}</td>
                        <td className="invoice-items-table__variant">{item.variantName}</td>
                        <td className="text-center">{item.quantity}</td>
                        <td className="text-end">{formatCurrency(item.price)}</td>
                        <td className="text-end" style={{ fontWeight: 600 }}>
                          {formatCurrency(item.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="invoice-items-total" style={{ margin: "0 0.8rem", paddingBottom: "1rem" }}>
                  <span className="invoice-items-total__label">Grand Total</span>
                  <span className="invoice-items-total__value">{formatCurrency(invoice.amount)}</span>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Bottom Row: Payment Details + Shipping */}
        <div className="invoice-grid">
          {/* Payment Details Card */}
          {invoice.payment && (
            <motion.section {...fadeUp} transition={{ duration: 0.4, delay: 0.25 }}>
              <div className="invoice-card">
                <div className="invoice-card__header">
                  <FaCreditCard className="invoice-card__header-icon" />
                  <h2>Payment Details</h2>
                </div>
                <div className="invoice-card__body">
                  <div className="payment-info-card">
                    <div className="payment-info-card__header">
                      <div className="payment-info-card__method">
                        {invoice.payment.paymentMethod}
                        <span className="payment-info-card__channel">
                          {invoice.payment.paymentChannel}
                        </span>
                      </div>
                      <span
                        className="payment-info-card__status"
                        style={{
                          background:
                            invoice.payment.status === "PAID"
                              ? "rgba(16, 185, 129, 0.1)"
                              : invoice.payment.status === "PENDING"
                                ? "rgba(245, 158, 11, 0.1)"
                                : "rgba(239, 68, 68, 0.1)",
                          color:
                            invoice.payment.status === "PAID"
                              ? "#059669"
                              : invoice.payment.status === "PENDING"
                                ? "#d97706"
                                : "#dc2626",
                        }}
                      >
                        {invoice.payment.status}
                      </span>
                    </div>
                    <div className="payment-info-card__details">
                      <div className="payment-detail-row">
                        <span className="payment-detail-row__label">Amount</span>
                        <span className="payment-detail-row__value">
                          {formatCurrency(invoice.payment.amount)}
                        </span>
                      </div>
                      <div className="payment-detail-row">
                        <span className="payment-detail-row__label">Paid At</span>
                        <span className="payment-detail-row__value">
                          {invoice.payment.paidAt ? formatDate(invoice.payment.paidAt) : "-"}
                        </span>
                      </div>
                      <div className="payment-detail-row">
                        <span className="payment-detail-row__label">Expires At</span>
                        <span className="payment-detail-row__value">
                          {invoice.payment.expiresAt ? formatDate(invoice.payment.expiresAt) : "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {/* Shipping Card */}
          {invoice.shipment && (
            <motion.section {...fadeUp} transition={{ duration: 0.4, delay: 0.3 }}>
              <div className="invoice-card">
                <div className="invoice-card__header">
                  <FaTruck className="invoice-card__header-icon" />
                  <h2>Shipping</h2>
                </div>
                <div className="invoice-card__body">
                  <div className="shipping-info-grid">
                    <div className="shipping-info-item">
                      <div className="shipping-info-item__label">Courier</div>
                      <div className="shipping-info-item__value">
                        {invoice.shipment.courierCompany || "-"}
                      </div>
                    </div>
                    <div className="shipping-info-item">
                      <div className="shipping-info-item__label">Tracking ID</div>
                      <div className="shipping-info-item__value">
                        {invoice.shipment.trackingId || "-"}
                      </div>
                    </div>
                    <div className="shipping-info-item">
                      <div className="shipping-info-item__label">Waybill</div>
                      <div className="shipping-info-item__value">
                        {invoice.shipment.waybillId || "-"}
                      </div>
                    </div>
                    <div className="shipping-info-item">
                      <div className="shipping-info-item__label">Status</div>
                      <div className="shipping-info-item__value">
                        <span className="shipping-status-badge">
                          {invoice.shipment.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </div>

        {/* If no payment and no shipment, show a note */}
        {!invoice.payment && !invoice.shipment && (
          <motion.section {...fadeUp} transition={{ duration: 0.4, delay: 0.25 }}>
            <div className="invoice-card">
              <div className="invoice-card__body">
                <div className="no-data-message">
                  No additional payment or shipping details available yet.
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}

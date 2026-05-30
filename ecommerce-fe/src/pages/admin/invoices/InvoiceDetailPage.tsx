import { useEffect } from "react";
import type { ReactNode } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { motion } from "framer-motion";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaCreditCard,
  FaEnvelope,
  FaFileInvoiceDollar,
  FaHashtag,
  FaPrint,
  FaReceipt,
  FaShippingFast,
  FaShoppingCart,
  FaTimesCircle,
  FaTruck,
  FaUser,
} from "react-icons/fa";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { fetchInvoiceDetail } from "@/features/admin/adminSlice";
import type { AdminOrderItem } from "@/features/admin/admin.types";
import "./InvoiceDetailPage.css";

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

function getInvoiceItemName(item: AdminOrderItem) {
  return item.productName || item.name || `Produk #${item.productId ?? item.id}`;
}

function getInvoiceItemVariant(item: AdminOrderItem) {
  return item.variantName || "Default";
}

function getInvoiceItemTotal(item: AdminOrderItem) {
  return item.total ?? item.price * item.quantity;
}

function getPaymentStatusMeta(status: string) {
  switch (status) {
    case "PAID":
    case "SETTLED":
      return {
        label: "Paid",
        tone: "paid",
        color: "#059669",
        bg: "#ecfdf5",
        icon: <FaCheckCircle />,
        description: "Pembayaran sudah diterima.",
      };
    case "PENDING":
      return {
        label: "Pending",
        tone: "pending",
        color: "#d97706",
        bg: "#fffbeb",
        icon: <FaClock />,
        description: "Pembayaran masih menunggu konfirmasi.",
      };
    default:
      return {
        label: status || "Failed",
        tone: "failed",
        color: "#dc2626",
        bg: "#fef2f2",
        icon: <FaTimesCircle />,
        description: "Pembayaran gagal, kedaluwarsa, atau belum valid.",
      };
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
        <Spinner
          animation="border"
          style={{ color: "#6366f1", width: "2.5rem", height: "2.5rem" }}
        />
        <p>Memuat detail invoice...</p>
      </div>
    );
  }

  const paymentStatus = getPaymentStatusMeta(invoice.paymentStatus);
  const payment = invoice.payment;
  const shipment = invoice.shipment;

  return (
    <div className="admin-invoice-detail">
      <div className="invoice-shell">
        <button
          className="invoice-back-button d-print-none"
          onClick={() => navigate("/admin/invoices")}
        >
          <FaArrowLeft /> Kembali ke Invoice
        </button>

        <motion.header className="invoice-hero-card" {...fadeUp} transition={{ duration: 0.25 }}>
          <div className="invoice-hero-main">
            <div>
              <span className="invoice-eyebrow">Invoice Detail</span>
              <h1>#{invoice.orderExternalId || invoice.id}</h1>
              <p>
                Invoice #{invoice.id} dibuat pada {formatDateTime(invoice.createdAt)}
              </p>
            </div>
            <div className="invoice-hero-actions">
              <span
                className={`invoice-status-pill invoice-status-pill--${paymentStatus.tone}`}
                style={{ background: paymentStatus.bg, color: paymentStatus.color }}
              >
                {paymentStatus.icon}
                {paymentStatus.label}
              </span>
              <button className="invoice-print-button d-print-none" onClick={() => window.print()}>
                <FaPrint /> Print
              </button>
            </div>
          </div>

          <div className="invoice-hero-summary">
            <MetricTile label="Total Amount" value={formatCurrency(invoice.amount)} highlight />
            <MetricTile label="Customer" value={invoice.email} />
            <MetricTile label="Order ID" value={invoice.orderExternalId || "-"} mono />
            <MetricTile label="Payment" value={invoice.paymentStatus || "-"} />
          </div>
        </motion.header>

        <div className="invoice-status-strip" style={{ borderColor: paymentStatus.color }}>
          <span style={{ color: paymentStatus.color }}>{paymentStatus.icon}</span>
          <div>
            <strong>{paymentStatus.label}</strong>
            <p>{paymentStatus.description}</p>
          </div>
        </div>

        <div className="invoice-layout">
          <main className="invoice-main-column">
            <motion.section className="invoice-card" {...fadeUp} transition={{ duration: 0.25, delay: 0.05 }}>
              <div className="invoice-card__header">
                <div>
                  <FaShoppingCart />
                  <h2>Order Items</h2>
                </div>
                <span>{invoice.items?.length ?? 0} item</span>
              </div>
              <div className="invoice-card__body invoice-card__body--flush">
                {invoice.items && invoice.items.length > 0 ? (
                  <>
                    <div className="invoice-items-table-wrap">
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
                              <td>
                                <strong>{getInvoiceItemName(item)}</strong>
                              </td>
                              <td className="muted-cell">{getInvoiceItemVariant(item)}</td>
                              <td className="text-center">{item.quantity}</td>
                              <td className="text-end">{formatCurrency(item.price)}</td>
                              <td className="text-end strong-cell">
                                {formatCurrency(getInvoiceItemTotal(item))}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="invoice-total-row">
                      <span>Grand Total</span>
                      <strong>{formatCurrency(invoice.amount)}</strong>
                    </div>
                  </>
                ) : (
                  <div className="empty-state">Item invoice belum tersedia.</div>
                )}
              </div>
            </motion.section>

            <motion.section className="invoice-card" {...fadeUp} transition={{ duration: 0.25, delay: 0.1 }}>
              <div className="invoice-card__header">
                <div>
                  <FaCreditCard />
                  <h2>Payment Details</h2>
                </div>
              </div>
              <div className="invoice-card__body">
                {payment ? (
                  <div className="payment-panel">
                    <div className="payment-panel__top">
                      <div>
                        <strong>{payment.paymentMethod || "Payment"}</strong>
                        <span>{payment.paymentChannel || "-"}</span>
                      </div>
                      <span style={{ color: paymentStatus.color, background: paymentStatus.bg }}>
                        {payment.status}
                      </span>
                    </div>
                    <div className="info-grid">
                      <InfoTile label="Amount" value={formatCurrency(payment.amount)} />
                      <InfoTile label="Reference" value={payment.externalId || "-"} mono />
                      <InfoTile label="Paid At" value={formatDateTime(payment.paidAt)} />
                      <InfoTile label="Expires At" value={formatDateTime(payment.expiresAt)} />
                      <InfoTile label="Created At" value={formatDateTime(payment.createdAt)} />
                      <InfoTile label="Channel" value={payment.paymentChannel || "-"} />
                    </div>
                  </div>
                ) : (
                  <div className="empty-state">Data pembayaran belum tersedia.</div>
                )}
              </div>
            </motion.section>

            <motion.section className="invoice-card" {...fadeUp} transition={{ duration: 0.25, delay: 0.15 }}>
              <div className="invoice-card__header">
                <div>
                  <FaTruck />
                  <h2>Shipping</h2>
                </div>
              </div>
              <div className="invoice-card__body">
                {shipment ? (
                  <div className="shipment-panel">
                    <div className="shipment-panel__top">
                      <div className="shipment-panel__icon">
                        <FaShippingFast />
                      </div>
                      <div>
                        <strong>{shipment.status || "Shipment"}</strong>
                        <span>
                          {(shipment.courierCompany || "-").toUpperCase()} {shipment.courierType || ""}
                        </span>
                      </div>
                    </div>
                    <div className="info-grid">
                      <InfoTile label="Courier" value={shipment.courierCompany || "-"} />
                      <InfoTile label="Service" value={shipment.courierType || "-"} />
                      <InfoTile label="Tracking ID" value={shipment.trackingId || "-"} mono />
                      <InfoTile label="Waybill" value={shipment.waybillId || "-"} mono />
                    </div>
                  </div>
                ) : (
                  <div className="empty-state">Data pengiriman belum tersedia.</div>
                )}
              </div>
            </motion.section>
          </main>

          <aside className="invoice-side-column">
            <motion.section className="invoice-card invoice-card--sticky" {...fadeUp} transition={{ duration: 0.25, delay: 0.05 }}>
              <div className="invoice-card__header">
                <div>
                  <FaReceipt />
                  <h2>Invoice Summary</h2>
                </div>
              </div>
              <div className="invoice-card__body">
                <div className="summary-list">
                  <SummaryRow icon={<FaFileInvoiceDollar />} label="Invoice ID" value={`#${invoice.id}`} mono />
                  <SummaryRow icon={<FaHashtag />} label="Order ID" value={invoice.orderExternalId || "-"} mono />
                  <SummaryRow icon={<FaEnvelope />} label="Customer Email" value={invoice.email} />
                  <SummaryRow icon={<FaCalendarAlt />} label="Created At" value={formatDateTime(invoice.createdAt)} />
                  <SummaryRow icon={<FaCreditCard />} label="Total" value={formatCurrency(invoice.amount)} highlight />
                </div>
              </div>
            </motion.section>

            <motion.section className="invoice-card" {...fadeUp} transition={{ duration: 0.25, delay: 0.1 }}>
              <div className="invoice-card__header">
                <div>
                  <FaUser />
                  <h2>Customer</h2>
                </div>
              </div>
              <div className="invoice-card__body">
                <div className="customer-panel">
                  <div className="customer-panel__avatar">
                    {invoice.email.slice(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <strong>{invoice.email}</strong>
                    <span>Invoice customer</span>
                  </div>
                </div>
              </div>
            </motion.section>
          </aside>
        </div>
      </div>
    </div>
  );
}

function MetricTile({
  label,
  value,
  mono = false,
  highlight = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="invoice-metric">
      <span>{label}</span>
      <strong className={`${mono ? "is-mono" : ""} ${highlight ? "is-highlight" : ""}`}>
        {value}
      </strong>
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
        <strong className={`${mono ? "is-mono" : ""} ${highlight ? "is-highlight" : ""}`}>
          {value}
        </strong>
      </div>
    </div>
  );
}

import { motion } from "framer-motion";
import {
  FaBan,
  FaBoxOpen,
  FaCheckCircle,
  FaClipboardCheck,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaRoute,
  FaSearch,
  FaShippingFast,
  FaTimesCircle,
  FaTruck,
  FaUndoAlt,
} from "react-icons/fa";

import type { Shipment } from "@/features/orders/order.types";

import "./ShippingTimeline.css";

interface ShippingTimelineProps {
  shipment: Shipment;
}

interface StatusMeta {
  label: string;
  color: string;
  bg: string;
  softBg: string;
  description: string;
  icon: React.ReactNode;
  step: number;
}

function getShippingStatusMeta(status: string): StatusMeta {
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
    case "disposed":
      return {
        label: "Dibuang",
        color: "#424242",
        bg: "#f5f5f5",
        softBg: "#fafafa",
        description: "Paket ditandai disposed oleh kurir.",
        icon: <FaTimesCircle />,
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
        label: status,
        color: "#64748b",
        bg: "#f1f5f9",
        softBg: "#f8fafc",
        description: "Status pengiriman diperbarui.",
        icon: <FaTruck />,
        step: 1,
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

function formatTimelineDate(value: string): string {
  if (!value) return "-";
  return new Date(value).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function ShippingTimeline({ shipment }: ShippingTimelineProps) {
  const currentStatusMeta = getShippingStatusMeta(shipment.status);
  const sortedHistory = [...shipment.trackingHistory].reverse();
  const progress = Math.max(0, Math.min(currentStatusMeta.step, progressSteps.length));
  const latestHistory = sortedHistory[0];

  return (
    <motion.section
      className="detail-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.35 }}
    >
      <div className="detail-card__header">
        <FaTruck className="detail-card__header-icon" />
        <h2>Timeline Pengiriman</h2>
      </div>
      <div className="detail-card__body">
        <div
          className="shipping-timeline__hero"
          style={{ background: currentStatusMeta.softBg }}
        >
          <div className="shipping-timeline__hero-top">
            <div
              className="shipping-timeline__hero-icon"
              style={{ color: currentStatusMeta.color, background: currentStatusMeta.bg }}
            >
              {currentStatusMeta.icon}
            </div>
            <div>
              <span className="shipping-timeline__eyebrow">Status terbaru</span>
              <h3 style={{ color: currentStatusMeta.color }}>
                {currentStatusMeta.label}
              </h3>
              <p>{currentStatusMeta.description}</p>
            </div>
          </div>

          <div className="shipping-timeline__meta-grid">
            <div className="shipping-timeline__meta-card">
              <span>Kurir</span>
              <strong>
                {shipment.courierCompany.toUpperCase()} - {shipment.courierType.toUpperCase()}
              </strong>
            </div>
            <div className="shipping-timeline__meta-card">
              <span>Nomor resi</span>
              <strong>{shipment.waybillId ?? "Belum tersedia"}</strong>
            </div>
            <div className="shipping-timeline__meta-card">
              <span>Tracking ID</span>
              <strong>{shipment.trackingId ?? shipment.biteshipOrderId}</strong>
            </div>
          </div>

          <div className="shipping-progress" aria-label="Progress pengiriman">
            <div className="shipping-progress__track">
              <div
                className="shipping-progress__bar"
                style={{
                  width: `${(progress / progressSteps.length) * 100}%`,
                  background: currentStatusMeta.color,
                }}
              />
            </div>
            <div className="shipping-progress__labels">
              {progressSteps.map((label, index) => (
                <span
                  key={label}
                  className={index < progress ? "shipping-progress__label--done" : ""}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {latestHistory && (
          <div className="shipping-timeline__latest">
            <FaMapMarkedAlt />
            <div>
              <span>Update terakhir</span>
              <strong>{latestHistory.note || currentStatusMeta.description}</strong>
              <small>{formatTimelineDate(latestHistory.timestamp)}</small>
            </div>
          </div>
        )}

        <div className="shipping-timeline__section-title">
          <div>
            <FaRoute />
            <span>Riwayat perjalanan</span>
          </div>
          <small>{sortedHistory.length} update</small>
        </div>

        <motion.div
          className="shipping-timeline"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {sortedHistory.map((entry, index) => {
            const entryMeta = getShippingStatusMeta(entry.status);
            const isFirst = index === 0;

            return (
              <motion.div
                className={`shipping-timeline__item ${isFirst ? "shipping-timeline__item--active" : ""}`}
                key={index}
                variants={itemVariants}
              >
                <div
                  className="shipping-timeline__node"
                  style={{ color: entryMeta.color, background: entryMeta.bg }}
                >
                  {isFirst ? <FaClipboardCheck /> : entryMeta.icon}
                </div>
                <div className="shipping-timeline__content">
                  <div className="shipping-timeline__header">
                    <span
                      className="shipping-timeline__status-badge"
                      style={{ color: entryMeta.color, background: entryMeta.bg }}
                    >
                      {entryMeta.label}
                    </span>
                    <span className="shipping-timeline__time">
                      {formatTimelineDate(entry.timestamp)}
                    </span>
                  </div>
                  {entry.note && (
                    <p className="shipping-timeline__note">{entry.note}</p>
                  )}
                  <div className="shipping-timeline__chips">
                    <span>Event #{sortedHistory.length - index}</span>
                    <span>{entry.status}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.section>
  );
}

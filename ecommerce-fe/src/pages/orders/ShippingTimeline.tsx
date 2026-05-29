import { motion } from "framer-motion";
import {
  FaTruck,
  FaCheckCircle,
  FaBoxOpen,
  FaMapMarkerAlt,
  FaTimesCircle,
  FaUndoAlt,
  FaBan,
  FaSearch,
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
  icon: React.ReactNode;
}

function getShippingStatusMeta(status: string): StatusMeta {
  switch (status) {
    case "confirmed":
      return {
        label: "Dikonfirmasi",
        color: "#1565c0",
        bg: "#e3f2fd",
        icon: <FaCheckCircle />,
      };
    case "allocated":
      return {
        label: "Kurir Ditentukan",
        color: "#1565c0",
        bg: "#e3f2fd",
        icon: <FaTruck />,
      };
    case "picking_up":
      return {
        label: "Dalam Penjemputan",
        color: "#e65100",
        bg: "#fff3e0",
        icon: <FaMapMarkerAlt />,
      };
    case "picked":
      return {
        label: "Diambil",
        color: "#e65100",
        bg: "#fff3e0",
        icon: <FaBoxOpen />,
      };
    case "dropping_off":
      return {
        label: "Dalam Pengiriman",
        color: "#4f46e5",
        bg: "#eef2ff",
        icon: <FaTruck />,
      };
    case "delivered":
      return {
        label: "Terkirim",
        color: "#059669",
        bg: "#ecfdf5",
        icon: <FaCheckCircle />,
      };
    case "rejected":
      return {
        label: "Ditolak",
        color: "#c62828",
        bg: "#fce4ec",
        icon: <FaTimesCircle />,
      };
    case "cancelled":
      return {
        label: "Dibatalkan",
        color: "#424242",
        bg: "#f5f5f5",
        icon: <FaBan />,
      };
    case "courier_not_found":
      return {
        label: "Kurir Tidak Ditemukan",
        color: "#c62828",
        bg: "#fce4ec",
        icon: <FaSearch />,
      };
    case "disposed":
      return {
        label: "Dibuang",
        color: "#424242",
        bg: "#f5f5f5",
        icon: <FaTimesCircle />,
      };
    case "returned":
      return {
        label: "Dikembalikan",
        color: "#e65100",
        bg: "#fff3e0",
        icon: <FaUndoAlt />,
      };
    default:
      return {
        label: status,
        color: "#64748b",
        bg: "#f1f5f9",
        icon: <FaTruck />,
      };
  }
}

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
        {/* Current Status */}
        <div className="shipping-timeline__current">
          <span
            className="shipping-timeline__current-badge"
            style={{ color: currentStatusMeta.color, background: currentStatusMeta.bg }}
          >
            {currentStatusMeta.icon}
            <span>{currentStatusMeta.label}</span>
          </span>
          <span className="shipping-timeline__courier">
            {shipment.courierCompany.toUpperCase()} - {shipment.courierType.toUpperCase()}
          </span>
        </div>

        {/* Timeline */}
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
                  style={{ backgroundColor: entryMeta.color }}
                />
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
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.section>
  );
}

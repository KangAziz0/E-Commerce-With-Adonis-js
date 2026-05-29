import { useEffect, useMemo, useState } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiClock,
  FiXCircle,
  FiAlertCircle,
  FiShoppingBag,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import { FaClipboardList } from "react-icons/fa";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { fetchMyOrdersRequest } from "@/features/orders/orderSlice";
import { formatRupiah } from "@/utils/currency";
import type { OrderDetailStatus, OrderListItem } from "@/features/orders/order.types";

import "./OrdersOffcanvas.css";

interface OrdersOffcanvasProps {
  isOpen: boolean;
  onClose: () => void;
}

type FilterTab = "ALL" | OrderDetailStatus;

const FILTER_TABS: FilterTab[] = [
  "ALL",
  "PENDING",
  "PROCESSING",
  "PAID",
  "EXPIRED",
  "FAILED",
  "CANCELLED",
];

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatusProgressIndicator({ status }: { status: OrderDetailStatus }) {
  const steps: OrderDetailStatus[] = ["PENDING", "PROCESSING", "PAID"];
  const terminalStatuses: OrderDetailStatus[] = ["EXPIRED", "FAILED", "CANCELLED"];

  if (terminalStatuses.includes(status)) {
    const icons: Record<string, JSX.Element> = {
      EXPIRED: <FiClock size={12} />,
      FAILED: <FiXCircle size={12} />,
      CANCELLED: <FiXCircle size={12} />,
    };
    return (
      <div className={`order-status-badge order-status-badge--${status}`}>
        {icons[status]}
        <span>{status}</span>
      </div>
    );
  }

  const currentIndex = steps.indexOf(status);

  return (
    <div className="order-status-indicator">
      {steps.map((step, i) => {
        const isCompleted = i < currentIndex;
        const isActive = i === currentIndex;
        const stepClass = isCompleted
          ? "order-status-indicator__step--completed"
          : isActive
          ? "order-status-indicator__step--active"
          : "";

        return (
          <div key={step} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : undefined }}>
            <div className={`order-status-indicator__step ${stepClass}`}>
              <div className="order-status-indicator__dot" />
              <span>{step.charAt(0) + step.slice(1).toLowerCase()}</span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`order-status-indicator__line ${
                  i < currentIndex ? "order-status-indicator__line--done" : ""
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function OrderCard({ order, index }: { order: OrderListItem; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      className={`order-card order-card--${order.status}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <div className="order-card__header">
        <span className="order-card__id" title={order.externalId}>
          {order.externalId}
        </span>
        <span className="order-card__date">{formatDate(order.createdAt)}</span>
      </div>

      <StatusProgressIndicator status={order.status} />

      <div className="order-card__footer">
        <span className="order-card__amount">Rp {formatRupiah(order.amount)}</span>
        <span className="order-card__items-count">
          {order.items.length} item{order.items.length !== 1 ? "s" : ""}
        </span>
      </div>

      <button
        className="order-items-toggle"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        {expanded ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
        {expanded ? "Hide items" : "View items"}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            className="order-items-list"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {order.items.map((item) => (
              <div key={item.id} className="order-items-list__row">
                <span className="order-items-list__name">{item.name}</span>
                <span className="order-items-list__detail">
                  {item.quantity} x Rp {formatRupiah(item.price)}
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function LoadingState() {
  return (
    <div className="orders-loading-state">
      {[0, 1, 2].map((i) => (
        <div key={i} className="orders-skeleton-card">
          <div className="orders-skeleton-line orders-skeleton-line--medium" />
          <div className="orders-skeleton-line orders-skeleton-line--long" />
          <div className="orders-skeleton-line orders-skeleton-line--short" />
        </div>
      ))}
    </div>
  );
}

function EmptyState({ activeFilter }: { activeFilter: FilterTab }) {
  const isFiltered = activeFilter !== "ALL";
  return (
    <div className="orders-empty-state">
      <FiShoppingBag className="orders-empty-state__icon" />
      <div className="orders-empty-state__title">
        {isFiltered ? `No ${activeFilter.toLowerCase()} orders found` : "No orders yet"}
      </div>
      <div className="orders-empty-state__subtitle">
        {isFiltered
          ? "Try selecting a different filter"
          : "Your order history will appear here"}
      </div>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  const dispatch = useAppDispatch();

  return (
    <div className="orders-error-state">
      <FiAlertCircle className="orders-error-state__icon" />
      <div className="orders-error-state__message">{message}</div>
      <button
        className="orders-error-state__btn"
        onClick={() => dispatch(fetchMyOrdersRequest())}
      >
        Try Again
      </button>
    </div>
  );
}

export default function OrdersOffcanvas({ isOpen, onClose }: OrdersOffcanvasProps) {
  const { orders, loading, error } = useAppSelector((state) => state.order.myOrders);
  const [activeFilter, setActiveFilter] = useState<FilterTab>("ALL");

  useEffect(() => {
    if (isOpen) setActiveFilter("ALL");
  }, [isOpen]);

  const statusCounts = useMemo(() => {
    const counts: Record<FilterTab, number> = {
      ALL: orders.length,
      PENDING: 0,
      PROCESSING: 0,
      PAID: 0,
      EXPIRED: 0,
      FAILED: 0,
      CANCELLED: 0,
    };
    for (const order of orders) {
      counts[order.status]++;
    }
    return counts;
  }, [orders]);

  const filteredOrders =
    activeFilter === "ALL"
      ? orders
      : orders.filter((o) => o.status === activeFilter);

  return (
    <Offcanvas
      show={isOpen}
      onHide={onClose}
      placement="end"
      style={{ width: "460px" }}
    >
      <Offcanvas.Header closeButton className="border-bottom">
        <Offcanvas.Title className="fw-semibold">
          <FaClipboardList style={{ fontSize: "20px" }} className="mb-1 me-2" />
          My Orders
        </Offcanvas.Title>
      </Offcanvas.Header>

      <div className="orders-panel">
        {/* Summary stats */}
        {!loading && !error && orders.length > 0 && (
          <div className="orders-header">
            <div className="orders-header__stat">
              <span className="orders-header__stat-dot orders-header__stat-dot--total" />
              {orders.length} total
            </div>
            {statusCounts.PENDING > 0 && (
              <div className="orders-header__stat">
                <span className="orders-header__stat-dot orders-header__stat-dot--pending" />
                {statusCounts.PENDING} pending
              </div>
            )}
            {statusCounts.PAID > 0 && (
              <div className="orders-header__stat">
                <span className="orders-header__stat-dot orders-header__stat-dot--paid" />
                {statusCounts.PAID} paid
              </div>
            )}
          </div>
        )}

        {/* Filter tabs */}
        {!loading && !error && orders.length > 0 && (
          <div className="orders-tabs" role="tablist">
            {FILTER_TABS.map((tab) => {
              const count = statusCounts[tab];
              return (
                <button
                  key={tab}
                  className={`orders-tabs__tab ${
                    activeFilter === tab ? "orders-tabs__tab--active" : ""
                  }`}
                  onClick={() => setActiveFilter(tab)}
                  role="tab"
                  aria-selected={activeFilter === tab}
                >
                  {tab === "ALL" ? "All" : tab.charAt(0) + tab.slice(1).toLowerCase()}
                  {count > 0 && (
                    <span className="orders-tabs__count">{count}</span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} />
        ) : filteredOrders.length === 0 ? (
          <EmptyState activeFilter={activeFilter} />
        ) : (
          <div className="orders-list">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFilter}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {filteredOrders.map((order, index) => (
                  <OrderCard key={order.id} order={order} index={index} />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>
    </Offcanvas>
  );
}

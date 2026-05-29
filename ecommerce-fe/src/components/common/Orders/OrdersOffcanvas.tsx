import { useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import Badge from "react-bootstrap/Badge";
import Offcanvas from "react-bootstrap/Offcanvas";
import Spinner from "react-bootstrap/Spinner";
import { FaClipboardList } from "react-icons/fa";

import { useAppSelector } from "@/hooks/redux";
import { formatRupiah } from "@/utils/currency";
import type { OrderDetailStatus, OrderListItem } from "@/features/orders/order.types";

interface OrdersOffcanvasProps {
  isOpen: boolean;
  onClose: () => void;
}

function getStatusBadgeBg(status: OrderDetailStatus): string {
  switch (status) {
    case "PENDING":
      return "warning";
    case "PAID":
      return "success";
    case "PROCESSING":
      return "info";
    case "EXPIRED":
      return "secondary";
    case "FAILED":
      return "danger";
    case "CANCELLED":
      return "dark";
    default:
      return "secondary";
  }
}

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

function OrderCard({ order, index }: { order: OrderListItem; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border rounded p-3 mb-3" style={{ backgroundColor: "#fafafa" }}>
      <div className="d-flex justify-content-between align-items-start mb-2">
        <span
          className="fw-semibold text-truncate"
          style={{ fontSize: "13px", maxWidth: "200px" }}
          title={order.externalId}
        >
          {order.externalId}
        </span>
        <Badge bg={getStatusBadgeBg(order.status)} className="text-uppercase" style={{ fontSize: "11px" }}>
          {order.status}
        </Badge>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-1">
        <span className="fw-bold" style={{ fontSize: "14px" }}>
          Rp. {formatRupiah(order.amount)}
        </span>
      </div>

      <div className="text-muted mb-2" style={{ fontSize: "12px" }}>
        {formatDate(order.createdAt)}
      </div>

      <Accordion activeKey={expanded ? String(index) : undefined}>
        <Accordion.Item eventKey={String(index)} className="border-0" style={{ backgroundColor: "transparent" }}>
          <Accordion.Header
            onClick={() => setExpanded(!expanded)}
            className="p-0"
            style={{ fontSize: "12px" }}
          >
            Items ({order.items.length})
          </Accordion.Header>
          <Accordion.Body className="px-0 pt-2 pb-0">
            <ul className="list-unstyled mb-0">
              {order.items.map((item) => (
                <li key={item.id} className="d-flex justify-content-between py-1" style={{ fontSize: "12px" }}>
                  <span className="text-truncate" style={{ maxWidth: "200px" }}>
                    {item.name}
                  </span>
                  <span className="text-muted text-nowrap ms-2">
                    {item.quantity} x Rp. {formatRupiah(item.price)}
                  </span>
                </li>
              ))}
            </ul>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}

export default function OrdersOffcanvas({ isOpen, onClose }: OrdersOffcanvasProps) {
  const { orders, loading, error } = useAppSelector((state) => state.order.myOrders);

  return (
    <Offcanvas
      show={isOpen}
      onHide={onClose}
      placement="end"
      style={{ width: "420px" }}
    >
      <Offcanvas.Header closeButton className="border-bottom">
        <Offcanvas.Title className="fw-semibold">
          <FaClipboardList style={{ fontSize: "20px" }} className="mb-1 me-2" />
          My Orders
        </Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body className="p-3 d-flex flex-column">
        {loading ? (
          <div className="d-flex justify-content-center align-items-center flex-grow-1">
            <Spinner animation="border" variant="dark" />
          </div>
        ) : error ? (
          <div className="d-flex justify-content-center align-items-center flex-grow-1">
            <p className="text-danger text-center">{error}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="d-flex justify-content-center align-items-center flex-grow-1">
            <p className="text-muted text-center">You have no orders yet.</p>
          </div>
        ) : (
          <div className="flex-grow-1 overflow-auto">
            {orders.map((order, index) => (
              <OrderCard key={order.id} order={order} index={index} />
            ))}
          </div>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
}

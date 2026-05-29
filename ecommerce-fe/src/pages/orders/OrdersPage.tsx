import { useEffect, useMemo, useState } from "react";
import { Button, Container, Form, Spinner } from "react-bootstrap";
import {
  FaBoxOpen,
  FaCheckCircle,
  FaClipboardList,
  FaClock,
  FaShoppingBag,
  FaTimesCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import type {
  OrderDetailStatus,
  OrderListItem,
} from "@/features/orders/order.types";
import { fetchMyOrdersRequest } from "@/features/orders/orderSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { formatRupiahCurrency } from "@/utils/currency";

import "./OrdersPage.css";

type StatusFilter = "ALL" | OrderDetailStatus;

const statusOptions: { value: StatusFilter; label: string }[] = [
  { value: "ALL", label: "Semua status" },
  { value: "PENDING", label: "Menunggu pembayaran" },
  { value: "PROCESSING", label: "Sedang diproses" },
  { value: "PAID", label: "Lunas" },
  { value: "EXPIRED", label: "Kedaluwarsa" },
  { value: "FAILED", label: "Gagal" },
  { value: "CANCELLED", label: "Dibatalkan" },
];

function getStatusMeta(status: OrderDetailStatus) {
  switch (status) {
    case "PENDING":
      return {
        label: "Menunggu",
        bg: "#fff3d8",
        color: "#8a5a00",
        icon: <FaClock />,
      };
    case "PAID":
      return {
        label: "Lunas",
        bg: "#e8f7ee",
        color: "#247047",
        icon: <FaCheckCircle />,
      };
    case "PROCESSING":
      return {
        label: "Diproses",
        bg: "#e6f1ff",
        color: "#225d9b",
        icon: <FaBoxOpen />,
      };
    case "EXPIRED":
      return {
        label: "Kedaluwarsa",
        bg: "#f0ede8",
        color: "#6d6255",
        icon: <FaClock />,
      };
    case "FAILED":
      return {
        label: "Gagal",
        bg: "#fdecec",
        color: "#a33737",
        icon: <FaTimesCircle />,
      };
    case "CANCELLED":
      return {
        label: "Dibatalkan",
        bg: "#ececec",
        color: "#3f3f3f",
        icon: <FaTimesCircle />,
      };
    default:
      return {
        label: status,
        bg: "#ececec",
        color: "#3f3f3f",
        icon: <FaClipboardList />,
      };
  }
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getItemSummary(order: OrderListItem) {
  const totalQty = order.items.reduce((sum, item) => sum + item.quantity, 0);
  return `${order.items.length} produk / ${totalQty} item`;
}

function OrderCard({ order }: { order: OrderListItem }) {
  const status = getStatusMeta(order.status);

  return (
    <article className="order-card">
      <div className="order-card__top">
        <div>
          <div className="order-id">{order.externalId}</div>
          <div className="order-date">{formatDate(order.createdAt)}</div>
        </div>
        <span
          className="status-pill"
          style={{ background: status.bg, color: status.color }}
        >
          {status.icon}
          {status.label}
        </span>
      </div>

      <div className="order-card__body">
        <div className="order-metric">
          <div className="order-metric__label">Total pembayaran</div>
          <div className="order-metric__value">
            {formatRupiahCurrency(Number(order.amount))}
          </div>
        </div>
        <div className="order-metric">
          <div className="order-metric__label">Isi pesanan</div>
          <div className="order-metric__value">{getItemSummary(order)}</div>
        </div>
      </div>

      <div className="order-items">
        {order.items.map((item) => (
          <div className="order-item" key={item.id}>
            <div>
              <div className="order-item__name">{item.name}</div>
              <div className="order-item__meta">
                {item.quantity} x {formatRupiahCurrency(Number(item.price))}
              </div>
            </div>
            <div className="order-item__price">
              {formatRupiahCurrency(Number(item.price) * item.quantity)}
            </div>
          </div>
        ))}
      </div>
    </article>
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

  return (
    <main className="orders-page py-5">
      <Container className="orders-shell">
        <section className="orders-header mb-4">
          <div>
            <h1 className="orders-title">Pesanan Saya</h1>
            <p className="orders-subtitle">
              Lihat status pembayaran, total transaksi, dan detail produk dari
              semua pesananmu dalam satu tempat.
            </p>
          </div>

          <div className="orders-filter">
            <Form.Label>Status</Form.Label>
            <Form.Select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as StatusFilter)
              }
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Form.Select>
          </div>
        </section>

        <section className="orders-summary mb-4">
          <div className="orders-summary-card">
            <div className="orders-summary-label">Total pesanan</div>
            <div className="orders-summary-value">{orders.length}</div>
          </div>
          <div className="orders-summary-card">
            <div className="orders-summary-label">Pesanan aktif</div>
            <div className="orders-summary-value">{activeOrders}</div>
          </div>
          <div className="orders-summary-card">
            <div className="orders-summary-label">Total lunas</div>
            <div className="orders-summary-value">
              {formatRupiahCurrency(totalSpent)}
            </div>
          </div>
        </section>

        {loading ? (
          <div className="orders-state">
            <Spinner animation="border" variant="dark" />
            <h2>Memuat pesanan</h2>
            <p>Sebentar ya, daftar pesanan sedang diambil.</p>
          </div>
        ) : error ? (
          <div className="orders-state">
            <FaTimesCircle size={34} color="#a33737" />
            <h2>Pesanan belum bisa dimuat</h2>
            <p>{error}</p>
            <Button
              className="mt-3"
              variant="dark"
              onClick={() => dispatch(fetchMyOrdersRequest())}
            >
              Coba lagi
            </Button>
          </div>
        ) : orders.length === 0 ? (
          <div className="orders-state">
            <FaShoppingBag size={38} color="#817b72" />
            <h2>Belum ada pesanan</h2>
            <p>
              Pesanan yang kamu buat akan tampil di sini setelah checkout
              berhasil dibuat.
            </p>
            <Button className="mt-3" variant="dark" onClick={() => navigate("/shop")}>
              Mulai belanja
            </Button>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="orders-state">
            <FaClipboardList size={34} color="#817b72" />
            <h2>Tidak ada pesanan</h2>
            <p>
              Belum ada pesanan dengan filter status yang kamu pilih. Coba ubah
              filter ke status lain.
            </p>
          </div>
        ) : (
          <section className="orders-grid">
            {filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </section>
        )}
      </Container>
    </main>
  );
}

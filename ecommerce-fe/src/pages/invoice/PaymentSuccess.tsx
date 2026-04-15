import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import { fetchOrderRequest } from "@/features/orders/orderSlice";
import { RootState } from "@/store/store";
import { styles } from "./style";
import { clearCart } from "@/features/cart/cardSlice";

export const PaymentSuccess = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { order, status } = useSelector((state: RootState) => state.order);

  const externalId = localStorage.getItem("pending_external_id");

  useEffect(() => {
    if (externalId) dispatch(fetchOrderRequest(externalId));
  }, [externalId, dispatch]);

  useEffect(() => {
    if (order) {
      dispatch(clearCart());
      localStorage.removeItem("pending_external_id");
    }
  }, [order]);

  if (status === "loading") {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f5f4f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ color: "#888", fontSize: 14 }}>
          Mengecek status pembayaran...
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f4f0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem",
      }}
    >
      <Container style={{ maxWidth: 440 }}>
        <div style={styles.card}>
          {/* Icon */}
          <div style={{ ...styles.iconWrap, background: "#f0f7f0" }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="#2a7a2a"
                strokeWidth="1.5"
              />
              <path
                d="M7.5 12.5l3 3 6-6"
                stroke="#2a7a2a"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h1 style={styles.title}>Pembayaran berhasil</h1>
          <p style={styles.sub}>Terima kasih! Pesananmu sedang diproses.</p>

          {/* Badge */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "1.5rem",
            }}
          >
            <span style={styles.badgeSuccess}>
              <span style={{ ...styles.dot, background: "#2a7a2a" }} />
              PAID
            </span>
          </div>

          {/* Items */}
          {order && (
            <div style={styles.itemsBox}>
              {order.items.map((item, i) => (
                <div key={i} style={styles.itemRow}>
                  <div>
                    <div style={styles.itemName}>{item.name}</div>
                    <div style={styles.itemQty}>x{item.quantity}</div>
                  </div>
                  <div style={styles.itemPrice}>
                    Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                  </div>
                </div>
              ))}
              <div style={styles.totalRow}>
                <span style={styles.totalLabel}>Total</span>
                <span style={styles.totalValue}>
                  Rp {order.amount.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          )}

          <hr style={styles.divider} />

          {/* Detail */}
          {order && (
            <>
              <div style={styles.row}>
                <span style={styles.rowLabel}>Order ID</span>
                <span style={styles.rowValue}>{order.externalId}</span>
              </div>
              <div style={styles.row}>
                <span style={styles.rowLabel}>Email</span>
                <span style={styles.rowValue}>{order.email}</span>
              </div>
              <div style={styles.row}>
                <span style={styles.rowLabel}>Status</span>
                <span style={{ ...styles.rowValue, color: "#2a7a2a" }}>
                  Lunas
                </span>
              </div>
            </>
          )}

          <hr style={styles.divider} />

          <button style={styles.btnBlack} onClick={() => navigate("/orders")}>
            Lihat pesanan saya
          </button>
          <button style={styles.btnOutline} onClick={() => navigate("/")}>
            Lanjut belanja
          </button>
        </div>
      </Container>
    </div>
  );
};

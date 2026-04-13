import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import { styles } from "./style";
import { useEffect } from "react";

export const PaymentFailed = () => {
  const navigate = useNavigate();

  const externalId = localStorage.getItem("pending_external_id");

  useEffect(() => {
    return () => {
      localStorage.removeItem("pending_external_id");
    };
  }, []);

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
          <div style={{ ...styles.iconWrap, background: "#fdf2f2" }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="#b93232"
                strokeWidth="1.5"
              />
              <path
                d="M15 9l-6 6M9 9l6 6"
                stroke="#b93232"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <h1 style={styles.title}>Pembayaran gagal</h1>
          <p style={styles.sub}>
            Transaksi tidak berhasil diproses. Silakan coba lagi.
          </p>

          {/* Badge */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "1.5rem",
            }}
          >
            <span style={styles.badgeFailed}>
              <span style={{ ...styles.dot, background: "#b93232" }} />
              FAILED
            </span>
          </div>

          <hr style={styles.divider} />

          <div style={styles.row}>
            <span style={styles.rowLabel}>Order ID</span>
            <span style={styles.rowValue}>{externalId ?? "-"}</span>
          </div>
          <div style={styles.row}>
            <span style={styles.rowLabel}>Status</span>
            <span style={{ ...styles.rowValue, color: "#b93232" }}>Gagal</span>
          </div>

          <hr style={styles.divider} />

          <button style={styles.btnBlack} onClick={() => navigate(-1)}>
            Coba lagi
          </button>
          <button style={styles.btnOutline} onClick={() => navigate("/cart")}>
            Kembali ke keranjang
          </button>
        </div>
      </Container>
    </div>
  );
};

import { useEffect } from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { CHECKOUT_STORAGE_KEYS } from "@/constants/checkout";
import { resetCheckout } from "@/features/checkout/checkoutSlice";
import { fetchOrderRequest } from "@/features/orders/orderSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { formatRupiah } from "@/utils/currency";

import { styles } from "./styles";

export const PaymentFailed = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { order, status, error } = useAppSelector((state) => state.order);
  const externalId = localStorage.getItem(
    CHECKOUT_STORAGE_KEYS.pendingExternalId,
  );
  const latestPayment = order?.payments?.[order.payments.length - 1];
  const isExpired =
    order?.status === "EXPIRED" || latestPayment?.status === "EXPIRED";
  const title = isExpired ? "Pembayaran kedaluwarsa" : "Pembayaran gagal";
  const description = isExpired
    ? "Waktu pembayaran sudah habis. Kamu bisa membuat pesanan baru untuk mendapatkan QR pembayaran yang baru."
    : "Transaksi tidak berhasil diproses. Silakan coba lagi dari halaman checkout.";
  const statusText = isExpired ? "EXPIRED" : "FAILED";
  const statusLabel = isExpired ? "Kedaluwarsa" : "Gagal";
  const shouldShowFallback = !order && status !== "loading";

  useEffect(() => {
    if (externalId) dispatch(fetchOrderRequest(externalId));
  }, [externalId, dispatch]);

  useEffect(
    () => () => {
      dispatch(resetCheckout());
      localStorage.removeItem(CHECKOUT_STORAGE_KEYS.pendingExternalId);
      localStorage.removeItem(CHECKOUT_STORAGE_KEYS.pendingPaymentId);
    },
    [dispatch],
  );

  return (
    <div style={styles.page}>
      <Container style={{ maxWidth: 520 }}>
        <div style={styles.card}>
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

          <h1 style={styles.title}>{title}</h1>
          <p style={styles.sub}>{description}</p>

          <div style={styles.badgeRow}>
            <span style={styles.badgeFailed}>
              <span style={{ ...styles.dot, background: "#b93232" }} />
              {statusText}
            </span>
          </div>

          <div
            style={{
              ...styles.statusPanel,
              background: isExpired ? "#3b2f1b" : "#3a1f1f",
            }}
          >
            <div style={styles.statusKicker}>Status transaksi</div>
            <div style={styles.statusTitle}>
              {isExpired
                ? "QR pembayaran sudah tidak aktif"
                : "Pembayaran belum berhasil"}
            </div>
            <p style={styles.statusText}>
              {isExpired
                ? "Kamu tidak akan dikenakan biaya untuk QR yang sudah kedaluwarsa. Buat pembayaran baru dari checkout."
                : "Belum ada pembayaran berhasil untuk transaksi ini. Kamu bisa kembali ke keranjang dan mencoba lagi."}
            </p>
          </div>

          {status === "loading" && (
            <div style={styles.noticeBox}>Memuat detail pesanan...</div>
          )}

          {shouldShowFallback && (
            <>
              <div style={styles.noticeBox}>
                Detail pesanan belum tersedia di halaman ini. Tidak apa-apa,
                kamu tetap bisa melanjutkan dari keranjang atau mengulang
                checkout untuk membuat pembayaran baru.
              </div>
              <ul style={styles.fallbackList}>
                <li style={styles.fallbackItem}>
                  <span
                    style={{
                      ...styles.fallbackBullet,
                      background: "#b93232",
                    }}
                  />
                  Pastikan belum ada notifikasi sukses dari aplikasi pembayaran.
                </li>
                <li style={styles.fallbackItem}>
                  <span
                    style={{
                      ...styles.fallbackBullet,
                      background: "#b93232",
                    }}
                  />
                  Kalau saldo terpotong, jangan buat pembayaran berulang dulu.
                  Cek riwayat transaksi atau hubungi admin.
                </li>
                <li style={styles.fallbackItem}>
                  <span
                    style={{
                      ...styles.fallbackBullet,
                      background: "#b93232",
                    }}
                  />
                  Jika belum terpotong, kamu bisa kembali ke keranjang dan
                  mencoba pembayaran baru.
                </li>
              </ul>
            </>
          )}

          {status === "failed" && !shouldShowFallback && (
            <div style={styles.noticeBox}>
              {error ?? "Detail pesanan belum bisa dimuat saat ini."}
            </div>
          )}

          {order && (
            <div style={styles.itemsBox}>
              {order.items.map((item) => (
                <div key={item.id} style={styles.itemRow}>
                  <div>
                    <div style={styles.itemName}>{item.name}</div>
                    <div style={styles.itemQty}>x{item.quantity}</div>
                  </div>
                  <div style={styles.itemPrice}>
                    Rp {formatRupiah(Number(item.price) * item.quantity)}
                  </div>
                </div>
              ))}
              <div style={styles.totalRow}>
                <span style={styles.totalLabel}>Total</span>
                <span style={styles.totalValue}>
                  Rp {formatRupiah(Number(order.amount))}
                </span>
              </div>
            </div>
          )}

          <hr style={styles.divider} />

          <div style={styles.row}>
            <span style={styles.rowLabel}>Order ID</span>
            <span style={styles.rowValue}>
              {order?.externalId ?? externalId ?? "-"}
            </span>
          </div>
          <div style={styles.row}>
            <span style={styles.rowLabel}>Email</span>
            <span style={styles.rowValue}>{order?.email ?? "-"}</span>
          </div>
          <div style={styles.row}>
            <span style={styles.rowLabel}>Status</span>
            <span style={{ ...styles.rowValue, color: "#b93232" }}>
              {statusLabel}
            </span>
          </div>
          <div style={styles.row}>
            <span style={styles.rowLabel}>Metode</span>
            <span style={styles.rowValue}>
              {latestPayment?.paymentMethod ?? "QRIS"}
            </span>
          </div>
          <div style={styles.row}>
            <span style={styles.rowLabel}>Batas pembayaran</span>
            <span style={styles.rowValue}>
              {latestPayment?.expiryDate
                ? new Date(latestPayment.expiryDate).toLocaleString("id-ID")
                : "-"}
            </span>
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

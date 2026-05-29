import { useEffect } from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { CHECKOUT_STORAGE_KEYS } from "@/constants/checkout";
import { clearCartRequest } from "@/features/cart/cartSlice";
import { resetCheckout } from "@/features/checkout/checkoutSlice";
import { fetchOrderRequest } from "@/features/orders/orderSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { formatRupiah } from "@/utils/currency";

import { styles } from "./styles";

export const PaymentSuccess = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { order, status, error } = useAppSelector((state) => state.order);

  const externalId = localStorage.getItem(
    CHECKOUT_STORAGE_KEYS.pendingExternalId,
  );
  const latestPayment = order?.payments?.[order.payments.length - 1];
  const paidAt = latestPayment?.paidAt ?? order?.paidAt;
  const statusLabel =
    order?.status === "PROCESSING" ? "Sedang Diproses" : "Lunas";
  const shouldShowFallback = !order && status !== "loading";

  useEffect(() => {
    if (externalId) dispatch(fetchOrderRequest(externalId));
  }, [externalId, dispatch]);

  useEffect(() => {
    if (order) {
      dispatch(clearCartRequest());
      dispatch(resetCheckout());
      localStorage.removeItem(CHECKOUT_STORAGE_KEYS.pendingExternalId);
      localStorage.removeItem(CHECKOUT_STORAGE_KEYS.pendingPaymentId);
    }
  }, [order, dispatch]);

  if (status === "loading") {
    return (
      <div style={styles.page}>
        <Container style={{ maxWidth: 520 }}>
          <div style={styles.card}>
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
            <h1 style={styles.title}>Mengecek pembayaran</h1>
            <p style={styles.sub}>
              Sebentar ya, kami sedang mengambil ringkasan pesananmu.
            </p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <Container style={{ maxWidth: 520 }}>
        <div style={styles.card}>
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
          <p style={styles.sub}>
            Terima kasih! Pembayaran sudah diterima dan pesananmu masuk ke
            antrean proses.
          </p>

          <div style={styles.badgeRow}>
            <span style={styles.badgeSuccess}>
              <span style={{ ...styles.dot, background: "#2a7a2a" }} />
              {statusLabel}
            </span>
          </div>

          <div style={styles.statusPanel}>
            <div style={styles.statusKicker}>Status transaksi</div>
            <div style={styles.statusTitle}>Pembayaran diterima</div>
            <p style={styles.statusText}>
              Pesanan akan diproses oleh toko. Kalau detail pesanan belum
              muncul, sistem biasanya masih menyinkronkan data pembayaran.
            </p>
          </div>

          {shouldShowFallback && (
            <>
              <div style={styles.noticeBox}>
                Kami belum bisa menampilkan detail pesanan di halaman ini.
                Tenang, pembayaran yang berhasil tetap tercatat dan bisa dicek
                melalui akun atau email yang kamu gunakan saat checkout.
              </div>
              <ul style={styles.fallbackList}>
                <li style={styles.fallbackItem}>
                  <span
                    style={{
                      ...styles.fallbackBullet,
                      background: "#2a7a2a",
                    }}
                  />
                  Simpan halaman ini atau screenshot sebagai catatan sementara.
                </li>
                <li style={styles.fallbackItem}>
                  <span
                    style={{
                      ...styles.fallbackBullet,
                      background: "#2a7a2a",
                    }}
                  />
                  Cek kembali menu akun setelah beberapa saat untuk melihat
                  update pesanan.
                </li>
                <li style={styles.fallbackItem}>
                  <span
                    style={{
                      ...styles.fallbackBullet,
                      background: "#2a7a2a",
                    }}
                  />
                  Jika saldo sudah terpotong tetapi status belum muncul, hubungi
                  admin dengan email akun dan waktu pembayaran.
                </li>
              </ul>
            </>
          )}

          {status === "failed" && (
            <div style={styles.noticeBox}>
              {error ?? "Detail pesanan belum bisa dimuat saat ini."}
            </div>
          )}

          {order && (
            <div style={styles.itemsBox}>
              {order.items.map((item, i) => (
                <div key={i} style={styles.itemRow}>
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

          {order && (
            <>
              <hr style={styles.divider} />
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
                <span style={styles.rowLabel}>Payment ID</span>
                <span style={styles.rowValue}>
                  {latestPayment?.externalReferenceId ?? "-"}
                </span>
              </div>
              <div style={styles.row}>
                <span style={styles.rowLabel}>Dibayar pada</span>
                <span style={styles.rowValue}>
                  {paidAt ? new Date(paidAt).toLocaleString("id-ID") : "-"}
                </span>
              </div>
            </>
          )}

          <hr style={styles.divider} />

          <button style={styles.btnBlack} onClick={() => navigate("/")}>
            Lanjut belanja
          </button>
          <button style={styles.btnOutline} onClick={() => navigate("/profile")}>
            Lihat akun saya
          </button>
        </div>
      </Container>
    </div>
  );
};

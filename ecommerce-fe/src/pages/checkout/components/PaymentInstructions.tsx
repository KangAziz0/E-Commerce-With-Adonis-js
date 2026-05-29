import { useEffect, useState } from "react";
import { Alert, Badge, Spinner } from "react-bootstrap";
import { QRCodeSVG } from "qrcode.react";

import type {
  PaymentResponse,
  PaymentStatus,
} from "@/features/checkout/checkout.types";

interface PaymentInstructionsProps {
  payment: PaymentResponse;
  polling: boolean;
}

function useCountdown(expiryDate: string | null) {
  const [remaining, setRemaining] = useState("");

  useEffect(() => {
    if (!expiryDate) {
      setRemaining("");
      return;
    }

    const calcRemaining = () => {
      const diff = new Date(expiryDate).getTime() - Date.now();
      if (diff <= 0) {
        setRemaining("Kedaluwarsa");
        return;
      }
      const hours = Math.floor(diff / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      if (hours > 0) {
        setRemaining(`${hours}j ${mins}m ${secs}d`);
      } else {
        setRemaining(`${mins}m ${secs}d`);
      }
    };

    calcRemaining();
    const timer = setInterval(calcRemaining, 1000);
    return () => clearInterval(timer);
  }, [expiryDate]);

  return remaining;
}

function getStatusBadge(status: PaymentStatus) {
  switch (status) {
    case "PAID":
      return <Badge bg="success">LUNAS</Badge>;
    case "EXPIRED":
      return <Badge bg="secondary">KEDALUWARSA</Badge>;
    case "FAILED":
      return <Badge bg="danger">GAGAL</Badge>;
    case "PROCESSING":
      return <Badge bg="info">DIPROSES</Badge>;
    default:
      return <Badge bg="warning">MENUNGGU</Badge>;
  }
}

export default function PaymentInstructions({
  payment,
  polling,
}: PaymentInstructionsProps) {
  const countdown = useCountdown(payment.expiryDate);

  return (
    <div className="text-center">
      <h5 className="mb-3">Scan QR Code untuk Bayar</h5>

      {payment.qrString && (
        <div className="d-inline-block p-4 bg-white rounded-3 shadow-sm mb-3">
          <QRCodeSVG value={payment.qrString} size={220} />
        </div>
      )}

      <div className="mb-2">
        <span className="fs-5 fw-bold">
          Rp {payment.amount.toLocaleString("id-ID")}
        </span>
      </div>

      {countdown && (
        <p className="text-muted small mb-3">Berlaku: {countdown}</p>
      )}

      <div className="mb-3">{getStatusBadge(payment.status)}</div>

      {polling && payment.status === "PENDING" && (
        <Alert variant="light" className="d-inline-flex align-items-center gap-2 mb-0">
          <Spinner animation="border" size="sm" />
          <span>Menunggu pembayaran...</span>
        </Alert>
      )}

      {payment.status === "PAID" && (
        <Alert variant="success" className="mb-0">
          Pembayaran berhasil! Mengalihkan...
        </Alert>
      )}

      {payment.status === "EXPIRED" && (
        <Alert variant="warning" className="mb-0">
          Pembayaran telah kedaluwarsa. Silakan buat pesanan baru.
        </Alert>
      )}

      {payment.status === "FAILED" && (
        <Alert variant="danger" className="mb-0">
          Pembayaran gagal. Silakan coba lagi.
        </Alert>
      )}
    </div>
  );
}

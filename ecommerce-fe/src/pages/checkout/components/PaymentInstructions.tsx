import { useEffect, useState } from "react";
import { Alert, Badge, Button, Card, Spinner } from "react-bootstrap";
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

  const handleCopyVA = () => {
    if (payment.vaNumber) {
      navigator.clipboard.writeText(payment.vaNumber);
    }
  };

  const renderQRIS = () => (
    <div className="text-center">
      <h5 className="mb-3">Scan QR Code untuk Bayar</h5>
      {payment.qrString && (
        <div className="d-inline-block p-3 bg-white border rounded mb-3">
          <QRCodeSVG value={payment.qrString} size={220} />
        </div>
      )}
      <div className="mb-2">
        <strong>Total: Rp {payment.amount.toLocaleString("id-ID")}</strong>
      </div>
      {countdown && (
        <div className="text-muted mb-2">
          Berlaku: {countdown}
        </div>
      )}
    </div>
  );

  const renderVirtualAccount = () => (
    <div>
      <h5 className="mb-3">Transfer Virtual Account</h5>
      <Card className="mb-3">
        <Card.Body>
          <div className="mb-2">
            <small className="text-muted">Bank</small>
            <div className="fw-bold">{payment.paymentChannel}</div>
          </div>
          <div className="mb-2">
            <small className="text-muted">Nomor Virtual Account</small>
            <div className="d-flex align-items-center gap-2">
              <span
                className="fw-bold fs-5"
                style={{ letterSpacing: "1px" }}
              >
                {payment.vaNumber}
              </span>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={handleCopyVA}
              >
                Salin
              </Button>
            </div>
          </div>
          <div className="mb-2">
            <small className="text-muted">Total Pembayaran</small>
            <div className="fw-bold">
              Rp {payment.amount.toLocaleString("id-ID")}
            </div>
          </div>
          {countdown && (
            <div>
              <small className="text-muted">Bayar sebelum</small>
              <div className="text-danger fw-bold">{countdown}</div>
            </div>
          )}
        </Card.Body>
      </Card>
      <Card>
        <Card.Body>
          <h6>Cara Pembayaran:</h6>
          <ol className="mb-0 ps-3">
            <li>Buka aplikasi mobile banking atau ATM</li>
            <li>Pilih menu Transfer / Virtual Account</li>
            <li>Masukkan nomor Virtual Account di atas</li>
            <li>Pastikan jumlah transfer sesuai</li>
            <li>Konfirmasi dan selesaikan pembayaran</li>
          </ol>
        </Card.Body>
      </Card>
    </div>
  );

  const renderEWallet = () => (
    <div className="text-center">
      <h5 className="mb-3">Pembayaran E-Wallet</h5>
      <p className="text-muted mb-3">
        Klik tombol di bawah untuk membuka aplikasi {payment.paymentChannel}
      </p>
      <div className="mb-3">
        <strong>Total: Rp {payment.amount.toLocaleString("id-ID")}</strong>
      </div>
      {payment.ewalletUrl && (
        <Button
          variant="primary"
          size="lg"
          href={payment.ewalletUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-3"
        >
          Buka {payment.paymentChannel}
        </Button>
      )}
      {countdown && (
        <div className="text-muted mb-2">
          Berlaku: {countdown}
        </div>
      )}
    </div>
  );

  const renderPaymentContent = () => {
    switch (payment.paymentMethod) {
      case "QRIS":
        return renderQRIS();
      case "VIRTUAL_ACCOUNT":
        return renderVirtualAccount();
      case "EWALLET":
        return renderEWallet();
      default:
        return null;
    }
  };

  return (
    <div>
      {renderPaymentContent()}

      <div className="text-center mt-3">
        {getStatusBadge(payment.status)}
      </div>

      {polling && payment.status === "PENDING" && (
        <Alert variant="light" className="text-center mt-3 mb-0">
          <Spinner animation="border" size="sm" className="me-2" />
          Menunggu pembayaran...
        </Alert>
      )}

      {payment.status === "PAID" && (
        <Alert variant="success" className="text-center mt-3 mb-0">
          Pembayaran berhasil! Mengalihkan...
        </Alert>
      )}

      {payment.status === "EXPIRED" && (
        <Alert variant="warning" className="text-center mt-3 mb-0">
          Pembayaran telah kedaluwarsa. Silakan buat pesanan baru.
        </Alert>
      )}

      {payment.status === "FAILED" && (
        <Alert variant="danger" className="text-center mt-3 mb-0">
          Pembayaran gagal. Silakan coba lagi.
        </Alert>
      )}
    </div>
  );
}

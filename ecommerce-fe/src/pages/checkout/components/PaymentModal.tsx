import { useEffect } from "react";
import { Badge, Button, Modal, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import type { PaymentStatus } from "@/features/checkout/checkout.types";

interface PaymentModalProps {
  show: boolean;
  invoiceUrl: string;
  externalId: string;
  amount: number;
  paymentStatus: PaymentStatus | null;
  polling: boolean;
  onClose: () => void;
}

export default function PaymentModal({
  show,
  invoiceUrl,
  externalId,
  amount,
  paymentStatus,
  polling,
  onClose,
}: PaymentModalProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (paymentStatus === "PAID") {
      const timer = setTimeout(() => {
        navigate("/payment/success");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [paymentStatus, navigate]);

  const handleOpenInvoice = () => {
    window.open(invoiceUrl, "_blank");
  };

  const renderContent = () => {
    if (paymentStatus === "PAID") {
      return (
        <div className="text-center py-4">
          <div className="mb-3">
            <Badge bg="success" className="fs-5 px-3 py-2">
              Pembayaran Berhasil!
            </Badge>
          </div>
          <p className="text-muted">Mengalihkan ke halaman sukses...</p>
        </div>
      );
    }

    if (paymentStatus === "EXPIRED") {
      return (
        <div className="text-center py-4">
          <div className="mb-3">
            <Badge bg="warning" className="fs-5 px-3 py-2">
              Invoice Kedaluwarsa
            </Badge>
          </div>
          <p className="text-muted">
            Invoice pembayaran telah kedaluwarsa. Silakan buat pesanan baru.
          </p>
          <Button variant="outline-primary" onClick={onClose}>
            Kembali
          </Button>
        </div>
      );
    }

    if (paymentStatus === "FAILED") {
      return (
        <div className="text-center py-4">
          <div className="mb-3">
            <Badge bg="danger" className="fs-5 px-3 py-2">
              Pembayaran Gagal
            </Badge>
          </div>
          <p className="text-muted">
            Pembayaran gagal diproses. Silakan coba lagi.
          </p>
          <Button variant="outline-primary" onClick={onClose}>
            Kembali
          </Button>
        </div>
      );
    }

    // Default: PENDING / PROCESSING / polling
    return (
      <div className="text-center py-4">
        <Spinner animation="border" variant="primary" className="mb-3" />
        <h5>Menunggu Pembayaran...</h5>
        <p className="text-muted mb-3">
          Silakan selesaikan pembayaran di tab yang terbuka.
        </p>
        <div className="mb-3">
          <small className="text-muted d-block">Order ID: {externalId}</small>
          <small className="text-muted d-block">
            Total: Rp {amount.toLocaleString("id-ID")}
          </small>
        </div>
        <Button variant="primary" onClick={handleOpenInvoice}>
          Bayar Sekarang
        </Button>
      </div>
    );
  };

  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Status Pembayaran</Modal.Title>
      </Modal.Header>
      <Modal.Body>{renderContent()}</Modal.Body>
      {polling && (
        <Modal.Footer className="justify-content-center">
          <small className="text-muted">
            <Spinner animation="grow" size="sm" className="me-1" />
            Memeriksa status pembayaran...
          </small>
        </Modal.Footer>
      )}
    </Modal>
  );
}

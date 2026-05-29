import { Spinner } from "react-bootstrap";
import { BsQrCode } from "react-icons/bs";

import type {
  PaymentChannel,
  PaymentMethod,
} from "@/features/checkout/checkout.types";

interface PaymentMethodSelectorProps {
  onSelect: (method: PaymentMethod, channel?: PaymentChannel) => void;
  selectedMethod: PaymentMethod | null;
  selectedChannel: PaymentChannel | null;
  loading: boolean;
}

export default function PaymentMethodSelector({
  onSelect,
  loading,
}: PaymentMethodSelectorProps) {
  // Auto-select QRIS immediately
  if (!loading) {
    onSelect("QRIS");
  }

  return (
    <div className="text-center py-4">
      <BsQrCode size={48} className="text-success mb-3" />
      <h5 className="mb-2">Menyiapkan Pembayaran QRIS</h5>
      <p className="text-muted mb-0">Mohon tunggu sebentar...</p>
      {loading && <Spinner animation="border" size="sm" className="mt-3" />}
    </div>
  );
}

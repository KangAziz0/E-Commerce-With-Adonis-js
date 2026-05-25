import { useState } from "react";
import { Button, Card, Form, Spinner } from "react-bootstrap";
import { BsQrCode, BsBank, BsWallet2 } from "react-icons/bs";

import { PAYMENT_METHODS } from "@/constants/checkout";
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
  selectedMethod,
  selectedChannel,
  loading,
}: PaymentMethodSelectorProps) {
  const [localMethod, setLocalMethod] = useState<PaymentMethod | null>(
    selectedMethod
  );
  const [localChannel, setLocalChannel] = useState<PaymentChannel | null>(
    selectedChannel
  );

  const handleMethodChange = (method: PaymentMethod, channel?: string) => {
    setLocalMethod(method);
    setLocalChannel((channel as PaymentChannel) ?? null);
  };

  const handleSubmit = () => {
    if (!localMethod) return;
    onSelect(localMethod, localChannel ?? undefined);
  };

  const canSubmit =
    localMethod === "QRIS" ||
    (localMethod === "VIRTUAL_ACCOUNT" && localChannel) ||
    (localMethod === "EWALLET" && localChannel);

  return (
    <div>
      <h5 className="mb-3">Pilih Metode Pembayaran</h5>

      {/* QRIS */}
      <Card className="mb-3">
        <Card.Body>
          <Form.Check
            type="radio"
            id="method-qris"
            name="paymentMethod"
            label={
              <span className="d-flex align-items-center gap-2">
                <BsQrCode size={20} />
                <span>
                  <strong>{PAYMENT_METHODS.QRIS.label}</strong>
                  <br />
                  <small className="text-muted">
                    {PAYMENT_METHODS.QRIS.description}
                  </small>
                </span>
              </span>
            }
            checked={localMethod === "QRIS"}
            onChange={() => handleMethodChange("QRIS")}
          />
        </Card.Body>
      </Card>

      {/* Virtual Account */}
      <Card className="mb-3">
        <Card.Body>
          <div className="d-flex align-items-center gap-2 mb-2">
            <BsBank size={20} />
            <strong>{PAYMENT_METHODS.VIRTUAL_ACCOUNT.label}</strong>
          </div>
          {PAYMENT_METHODS.VIRTUAL_ACCOUNT.channels.map((ch) => (
            <Form.Check
              key={ch.code}
              type="radio"
              id={`method-va-${ch.code}`}
              name="paymentMethod"
              label={ch.label}
              className="ms-4 mb-1"
              checked={
                localMethod === "VIRTUAL_ACCOUNT" && localChannel === ch.code
              }
              onChange={() =>
                handleMethodChange("VIRTUAL_ACCOUNT", ch.code)
              }
            />
          ))}
        </Card.Body>
      </Card>

      {/* E-Wallet */}
      <Card className="mb-3">
        <Card.Body>
          <div className="d-flex align-items-center gap-2 mb-2">
            <BsWallet2 size={20} />
            <strong>{PAYMENT_METHODS.EWALLET.label}</strong>
          </div>
          {PAYMENT_METHODS.EWALLET.channels.map((ch) => (
            <Form.Check
              key={ch.code}
              type="radio"
              id={`method-ew-${ch.code}`}
              name="paymentMethod"
              label={ch.label}
              className="ms-4 mb-1"
              checked={
                localMethod === "EWALLET" && localChannel === ch.code
              }
              onChange={() => handleMethodChange("EWALLET", ch.code)}
            />
          ))}
        </Card.Body>
      </Card>

      <Button
        variant="dark"
        className="w-100 py-2"
        onClick={handleSubmit}
        disabled={!canSubmit || loading}
      >
        {loading ? (
          <>
            <Spinner size="sm" className="me-2" />
            Memproses...
          </>
        ) : (
          "Bayar"
        )}
      </Button>
    </div>
  );
}

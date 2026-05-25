/**
 * Comma-separated list of supported couriers passed to the shipping-rates API.
 */
export const SUPPORTED_COURIERS =
  "jne,jnt,sicepat,anteraja,grab,gojek,lion,tiki" as const;

export const CHECKOUT_STORAGE_KEYS = {
  pendingExternalId: "pending_external_id",
  pendingPaymentId: "pending_payment_id",
} as const;

/** Interval (ms) between payment status polling requests. */
export const PAYMENT_POLL_INTERVAL = 3000;

export const PAYMENT_METHODS = {
  QRIS: { label: "QRIS", description: "Scan QR untuk bayar" },
  VIRTUAL_ACCOUNT: {
    label: "Transfer Virtual Account",
    channels: [
      { code: "BCA", label: "BCA Virtual Account" },
      { code: "BNI", label: "BNI Virtual Account" },
      { code: "BRI", label: "BRI Virtual Account" },
      { code: "MANDIRI", label: "Mandiri Virtual Account" },
    ],
  },
  EWALLET: {
    label: "E-Wallet",
    channels: [
      { code: "OVO", label: "OVO" },
      { code: "DANA", label: "DANA" },
      { code: "GOPAY", label: "GoPay" },
      { code: "SHOPEEPAY", label: "ShopeePay" },
    ],
  },
} as const;

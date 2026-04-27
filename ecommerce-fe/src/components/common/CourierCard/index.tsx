// components/CourierCard.tsx
import { Badge, Card } from "react-bootstrap";

type CourierCode =
  | "jne"
  | "jnt"
  | "sicepat"
  | "anteraja"
  | "tiki"
  | "grab"
  | "gojek"
  | "lion";

export interface CourierRate {
  // Courier identity
  courier_code: CourierCode;
  courier_name: string;
  courier_service_code: string;
  courier_service_name: string;
  type?: string;
  company?: string;

  // Pricing
  currency?: string;
  price: number;
  price_formatted?: string;
  shipping_fee?: number;
  shipping_fee_discount?: number;
  shipping_fee_surcharge?: number;
  insurance_fee?: number;
  cash_on_delivery_fee?: number;

  tax_lines?: unknown[];

  // Duration
  duration?: string;
  shipment_duration_range?: string;
  shipment_duration_unit?: string;
  description?: string;

  // Service info
  service_type?: string;
  shipping_type?: string;

  // Features
  available_collection_method: string[];
  available_for_cash_on_delivery?: boolean;
  available_for_proof_of_delivery?: boolean;
  available_for_instant_waybill_id?: boolean;
  available_for_insurance?: boolean;
}

interface CourierCardProps {
  rate: CourierRate;
  selected: boolean;
  onSelect: (rate: CourierRate) => void;
}

// Mapping logo kurir
const COURIER_LOGOS: Partial<Record<CourierCode, string>> = {
  jne: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/JNE_logo.svg/320px-JNE_logo.svg.png",
  jnt: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/J%26T_Express_logo.svg/320px-J%26T_Express_logo.svg.png",
  sicepat:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/SiCepat_logo.svg/320px-SiCepat_logo.svg.png",
  anteraja:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/AnterAja_Logo.svg/320px-AnterAja_Logo.svg.png",
  tiki: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Tiki_logo.svg/320px-Tiki_logo.svg.png",
};

const COURIER_COLORS: Record<CourierCode, string> = {
  jne: "#e8001c",
  jnt: "#cc0001",
  sicepat: "#f05a28",
  anteraja: "#002060",
  grab: "#00b14f",
  gojek: "#00880a",
  tiki: "#003580",
  lion: "#c8102e",
};

export default function CourierCard({
  rate,
  selected,
  onSelect,
}: CourierCardProps) {
  const logo = COURIER_LOGOS[rate.courier_code];
  const accentColor = COURIER_COLORS[rate.courier_code] ?? "#6c757d";

  return (
    <Card
      className={`courier-card h-100 ${selected ? "courier-card--selected" : ""}`}
      style={{
        cursor: "pointer",
        border: selected ? `2px solid ${accentColor}` : "1px solid #dee2e6",
        transition: "all 0.2s ease",
        borderRadius: 12,
        boxShadow: selected
          ? `0 4px 20px ${accentColor}30`
          : "0 1px 4px rgba(0,0,0,0.06)",
      }}
      onClick={() => onSelect(rate)}
    >
      <Card.Body className="p-3">
        {/* Header */}
        <div className="d-flex align-items-center gap-2 mb-2">
          {logo ? (
            <img
              src={logo}
              alt={rate.courier_name}
              style={{ width: 48, height: 24, objectFit: "contain" }}
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div
              className="d-flex align-items-center justify-content-center rounded"
              style={{
                width: 48,
                height: 24,
                background: accentColor,
                fontSize: 9,
                fontWeight: 700,
                color: "#fff",
                letterSpacing: 0.5,
              }}
            >
              {rate.courier_code.toUpperCase()}
            </div>
          )}

          <div className="flex-grow-1 ms-1">
            <div style={{ fontSize: 13, fontWeight: 600 }}>
              {rate.courier_name}
            </div>
            <div style={{ fontSize: 11, color: "#868e96" }}>
              {rate.courier_service_name}
            </div>
          </div>

          {selected && (
            <div
              className="d-flex align-items-center justify-content-center rounded-circle"
              style={{
                width: 20,
                height: 20,
                background: accentColor,
              }}
            >
              <svg width="10" height="10" viewBox="0 0 10 10">
                <path
                  d="M2 5l2 2 4-4"
                  stroke="#fff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Estimasi & Harga */}
        <div className="d-flex justify-content-between mt-2">
          <div>
            <small className="text-muted">Estimasi</small>
            <br />
            <Badge bg="light" text="dark">
              {rate.duration ??
                `${rate.shipment_duration_range ?? ""} ${
                  rate.shipment_duration_unit ?? ""
                }`}
            </Badge>
          </div>

          <div className="text-end">
            <small className="text-muted">Ongkir</small>
            <div style={{ fontWeight: 700, color: accentColor }}>
              {rate.price_formatted ??
                `Rp ${rate.price.toLocaleString("id-ID")}`}
            </div>
          </div>
        </div>

        {/* Description */}
        {rate.description && (
          <div className="mt-2 text-muted" style={{ fontSize: 11 }}>
            {rate.description}
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

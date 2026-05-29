import type { CourierCode, CourierRate } from "@/features/checkout/checkout.types";

// Re-export so existing imports `from "@/components/common/CourierCard"` keep
// working. New code should import the types from `@/features/checkout/checkout.types`.
export type { CourierCode, CourierRate };

interface CourierCardProps {
  rate: CourierRate;
  selected: boolean;
  onSelect: (rate: CourierRate) => void;
}

export default function CourierCard({
  rate,
  selected,
  onSelect,
}: CourierCardProps) {
  return (
    <div
      className={`courier-row ${selected ? "courier-row--selected" : ""}`}
      onClick={() => onSelect(rate)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onSelect(rate);
      }}
    >
      <div className="courier-row__radio">
        <div className={`courier-radio ${selected ? "courier-radio--active" : ""}`} />
      </div>

      <div className="courier-row__info">
        <span className="courier-row__name">{rate.courier_name}</span>
        <span className="courier-row__service">{rate.courier_service_name}</span>
      </div>

      <div className="courier-row__duration">
        {rate.duration ??
          `${rate.shipment_duration_range ?? ""} ${rate.shipment_duration_unit ?? ""}`.trim()}
      </div>

      <div className="courier-row__price">
        Rp {rate.price.toLocaleString("id-ID")}
      </div>
    </div>
  );
}

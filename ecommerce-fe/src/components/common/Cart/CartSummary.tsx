import Card from "react-bootstrap/Card";

import type { CartItem } from "@/features/cart/cart.types";
import { formatRupiah } from "@/utils/currency";

// TODO: replace this with a real currency-conversion service when prices are
// no longer stored in USD on the FE.
const USD_TO_IDR = 16300;

interface CartSummaryProps {
  cart: CartItem[];
}

export default function CartSummary({ cart }: CartSummaryProps) {
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalWeight = cart.reduce(
    (acc, item) => acc + item.weight * item.quantity,
    0,
  );
  const subtotal =
    cart.reduce((acc, item) => acc + item.price * item.quantity, 0) *
    USD_TO_IDR;

  return (
    <Card className="checkout-section mb-3">
      <Card.Body>
        <div className="section-label">Ringkasan pesanan</div>

        {cart.map((item, idx) => (
          <div
            key={item.id}
            className={`item-row ${idx < cart.length - 1 ? "item-row--bordered" : ""}`}
          >
            <img src={item.image} alt={item.name} className="item-img" />
            <div className="item-info">
              <div className="item-name">{item.name}</div>
              <div className="item-meta">
                Ukuran {item.size} · {item.weight}g/pcs
              </div>
              <div className="mt-1 d-flex gap-1 align-items-center">
                <span style={{ fontSize: 11, color: "#6c757d" }}>
                  × {item.quantity} pcs
                </span>
              </div>
            </div>
            <div className="item-price-col">
              <div className="item-unit-price">{formatRupiah(item.price)}</div>
              <div className="item-total-price">
                {formatRupiah(item.price * item.quantity)}
              </div>
            </div>
          </div>
        ))}

        <div className="cart-footer">
          <span className="text-muted" style={{ fontSize: 12 }}>
            {totalItems} item · Berat total {totalWeight}g
          </span>
          <div style={{ fontSize: 14 }}>
            Subtotal: <strong style={{ color: "#198754" }}>{subtotal}</strong>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

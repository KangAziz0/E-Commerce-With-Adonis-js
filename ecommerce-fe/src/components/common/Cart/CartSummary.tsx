import { CartItem } from "@/features/cart/cartSlice";
import { formatRupiah } from "@/utils/currency";
import Card from "react-bootstrap/Card";

const USD_TO_IDR = 16300;

type CartSummaryProps = {
  cart: CartItem[];
};

export default function CartSummary({ cart }: CartSummaryProps) {
  const totalItems = cart.reduce((a, i) => a + i.quantity, 0);
  const totalWeight = cart.reduce((a, i) => a + i.weight * i.quantity, 0);
  const subtotal =
    cart.reduce((a, i) => a + i.price * i.quantity, 0) * USD_TO_IDR;

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

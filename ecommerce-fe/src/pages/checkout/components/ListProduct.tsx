import { useAppSelector } from "@/hooks/redux";
import { formatRupiah } from "@/utils/currency";

const ListProduct = () => {
  const cart = useAppSelector((state) => state.cart.items);

  if (cart.length === 0) {
    return <p className="text-muted text-center small my-3">Keranjang kosong.</p>;
  }

  return (
    <div className="overflow-auto pe-1" style={{ maxHeight: "280px" }}>
      <ul className="list-unstyled mb-0">
        {cart.map((item) => (
          <li
            key={`${item.id}-${item.size}-${item.color}`}
            className="d-flex gap-3 py-2"
          >
            <img
              src={item.image}
              alt={item.name}
              className="rounded-3 object-fit-cover flex-shrink-0"
              style={{ width: 48, height: 48 }}
            />
            <div className="flex-grow-1 min-w-0">
              <p className="mb-0 small fw-semibold text-truncate">
                {item.name}
              </p>
              <p className="mb-0 text-muted" style={{ fontSize: "0.75rem" }}>
                {item.quantity} x Rp {formatRupiah(item.price)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListProduct;

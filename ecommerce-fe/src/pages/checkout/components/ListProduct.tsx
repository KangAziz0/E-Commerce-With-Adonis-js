import { useAppSelector } from "@/hooks/redux";
import { formatRupiah } from "@/utils/currency";

const ListProduct = () => {
  const cart = useAppSelector((state) => state.cart.items);

  return (
    <div
      className="flex-grow-1 overflow-auto pe-2"
      style={{ maxHeight: "400px" }}
    >
      {cart.length === 0 ? (
        <p className="text-muted text-center mt-4">Your Product is Empty.</p>
      ) : (
        <ul className="list-unstyled d-flex flex-column gap-3">
          {cart.map((item) => (
            <li
              key={`${item.id}-${item.size}-${item.color}`}
              className="d-flex gap-3 pb-3 border-bottom"
            >
              <img
                src={item.image}
                alt={item.name}
                className="rounded object-fit-cover flex-shrink-0"
                style={{ width: 64, height: 64 }}
              />
              <div className="flex-grow-1 d-flex flex-column justify-content-between">
                <div>
                  <h6 className="mb-1 fw-semibold text-dark">{item.name}</h6>
                  <small className="text-muted d-block mb-2">
                    {item.size}
                    {item.color}
                  </small>
                  <p className="mb-0 fw-bold text-dark">
                    {item.quantity} x Rp {formatRupiah(item.price)}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ListProduct;

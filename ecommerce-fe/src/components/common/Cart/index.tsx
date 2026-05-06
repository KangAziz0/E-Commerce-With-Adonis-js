import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { useMemo } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import Button from "react-bootstrap/Button";
import { addToCart, decreaseQty } from "@/features/cart/cartSlice";
import { FaShoppingCart } from "react-icons/fa";
import { openModalLogin } from "@/features/auth/authSlice";
import { createInvoiceRequest } from "@/features/orders/orderSlice";
import { useNavigate } from "react-router-dom";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CartOffcanvas({ isOpen, onClose }: Props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state: RootState) => state.cart.items);
  const user = useSelector((state: RootState) => state.auth.user);

  const totalPrice = useMemo(() => {
    return cart.reduce((t, item) => t + item.price * item.quantity, 0);
  }, [cart]);

  const handleCheckout = () => {
    if (user) {
      navigate("/checkout");
      onClose();
      // dispatch(createInvoiceRequest({ items: cart, email: user.email ?? "" }));
    } else {
      dispatch(openModalLogin());
    }
  };

  console.log("cart", cart);

  return (
    <Offcanvas
      show={isOpen}
      onHide={onClose}
      placement="end"
      style={{ width: "380px" }}
    >
      {/* Header */}
      <Offcanvas.Header closeButton className="border-bottom">
        <Offcanvas.Title className="fw-semibold">
          <FaShoppingCart style={{ fontSize: "20px" }} className="mb-1" /> Your
          Cart
        </Offcanvas.Title>
      </Offcanvas.Header>

      {/* Body */}
      <Offcanvas.Body className="p-3 d-flex flex-column">
        <div className="flex-grow-1 overflow-auto">
          {cart.length === 0 ? (
            <p className="text-muted text-center mt-4">Your cart is empty.</p>
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
                    {/* Product Info */}
                    <div>
                      <h6 className="mb-1 fw-semibold text-dark">
                        {item.name}
                      </h6>

                      <small className="text-muted d-block mb-2">
                        {item.size}
                        {item.color}
                      </small>

                      <p className="mb-0 fw-bold text-dark">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>

                    {/* Qty Controls */}
                    <div className="d-flex align-items-center justify-content-between mt-3">
                      <div className="d-flex align-items-center gap-2">
                        <Button
                          variant="outline-dark"
                          size="sm"
                          className="rounded-circle d-flex align-items-center justify-content-center"
                          style={{ width: "28px", height: "28px", padding: 0 }}
                          onClick={() => dispatch(decreaseQty({ id: item.id }))}
                        >
                          −
                        </Button>

                        <span
                          className="fw-medium"
                          style={{ minWidth: "20px", textAlign: "center" }}
                        >
                          {item.quantity}
                        </span>

                        <Button
                          variant="outline-dark"
                          size="sm"
                          className="rounded-circle d-flex align-items-center justify-content-center"
                          style={{ width: "28px", height: "28px", padding: 0 }}
                          onClick={() => dispatch(addToCart(item))}
                        >
                          +
                        </Button>
                      </div>

                      {/* Subtotal */}
                      <div className="fw-semibold text-dark">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="border-top pt-3 mt-3">
          <div className="d-flex justify-content-between fw-semibold mb-3">
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <Button variant="dark" className="w-100" onClick={handleCheckout}>
            Checkout
          </Button>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
}

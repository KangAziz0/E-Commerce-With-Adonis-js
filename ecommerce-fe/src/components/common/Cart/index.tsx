import { useMemo } from "react";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { openModalLogin } from "@/features/auth/authSlice";
import {
  addToCartRequest,
  decreaseQtyRequest,
  removeFromCartRequest,
} from "@/features/cart/cartSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { formatRupiah } from "@/utils/currency";

interface CartOffcanvasProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartOffcanvas({ isOpen, onClose }: CartOffcanvasProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const cart = useAppSelector((state) => state.cart.items);
  const user = useAppSelector((state) => state.auth.user);

  const totalPrice = useMemo(
    () => cart.reduce((total, item) => total + item.price * item.quantity, 0),
    [cart],
  );

  const handleCheckout = () => {
    if (!user) {
      dispatch(openModalLogin());
      return;
    }
    onClose();
    navigate("/checkout");
  };

  console.log("cart", cart);

  return (
    <Offcanvas
      show={isOpen}
      onHide={onClose}
      placement="end"
      style={{ width: "380px" }}
    >
      <Offcanvas.Header closeButton className="border-bottom">
        <Offcanvas.Title className="fw-semibold">
          <FaShoppingCart style={{ fontSize: "20px" }} className="mb-1" /> Your
          Cart
        </Offcanvas.Title>
      </Offcanvas.Header>

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
                    <div>
                      <h6 className="mb-1 fw-semibold text-dark">
                        {item.name}
                      </h6>
                      <small className="text-muted d-block mb-2">
                        {item.size}
                        {item.color}
                      </small>
                      <p className="mb-0 fw-bold text-dark">
                        Rp. {formatRupiah(item.price)}
                      </p>
                    </div>

                    <div className="d-flex align-items-center justify-content-between mt-3">
                      <div className="d-flex align-items-center gap-2">
                        <Button
                          variant="outline-dark"
                          size="sm"
                          className="rounded-circle d-flex align-items-center justify-content-center"
                          style={{ width: "28px", height: "28px", padding: 0 }}
                          onClick={() =>
                            dispatch(decreaseQtyRequest({ id: item.id }))
                          }
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
                          onClick={() =>
                            dispatch(
                              addToCartRequest({
                                ...item,
                                productId: item.productId,
                                quantity: 1,
                              }),
                            )
                          }
                        >
                          +
                        </Button>
                      </div>

                      <div className="fw-semibold text-dark">
                        Rp. {formatRupiah(item.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-top pt-3 mt-3">
          <div className="d-flex justify-content-between fw-semibold mb-3">
            <span>Total</span>
            <span>Rp. {formatRupiah(totalPrice)}</span>
          </div>
          <Button variant="dark" className="w-100" onClick={handleCheckout}>
            Checkout
          </Button>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
}

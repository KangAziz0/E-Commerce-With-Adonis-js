import { Outlet } from "react-router-dom";

import CartOffcanvas from "@/components/common/Cart";
import LoginModal from "@/components/common/Modal/LoginModal";
import OrdersOffcanvas from "@/components/common/Orders/OrdersOffcanvas";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { closeModalLogin } from "@/features/auth/authSlice";
import { closeCart } from "@/features/cart/cartSlice";
import { closeMyOrders } from "@/features/orders/orderSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";

export default function MainLayout() {
  const dispatch = useAppDispatch();
  const isCartOpen = useAppSelector((state) => state.cart.isCartOpen);
  const isModalLoginOpen = useAppSelector((state) => state.auth.isLoginOpen);
  const isMyOrdersOpen = useAppSelector((state) => state.order.myOrders.isOpen);

  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
      <CartOffcanvas
        isOpen={isCartOpen}
        onClose={() => dispatch(closeCart())}
      />
      <OrdersOffcanvas
        isOpen={isMyOrdersOpen}
        onClose={() => dispatch(closeMyOrders())}
      />
      <LoginModal
        show={isModalLoginOpen}
        onHide={() => dispatch(closeModalLogin())}
      />
    </>
  );
}

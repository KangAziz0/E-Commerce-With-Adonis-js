import CartOffcanvas from "@/components/common/Cart";
import LoginModal from "@/components/common/Modal/LoginModal";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { closeModalLogin } from "@/features/auth/authSlice";
import { closeCart } from "@/features/cart/cartSlice";
import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  const dispatch = useDispatch();
  const isCartOpen = useSelector((state: RootState) => state.cart.isCartOpen);
  const isModalLoginOpen = useSelector(
    (state: RootState) => state.auth.isLoginOpen,
  );
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
      <CartOffcanvas
        isOpen={isCartOpen}
        onClose={() => dispatch(closeCart())}
      />
      <LoginModal
        show={isModalLoginOpen}
        onHide={() => dispatch(closeModalLogin())}
      />
    </>
  );
}

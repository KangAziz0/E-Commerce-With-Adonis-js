import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ScrollToTop from "@/components/common/ScrollToTop";
import AdminLayout from "@/components/layout/AdminLayout";
import MainLayout from "@/components/layout/MainLayout";
import { fetchMeRequest } from "@/features/auth/authSlice";
import { fetchWishlistRequest } from "@/features/wishlist/wishlistSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import VerifyOtp from "@/pages/auth/VerifyOtp";
import CheckoutPage from "@/pages/checkout/CheckoutPage";
import { PaymentFailed } from "@/pages/invoice/PaymentFailed";
import { PaymentSuccess } from "@/pages/invoice/PaymentSuccess";
import NotFound from "@/pages/NotFound";
import Home from "@/pages/shop/Home";
import ProductDetail from "@/pages/shop/ProductDetail";
import ShopPage from "@/pages/shop/Product";
import ProfilePage from "@/pages/user/Profile/ProfilePage";
import WishlistPage from "@/pages/wishlist/WishlistPage";
import { AdminRoute } from "@/routes/AdminRoute";
import { GuestRoute } from "@/routes/GuestRoute";
import { PrivateRoute } from "@/routes/PrivateRoute";

function App() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const loginOtpSent = useAppSelector((state) => state.auth.login.otpSent);
  const registerOtpSent = useAppSelector(
    (state) => state.auth.register.otpSent,
  );
  const otpSent = loginOtpSent || registerOtpSent;

  useEffect(() => {
    dispatch(fetchMeRequest());
  }, [dispatch]);

  useEffect(() => {
    if (user) dispatch(fetchWishlistRequest());
  }, [dispatch, user]);

  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <ScrollToTop />

      <Routes>
        <Route element={<MainLayout />}>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductDetail />} />

          {/* Guest only */}
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/verify-otp"
              element={
                otpSent ? <VerifyOtp /> : <Navigate to="/login" replace />
              }
            />
          </Route>

          {/* Authenticated user */}
          <Route element={<PrivateRoute />}>
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/payment/failed" element={<PaymentFailed />} />
          </Route>
        </Route>

        {/* Admin (placeholder layout — child routes to be added later) */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

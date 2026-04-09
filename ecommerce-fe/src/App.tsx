import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Home from "./pages/shop/Home";
import Register from "./pages/auth/Register";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MainLayout from "./layout/MainLayout";
import { PrivateRoute } from "./routes/PrivateRoutes";
import { AdminRoute } from "./routes/AdminRoutes";
import Cart from "./pages/user/Cart";
import Checkout from "./pages/user/Checkout";
import Orders from "./pages/user/Orders";
import AdminLayout from "./layout/AdminLayout";
import NotFound from "./pages/NotFound";
import VerifyOtp from "./pages/auth/VerifyOtp";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store/store";
import { useEffect } from "react";
import { GuestRoute } from "./routes/GuestRoutes";
import ProfilePage from "./pages/user/Profile/Index";
import { fetchMeRequest } from "./features/auth/authSlice";
import ShopPage from "./pages/shop/Product";
import ScrollToTop from "./utils/ScrollToTop";
import ProductDetail from "./pages/shop/ProductDetail";

function App() {
  const { otpSent: loginOtpSent } = useSelector(
    (state: RootState) => state.auth.login,
  );

  const { otpSent: registerOtpSent } = useSelector(
    (state: RootState) => state.auth.register,
  );

  const otpSent = loginOtpSent || registerOtpSent;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMeRequest());
  }, []);

  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <ScrollToTop />

      <Routes>
        <Route element={<MainLayout />}>
          {/* ===== PUBLIC (siapa saja bisa akses) ===== */}
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductDetail />} />

          {/* ===== GUEST ONLY (hanya yang belum login) ===== */}
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

          {/* ===== PRIVATE USER ===== */}
          <Route element={<PrivateRoute />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* ===== ADMIN ===== */}
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}></Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/public/Login";
import Home from "./pages/public/Home";
import Register from "./pages/public/Register";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MainLayout from "./layout/MainLayout";
import { PrivateRoute } from "./routes/PrivateRoutes";
import { AdminRoute } from "./routes/AdminRoutes";
import Cart from "./pages/user/Cart";
import Checkout from "./pages/user/Checkout";
import Orders from "./pages/user/Orders";
import AdminLayout from "./layout/AdminLayout";
import Dashboard from "./pages/admin/dashboard/Dashboard";
import ProductsCMS from "./pages/admin/products/ProductsCMS";
import CategoriesCMS from "./pages/admin/categories/CategoriesCMS";
import NotFound from "./pages/NotFound";
import VerifyOtp from "./pages/public/VerifyOtp";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store/store";
import { useEffect } from "react";
import { GuestRoute } from "./routes/GuestRoutes";
import ProfilePage from "./pages/user/Profile/Index";
import { fetchMeRequest } from "./features/auth/authSlice";

function App() {
  const { otpSent: loginOtpSent } = useSelector(
    (state: RootState) => state.auth.login
  );

  const { otpSent: registerOtpSent } = useSelector(
    (state: RootState) => state.auth.register
  );

  const otpSent = loginOtpSent || registerOtpSent;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMeRequest());
  }, []);

  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />

          {/* ===== GUEST ONLY ===== */}
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/verify-otp"
              element={
                otpSent ? <VerifyOtp /> : <Navigate to="/login" replace />
              }
            />{" "}
          </Route>

          {/* ===== PRIVATE USER ===== */}
          <Route element={<PrivateRoute />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* ===== ADMIN USER ===== */}
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/cms" element={<Dashboard />} />
            <Route path="/cms/products" element={<ProductsCMS />} />
            <Route path="/cms/categories" element={<CategoriesCMS />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

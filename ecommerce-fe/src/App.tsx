import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Spinner } from "react-bootstrap";
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

/* ─── Admin Pages (lazy loaded) ─── */
const AdminDashboard = lazy(() => import("@/pages/admin/DashboardPage"));
const AdminCategories = lazy(() => import("@/pages/admin/categories/CategoryListPage"));
const AdminProducts = lazy(() => import("@/pages/admin/products/ProductListPage"));
const AdminProductForm = lazy(() => import("@/pages/admin/products/ProductFormPage"));
const AdminBrands = lazy(() => import("@/pages/admin/brands/BrandListPage"));

const PageLoader = () => (
  <div className="d-flex justify-content-center align-items-center py-5">
    <Spinner animation="border" variant="success" />
  </div>
);

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
        {/* ═══════════════ Public Storefront ═══════════════ */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/products/:id" element={<ProductDetail />} />

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

        {/* ═══════════════ Admin Panel ═══════════════ */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route
              index
              element={
                <Suspense fallback={<PageLoader />}>
                  <AdminDashboard />
                </Suspense>
              }
            />
            {/* Master Data - Categories */}
            <Route
              path="categories"
              element={
                <Suspense fallback={<PageLoader />}>
                  <AdminCategories />
                </Suspense>
              }
            />
            {/* Master Data - Products */}
            <Route
              path="products"
              element={
                <Suspense fallback={<PageLoader />}>
                  <AdminProducts />
                </Suspense>
              }
            />
            <Route
              path="products/create"
              element={
                <Suspense fallback={<PageLoader />}>
                  <AdminProductForm />
                </Suspense>
              }
            />
            <Route
              path="products/:id/edit"
              element={
                <Suspense fallback={<PageLoader />}>
                  <AdminProductForm />
                </Suspense>
              }
            />
            {/* Master Data - Brands */}
            <Route
              path="brands"
              element={
                <Suspense fallback={<PageLoader />}>
                  <AdminBrands />
                </Suspense>
              }
            />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

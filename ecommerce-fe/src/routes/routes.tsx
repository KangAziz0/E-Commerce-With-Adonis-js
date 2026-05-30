import { ReactNode, Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Spinner } from "react-bootstrap";

import AdminLayout from "@/components/layout/AdminLayout";
import MainLayout from "@/components/layout/MainLayout";
import { useAppSelector } from "@/hooks/redux";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import VerifyOtp from "@/pages/auth/VerifyOtp";
import CheckoutPage from "@/pages/checkout/CheckoutPage";
import { PaymentFailed } from "@/pages/invoice/PaymentFailed";
import { PaymentSuccess } from "@/pages/invoice/PaymentSuccess";
import NotFound from "@/pages/NotFound";
import OrderDetailPage from "@/pages/orders/OrderDetailPage";
import OrdersPage from "@/pages/orders/OrdersPage";
import Home from "@/pages/shop/Home";
import ProductDetail from "@/pages/shop/ProductDetail";
import ShopPage from "@/pages/shop/Product";
import ProfilePage from "@/pages/user/Profile/ProfilePage";
import WishlistPage from "@/pages/wishlist/WishlistPage";

const AdminDashboard = lazy(() => import("@/pages/admin/DashboardPage"));
const AdminCategories = lazy(() => import("@/pages/admin/categories/CategoryListPage"));
const AdminProducts = lazy(() => import("@/pages/admin/products/ProductListPage"));
const AdminProductForm = lazy(() => import("@/pages/admin/products/ProductFormPage"));
const AdminBrands = lazy(() => import("@/pages/admin/brands/BrandListPage"));
const AdminOrderList = lazy(() => import("@/pages/admin/orders/OrderListPage"));
const AdminOrderDetail = lazy(() => import("@/pages/admin/orders/OrderDetailPage"));
const AdminCustomerList = lazy(() => import("@/pages/admin/customers/CustomerListPage"));
const AdminCustomerDetail = lazy(() => import("@/pages/admin/customers/CustomerDetailPage"));
const AdminTransactions = lazy(() => import("@/pages/admin/transactions/TransactionListPage"));
const AdminShipping = lazy(() => import("@/pages/admin/shipping/ShippingListPage"));
const AdminInventory = lazy(() => import("@/pages/admin/inventory/InventoryListPage"));
const AdminInvoiceList = lazy(() => import("@/pages/admin/invoices/InvoiceListPage"));
const AdminInvoiceDetail = lazy(() => import("@/pages/admin/invoices/InvoiceDetailPage"));
const AdminAnalytics = lazy(() => import("@/pages/admin/analytics/AnalyticsPage"));

const PageLoader = () => (
  <div className="d-flex justify-content-center align-items-center py-5">
    <Spinner animation="border" variant="success" />
  </div>
);

const withPageLoader = (element: ReactNode) => (
  <Suspense fallback={<PageLoader />}>{element}</Suspense>
);

type GuardMode = "guest" | "private" | "admin";

type AuthGuardProps = {
  mode: GuardMode;
  children: ReactNode;
};

function AuthGuard({ mode, children }: AuthGuardProps) {
  const { initialized, user } = useAppSelector((state) => state.auth);

  if (!initialized) return <PageLoader />;

  if (mode === "guest") return user ? <Navigate to="/" replace /> : <>{children}</>;
  if (mode === "admin") return user?.is_admin ? <>{children}</> : <Navigate to="/login" replace />;

  return user ? <>{children}</> : <Navigate to="/login" replace />;
}

type AppRoutesProps = {
  otpSent: boolean;
};

export default function AppRoutes({ otpSent }: AppRoutesProps) {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/products/:id" element={<ProductDetail />} />

        <Route
          path="/login"
          element={
            <AuthGuard mode="guest">
              <Login />
            </AuthGuard>
          }
        />
        <Route
          path="/register"
          element={
            <AuthGuard mode="guest">
              <Register />
            </AuthGuard>
          }
        />
        <Route
          path="/verify-otp"
          element={
            <AuthGuard mode="guest">
              {otpSent ? <VerifyOtp /> : <Navigate to="/login" replace />}
            </AuthGuard>
          }
        />

        <Route
          path="/checkout"
          element={
            <AuthGuard mode="private">
              <CheckoutPage />
            </AuthGuard>
          }
        />
        <Route
          path="/profile"
          element={
            <AuthGuard mode="private">
              <ProfilePage />
            </AuthGuard>
          }
        />
        <Route
          path="/wishlist"
          element={
            <AuthGuard mode="private">
              <WishlistPage />
            </AuthGuard>
          }
        />
        <Route
          path="/orders"
          element={
            <AuthGuard mode="private">
              <OrdersPage />
            </AuthGuard>
          }
        />
        <Route
          path="/orders/:externalId"
          element={
            <AuthGuard mode="private">
              <OrderDetailPage />
            </AuthGuard>
          }
        />
        <Route
          path="/payment/success"
          element={
            <AuthGuard mode="private">
              <PaymentSuccess />
            </AuthGuard>
          }
        />
        <Route
          path="/payment/failed"
          element={
            <AuthGuard mode="private">
              <PaymentFailed />
            </AuthGuard>
          }
        />
      </Route>

      <Route
        path="/admin"
        element={
          <AuthGuard mode="admin">
            <AdminLayout />
          </AuthGuard>
        }
      >
        <Route index element={withPageLoader(<AdminDashboard />)} />
        <Route path="analytics" element={withPageLoader(<AdminAnalytics />)} />
        <Route path="categories" element={withPageLoader(<AdminCategories />)} />
        <Route path="products" element={withPageLoader(<AdminProducts />)} />
        <Route path="products/create" element={withPageLoader(<AdminProductForm />)} />
        <Route path="products/:id/edit" element={withPageLoader(<AdminProductForm />)} />
        <Route path="brands" element={withPageLoader(<AdminBrands />)} />
        <Route path="orders" element={withPageLoader(<AdminOrderList />)} />
        <Route path="orders/:id" element={withPageLoader(<AdminOrderDetail />)} />
        <Route path="customers" element={withPageLoader(<AdminCustomerList />)} />
        <Route path="customers/:id" element={withPageLoader(<AdminCustomerDetail />)} />
        <Route path="transactions" element={withPageLoader(<AdminTransactions />)} />
        <Route path="shipping" element={withPageLoader(<AdminShipping />)} />
        <Route path="inventory" element={withPageLoader(<AdminInventory />)} />
        <Route path="invoices" element={withPageLoader(<AdminInvoiceList />)} />
        <Route path="invoices/:id" element={withPageLoader(<AdminInvoiceDetail />)} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

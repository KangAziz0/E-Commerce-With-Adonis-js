import { Navigate, Outlet } from "react-router-dom";
import { Spinner } from "react-bootstrap";

import { useAppSelector } from "@/hooks/redux";

const FullPageSpinner = () => (
  <div
    className="vh-100 d-flex justify-content-center align-items-center"
    style={{ backgroundColor: "#fff" }}
  >
    <Spinner animation="border" variant="success" />
  </div>
);

export function AdminRoute() {
  const { user, initialized } = useAppSelector((state) => state.auth);

  if (!initialized) return <FullPageSpinner />;

  return user?.is_admin ? <Outlet /> : <Navigate to="/login" replace />;
}

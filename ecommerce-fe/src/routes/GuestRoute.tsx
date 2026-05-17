import { Navigate, Outlet } from "react-router-dom";
import { Spinner } from "react-bootstrap";

import { useAppSelector } from "@/hooks/redux";

const FullPageSpinner = () => (
  <div className="vh-100 d-flex justify-content-center align-items-center">
    <Spinner animation="border" variant="success" />
  </div>
);

export function GuestRoute() {
  const { user, initialized } = useAppSelector((state) => state.auth);

  if (!initialized) return <FullPageSpinner />;

  return user ? <Navigate to="/" replace /> : <Outlet />;
}

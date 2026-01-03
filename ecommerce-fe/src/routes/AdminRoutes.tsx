import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Navigate, Outlet } from "react-router-dom";
import { Spinner } from "react-bootstrap";

export function AdminRoute() {
  const { user, initialized } = useSelector((state: RootState) => state.auth);

  if (!initialized) {
    return (
      <div
        className="vh-100 d-flex justify-content-center align-items-center"
        style={{ backgroundColor: "#fff" }}
      >
        <Spinner animation="border" variant="success" />
      </div>
    );
  }

  return user?.is_admin ? <Outlet /> : <Navigate to="/login" replace />;
}

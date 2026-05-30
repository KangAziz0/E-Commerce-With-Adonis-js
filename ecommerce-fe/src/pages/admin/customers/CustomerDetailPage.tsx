import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Row, Col, Badge, Button, Spinner, Table } from "react-bootstrap";
import { FiArrowLeft } from "react-icons/fi";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { fetchCustomerDetail, toggleCustomerActive } from "@/features/admin/adminSlice";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(value);

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { detail: customer, detailLoading } = useAppSelector((state) => state.admin.customers);
  const { actionLoading } = useAppSelector((state) => state.admin);

  useEffect(() => {
    if (id) dispatch(fetchCustomerDetail(Number(id)));
  }, [dispatch, id]);

  if (detailLoading || !customer) {
    return (
      <div className="d-flex justify-content-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div>
      <Button
        variant="link"
        className="mb-3 p-0 text-decoration-none"
        onClick={() => navigate("/admin/customers")}
      >
        <FiArrowLeft className="me-1" /> Kembali ke Daftar Pelanggan
      </Button>

      <Row className="g-3 mb-4">
        <Col lg={4}>
          <Card className="border-0 h-100" style={{ borderRadius: 14, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <Card.Body className="p-4 text-center">
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                style={{ width: 64, height: 64, background: "#e2e8f0", color: "#475569", fontSize: "1.5rem", fontWeight: 700 }}
              >
                {customer.fullName?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <h6 className="fw-bold mb-1">{customer.fullName}</h6>
              <p className="text-muted mb-2" style={{ fontSize: "0.85rem" }}>{customer.email}</p>
              <Badge bg={customer.isActive ? "success" : "secondary"}>
                {customer.isActive ? "Aktif" : "Nonaktif"}
              </Badge>
              <div className="mt-3">
                <Button
                  size="sm"
                  variant={customer.isActive ? "outline-danger" : "outline-success"}
                  onClick={() => dispatch(toggleCustomerActive(customer.id))}
                  disabled={actionLoading}
                >
                  {customer.isActive ? "Nonaktifkan" : "Aktifkan"}
                </Button>
              </div>
              <div className="mt-3 text-start" style={{ fontSize: "0.85rem" }}>
                <p className="mb-1"><strong>Terdaftar:</strong> {new Date(customer.createdAt).toLocaleDateString("id-ID")}</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={8}>
          <Card className="border-0 h-100" style={{ borderRadius: 14, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <Card.Body className="p-4">
              <h6 className="fw-bold mb-3">Riwayat Pesanan</h6>
              {customer.orders && customer.orders.length > 0 ? (
                <Table responsive hover size="sm" style={{ fontSize: "0.85rem" }}>
                  <thead>
                    <tr style={{ background: "#f8fafc" }}>
                      <th>ID</th>
                      <th>External ID</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Tanggal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customer.orders.map((order) => (
                      <tr
                        key={order.id}
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate(`/admin/orders/${order.id}`)}
                      >
                        <td>{order.id}</td>
                        <td>{order.externalId || "-"}</td>
                        <td>{formatCurrency(order.amount)}</td>
                        <td>
                          <Badge
                            bg={
                              order.status === "PAID" ? "success" :
                              order.status === "PENDING" ? "warning" :
                              order.status === "CANCELLED" ? "danger" : "info"
                            }
                          >
                            {order.status}
                          </Badge>
                        </td>
                        <td>{new Date(order.createdAt).toLocaleDateString("id-ID")}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p className="text-muted mb-0">Belum ada pesanan.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

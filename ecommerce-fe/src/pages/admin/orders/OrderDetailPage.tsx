import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Row, Col, Badge, Button, Spinner, Table, Form, InputGroup } from "react-bootstrap";
import { FiArrowLeft } from "react-icons/fi";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  fetchOrderDetail,
  updateOrderStatus,
  refreshPayment,
  retryShipment,
  updateTracking,
} from "@/features/admin/adminSlice";
import ConfirmActionModal from "@/components/common/Modal/ConfirmActionModal";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(value);

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { detail: order, detailLoading } = useAppSelector((state) => state.admin.orders);
  const { actionLoading } = useAppSelector((state) => state.admin);

  const [showCancel, setShowCancel] = useState(false);
  const [trackingInput, setTrackingInput] = useState("");

  useEffect(() => {
    if (id) dispatch(fetchOrderDetail(Number(id)));
  }, [dispatch, id]);

  if (detailLoading || !order) {
    return (
      <div className="d-flex justify-content-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  const handleMarkProcessed = () => {
    dispatch(updateOrderStatus({ id: order.id, status: "PROCESSING" }));
  };

  const handleCancel = () => {
    dispatch(updateOrderStatus({ id: order.id, status: "CANCELLED" }));
    setShowCancel(false);
  };

  const handleRefreshPayment = () => {
    dispatch(refreshPayment(order.id));
  };

  const handleRetryShipment = () => {
    dispatch(retryShipment(order.id));
  };

  const handleUpdateTracking = () => {
    if (trackingInput.trim()) {
      dispatch(updateTracking({ id: order.id, trackingId: trackingInput.trim() }));
      setTrackingInput("");
    }
  };

  return (
    <div>
      <Button
        variant="link"
        className="mb-3 p-0 text-decoration-none"
        onClick={() => navigate("/admin/orders")}
      >
        <FiArrowLeft className="me-1" /> Kembali ke Daftar Pesanan
      </Button>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1" style={{ color: "#0f172a" }}>
            Detail Pesanan #{order.externalId || order.id}
          </h4>
          <p className="text-muted mb-0" style={{ fontSize: "0.85rem" }}>
            Dibuat: {new Date(order.createdAt).toLocaleString("id-ID")}
          </p>
        </div>
        <Badge
          bg={
            order.status === "PAID"
              ? "success"
              : order.status === "PENDING"
                ? "warning"
                : order.status === "CANCELLED"
                  ? "danger"
                  : "info"
          }
          style={{ fontSize: "0.85rem" }}
        >
          {order.status}
        </Badge>
      </div>

      <Row className="g-3 mb-4">
        <Col lg={6}>
          <Card className="border-0 h-100" style={{ borderRadius: 14, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <Card.Body className="p-4">
              <h6 className="fw-bold mb-3">Info Pelanggan</h6>
              <p className="mb-1"><strong>Email:</strong> {order.email}</p>
              <p className="mb-1"><strong>Total:</strong> {formatCurrency(order.amount)}</p>
              <p className="mb-0"><strong>Status:</strong> {order.status}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6}>
          <Card className="border-0 h-100" style={{ borderRadius: 14, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <Card.Body className="p-4">
              <h6 className="fw-bold mb-3">Aksi</h6>
              <div className="d-flex flex-wrap gap-2">
                {order.status === "PAID" && (
                  <Button size="sm" variant="primary" onClick={handleMarkProcessed} disabled={actionLoading}>
                    Mark Processed
                  </Button>
                )}
                {order.status !== "CANCELLED" && order.status !== "DELIVERED" && (
                  <Button size="sm" variant="danger" onClick={() => setShowCancel(true)} disabled={actionLoading}>
                    Cancel Order
                  </Button>
                )}
                <Button size="sm" variant="outline-info" onClick={handleRefreshPayment} disabled={actionLoading}>
                  Refresh Payment
                </Button>
                <Button size="sm" variant="outline-warning" onClick={handleRetryShipment} disabled={actionLoading}>
                  Retry Shipment
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Order Items */}
      {order.items && order.items.length > 0 && (
        <Card className="border-0 mb-4" style={{ borderRadius: 14, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <Card.Body className="p-4">
            <h6 className="fw-bold mb-3">Item Pesanan</h6>
            <Table responsive size="sm" style={{ fontSize: "0.85rem" }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  <th>Produk</th>
                  <th>Varian</th>
                  <th>Qty</th>
                  <th>Harga</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.productName}</td>
                    <td>{item.variantName}</td>
                    <td>{item.quantity}</td>
                    <td>{formatCurrency(item.price)}</td>
                    <td>{formatCurrency(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* Payment */}
      {order.payments && order.payments.length > 0 && (
        <Card className="border-0 mb-4" style={{ borderRadius: 14, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <Card.Body className="p-4">
            <h6 className="fw-bold mb-3">Pembayaran</h6>
            {order.payments.map((payment) => (
              <div key={payment.id} className="mb-2 p-2 border rounded">
                <Row>
                  <Col sm={4}><small className="text-muted">Method:</small> {payment.paymentMethod}</Col>
                  <Col sm={4}><small className="text-muted">Channel:</small> {payment.paymentChannel}</Col>
                  <Col sm={4}>
                    <small className="text-muted">Status:</small>{" "}
                    <Badge bg={payment.status === "PAID" ? "success" : payment.status === "PENDING" ? "warning" : "danger"}>
                      {payment.status}
                    </Badge>
                  </Col>
                </Row>
                <Row className="mt-1">
                  <Col sm={4}><small className="text-muted">Amount:</small> {formatCurrency(payment.amount)}</Col>
                  <Col sm={4}><small className="text-muted">Ref:</small> {payment.externalId || "-"}</Col>
                  <Col sm={4}><small className="text-muted">Paid At:</small> {payment.paidAt ? new Date(payment.paidAt).toLocaleString("id-ID") : "-"}</Col>
                </Row>
              </div>
            ))}
          </Card.Body>
        </Card>
      )}

      {/* Shipment */}
      <Card className="border-0 mb-4" style={{ borderRadius: 14, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
        <Card.Body className="p-4">
          <h6 className="fw-bold mb-3">Pengiriman</h6>
          {order.shipment ? (
            <>
              <Row className="mb-2">
                <Col sm={3}><small className="text-muted">Courier:</small> {order.shipment.courierCompany}</Col>
                <Col sm={3}><small className="text-muted">Type:</small> {order.shipment.courierType}</Col>
                <Col sm={3}><small className="text-muted">Tracking:</small> {order.shipment.trackingId || "-"}</Col>
                <Col sm={3}><small className="text-muted">Waybill:</small> {order.shipment.waybillId || "-"}</Col>
              </Row>
              <Row className="mb-3">
                <Col sm={3}>
                  <small className="text-muted">Status:</small>{" "}
                  <Badge bg="info">{order.shipment.status}</Badge>
                </Col>
              </Row>
              {order.shipment.trackingHistory && order.shipment.trackingHistory.length > 0 && (
                <div>
                  <h6 className="fw-semibold mb-2" style={{ fontSize: "0.85rem" }}>
                    Tracking Timeline
                  </h6>
                  {order.shipment.trackingHistory.map((event, i) => (
                    <div key={i} className="d-flex gap-2 mb-2" style={{ fontSize: "0.8rem" }}>
                      <span className="text-muted" style={{ minWidth: 140 }}>
                        {new Date(event.date).toLocaleString("id-ID")}
                      </span>
                      <span>{event.description}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="text-muted mb-0">Belum ada data pengiriman.</p>
          )}

          <div className="mt-3">
            <h6 className="fw-semibold mb-2" style={{ fontSize: "0.85rem" }}>
              Update Tracking Manual
            </h6>
            <InputGroup size="sm" style={{ maxWidth: 400 }}>
              <Form.Control
                placeholder="Masukkan tracking number..."
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
              />
              <Button
                variant="outline-primary"
                onClick={handleUpdateTracking}
                disabled={actionLoading || !trackingInput.trim()}
              >
                Update
              </Button>
            </InputGroup>
          </div>
        </Card.Body>
      </Card>

      <ConfirmActionModal
        show={showCancel}
        onHide={() => setShowCancel(false)}
        onConfirm={handleCancel}
        title="Batalkan Pesanan"
        message="Apakah Anda yakin ingin membatalkan pesanan ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Batalkan Pesanan"
        confirmVariant="danger"
        loading={actionLoading}
      />
    </div>
  );
}

import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Row, Col, Badge, Button, Spinner, Table } from "react-bootstrap";
import { FiArrowLeft, FiPrinter } from "react-icons/fi";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { fetchInvoiceDetail } from "@/features/admin/adminSlice";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(value);

export default function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { detail: invoice, detailLoading } = useAppSelector((state) => state.admin.invoices);

  useEffect(() => {
    if (id) dispatch(fetchInvoiceDetail(Number(id)));
  }, [dispatch, id]);

  if (detailLoading || !invoice) {
    return (
      <div className="d-flex justify-content-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <div className="d-print-none">
        <Button
          variant="link"
          className="mb-3 p-0 text-decoration-none"
          onClick={() => navigate("/admin/invoices")}
        >
          <FiArrowLeft className="me-1" /> Kembali ke Daftar Invoice
        </Button>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1" style={{ color: "#0f172a" }}>
            Invoice #{invoice.orderExternalId || invoice.id}
          </h4>
          <p className="text-muted mb-0" style={{ fontSize: "0.85rem" }}>
            Dibuat: {new Date(invoice.createdAt).toLocaleString("id-ID")}
          </p>
        </div>
        <Button
          variant="outline-primary"
          size="sm"
          onClick={handlePrint}
          className="d-print-none d-flex align-items-center gap-1"
        >
          <FiPrinter size={14} /> Cetak
        </Button>
      </div>

      <Card className="border-0 mb-4" style={{ borderRadius: 14, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
        <Card.Body className="p-4">
          <Row className="mb-4">
            <Col sm={6}>
              <h6 className="fw-bold mb-2">Info Pelanggan</h6>
              <p className="mb-1" style={{ fontSize: "0.85rem" }}>
                <strong>Email:</strong> {invoice.email}
              </p>
              <p className="mb-0" style={{ fontSize: "0.85rem" }}>
                <strong>Order ID:</strong> {invoice.orderExternalId}
              </p>
            </Col>
            <Col sm={6} className="text-sm-end">
              <h6 className="fw-bold mb-2">Status Pembayaran</h6>
              <Badge
                bg={
                  invoice.paymentStatus === "PAID"
                    ? "success"
                    : invoice.paymentStatus === "PENDING"
                      ? "warning"
                      : "danger"
                }
                style={{ fontSize: "0.85rem" }}
              >
                {invoice.paymentStatus}
              </Badge>
            </Col>
          </Row>

          {invoice.items && invoice.items.length > 0 && (
            <>
              <h6 className="fw-bold mb-2">Item Pesanan</h6>
              <Table responsive size="sm" style={{ fontSize: "0.85rem" }}>
                <thead>
                  <tr style={{ background: "#f8fafc" }}>
                    <th>Produk</th>
                    <th>Varian</th>
                    <th className="text-center">Qty</th>
                    <th className="text-end">Harga</th>
                    <th className="text-end">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.productName}</td>
                      <td>{item.variantName}</td>
                      <td className="text-center">{item.quantity}</td>
                      <td className="text-end">{formatCurrency(item.price)}</td>
                      <td className="text-end">{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={4} className="text-end fw-bold">
                      Total
                    </td>
                    <td className="text-end fw-bold">
                      {formatCurrency(invoice.amount)}
                    </td>
                  </tr>
                </tfoot>
              </Table>
            </>
          )}

          {invoice.payment && (
            <>
              <h6 className="fw-bold mb-2 mt-4">Detail Pembayaran</h6>
              <Row style={{ fontSize: "0.85rem" }}>
                <Col sm={4}>
                  <p className="mb-1"><strong>Method:</strong> {invoice.payment.paymentMethod}</p>
                </Col>
                <Col sm={4}>
                  <p className="mb-1"><strong>Channel:</strong> {invoice.payment.paymentChannel}</p>
                </Col>
                <Col sm={4}>
                  <p className="mb-1">
                    <strong>Paid At:</strong>{" "}
                    {invoice.payment.paidAt
                      ? new Date(invoice.payment.paidAt).toLocaleString("id-ID")
                      : "-"}
                  </p>
                </Col>
              </Row>
            </>
          )}

          {invoice.shipment && (
            <>
              <h6 className="fw-bold mb-2 mt-4">Pengiriman</h6>
              <Row style={{ fontSize: "0.85rem" }}>
                <Col sm={3}>
                  <p className="mb-1"><strong>Courier:</strong> {invoice.shipment.courierCompany}</p>
                </Col>
                <Col sm={3}>
                  <p className="mb-1"><strong>Tracking:</strong> {invoice.shipment.trackingId || "-"}</p>
                </Col>
                <Col sm={3}>
                  <p className="mb-1"><strong>Waybill:</strong> {invoice.shipment.waybillId || "-"}</p>
                </Col>
                <Col sm={3}>
                  <p className="mb-1"><strong>Status:</strong> {invoice.shipment.status}</p>
                </Col>
              </Row>
            </>
          )}
        </Card.Body>
      </Card>

      <style>{`
        @media print {
          .d-print-none { display: none !important; }
          .admin-sidebar, .admin-navbar, .sidebar-overlay { display: none !important; }
          .admin-main { margin: 0 !important; padding: 0 !important; }
          .admin-wrapper { display: block !important; }
          .admin-container { display: block !important; }
          body { background: #fff !important; }
        }
      `}</style>
    </div>
  );
}

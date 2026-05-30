import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ColumnDef } from "@tanstack/react-table";
import { Badge, Form } from "react-bootstrap";
import { FiRefreshCw, FiExternalLink } from "react-icons/fi";

import DataTable from "@/components/common/Table/DataTable";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { fetchPayments, refreshPaymentStatus } from "@/features/admin/adminSlice";
import type { AdminPayment } from "@/features/admin/admin.types";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(value);

const statusColor = (status: string) => {
  switch (status) {
    case "PAID":
    case "SETTLED":
      return "success";
    case "PENDING":
      return "warning";
    case "EXPIRED":
    case "FAILED":
      return "danger";
    default:
      return "secondary";
  }
};

const columns: ColumnDef<AdminPayment, unknown>[] = [
  { accessorKey: "id", header: "Payment ID", size: 80 },
  { accessorKey: "orderId", header: "Order ID", size: 80 },
  { accessorKey: "paymentMethod", header: "Method" },
  { accessorKey: "paymentChannel", header: "Channel" },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ getValue }) => formatCurrency(getValue() as number),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const val = getValue() as string;
      return <Badge bg={statusColor(val)}>{val}</Badge>;
    },
  },
  {
    accessorKey: "paidAt",
    header: "Paid At",
    cell: ({ getValue }) => {
      const val = getValue() as string | null;
      return val ? new Date(val).toLocaleString("id-ID") : "-";
    },
  },
];

export default function TransactionListPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { list, loading, meta } = useAppSelector((state) => state.admin.payments);

  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [methodFilter, setMethodFilter] = useState("");

  useEffect(() => {
    dispatch(
      fetchPayments({
        page,
        limit: 10,
        status: statusFilter || undefined,
        paymentMethod: methodFilter || undefined,
      })
    );
  }, [dispatch, page, statusFilter, methodFilter]);

  return (
    <div>
      <div className="mb-4">
        <h4 className="fw-bold mb-1" style={{ color: "#0f172a" }}>
          Transaksi Pembayaran
        </h4>
        <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
          Kelola semua transaksi pembayaran
        </p>
      </div>

      <DataTable<AdminPayment>
        title="Daftar Transaksi"
        columns={columns}
        data={list}
        loading={loading}
        searchable={false}
        toolbarContent={
          <>
            <Form.Select
              size="sm"
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              disabled={loading}
              style={{ width: 160, fontSize: "0.85rem" }}
            >
              <option value="">Semua Status</option>
              <option value="PENDING">Pending</option>
              <option value="PAID">Paid</option>
              <option value="EXPIRED">Expired</option>
              <option value="FAILED">Failed</option>
            </Form.Select>
            <Form.Select
              size="sm"
              value={methodFilter}
              onChange={(e) => { setMethodFilter(e.target.value); setPage(1); }}
              disabled={loading}
              style={{ width: 190, fontSize: "0.85rem" }}
            >
              <option value="">Semua Method</option>
              <option value="VIRTUAL_ACCOUNT">Virtual Account</option>
              <option value="EWALLET">E-Wallet</option>
              <option value="QR_CODE">QR Code</option>
            </Form.Select>
          </>
        }
        serverPagination={
          meta
            ? {
                total: meta.total,
                perPage: meta.perPage,
                currentPage: meta.currentPage,
                lastPage: meta.lastPage,
                onPageChange: setPage,
              }
            : undefined
        }
        actions={[
          {
            icon: <FiRefreshCw size={14} />,
            title: "Refresh Status",
            variant: "info",
            onClick: (row) => dispatch(refreshPaymentStatus(row.id)),
          },
          {
            icon: <FiExternalLink size={14} />,
            title: "Lihat Order",
            variant: "primary",
            onClick: (row) => navigate(`/admin/orders/${row.orderId}`),
          },
        ]}
      />
    </div>
  );
}

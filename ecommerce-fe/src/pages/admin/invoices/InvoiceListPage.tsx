import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "react-bootstrap";
import { FiEye } from "react-icons/fi";

import DataTable from "@/components/common/Table/DataTable";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { fetchInvoices } from "@/features/admin/adminSlice";
import type { Invoice } from "@/features/admin/admin.types";

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

const columns: ColumnDef<Invoice, unknown>[] = [
  { accessorKey: "orderExternalId", header: "Order ID" },
  { accessorKey: "email", header: "Email" },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ getValue }) => formatCurrency(getValue() as number),
  },
  {
    accessorKey: "paymentStatus",
    header: "Payment Status",
    cell: ({ getValue }) => {
      const val = getValue() as string;
      return <Badge bg={statusColor(val)}>{val}</Badge>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Tanggal",
    cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString("id-ID"),
  },
];

export default function InvoiceListPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { list, loading, meta } = useAppSelector((state) => state.admin.invoices);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchInvoices({ page, limit: 10 }));
  }, [dispatch, page]);

  return (
    <div>
      <div className="mb-4">
        <h4 className="fw-bold mb-1" style={{ color: "#0f172a" }}>
          Invoice
        </h4>
        <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
          Daftar invoice pesanan
        </p>
      </div>

      <DataTable<Invoice>
        title="Daftar Invoice"
        columns={columns}
        data={list}
        loading={loading}
        searchable={false}
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
            icon: <FiEye size={14} />,
            title: "Lihat Detail",
            variant: "primary",
            onClick: (row) => navigate(`/admin/invoices/${row.id}`),
          },
        ]}
      />
    </div>
  );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ColumnDef } from "@tanstack/react-table";
import { Badge, Form, InputGroup, Row, Col, Button } from "react-bootstrap";
import { FiEye, FiSearch } from "react-icons/fi";

import DataTable from "@/components/common/Table/DataTable";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { fetchOrders, setOrderFilters } from "@/features/admin/adminSlice";
import type { AdminOrder } from "@/features/admin/admin.types";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(value);

const statusColor = (status: string) => {
  switch (status) {
    case "PAID":
      return "success";
    case "PENDING":
      return "warning";
    case "CANCELLED":
      return "danger";
    case "PROCESSING":
      return "info";
    case "SHIPPED":
      return "primary";
    case "DELIVERED":
      return "success";
    default:
      return "secondary";
  }
};

const columns: ColumnDef<AdminOrder, unknown>[] = [
  { accessorKey: "id", header: "ID", size: 60 },
  { accessorKey: "externalId", header: "External ID" },
  { accessorKey: "email", header: "Email" },
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
    accessorKey: "shippingStatus",
    header: "Shipping",
    cell: ({ getValue }) => {
      const val = getValue() as string | null;
      return val ? <Badge bg={statusColor(val)}>{val}</Badge> : "-";
    },
  },
  {
    accessorKey: "createdAt",
    header: "Tanggal",
    cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString("id-ID"),
  },
];

export default function OrderListPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { list, loading, meta, filters } = useAppSelector((state) => state.admin.orders);
  const [search, setSearch] = useState(filters.search ?? "");
  const [statusFilter, setStatusFilter] = useState(filters.status ?? "");

  useEffect(() => {
    dispatch(fetchOrders(filters));
  }, [dispatch, filters]);

  const handleSearch = () => {
    dispatch(setOrderFilters({ search, page: 1 }));
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    dispatch(setOrderFilters({ status: value || undefined, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    dispatch(setOrderFilters({ page }));
  };

  return (
    <div>
      <div className="mb-4">
        <h4 className="fw-bold mb-1" style={{ color: "#0f172a" }}>
          Manajemen Pesanan
        </h4>
        <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
          Kelola semua pesanan pelanggan
        </p>
      </div>

      <Row className="g-2 mb-3">
        <Col sm={4}>
          <InputGroup size="sm">
            <Form.Control
              placeholder="Cari email / order ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button variant="outline-secondary" onClick={handleSearch}>
              <FiSearch size={14} />
            </Button>
          </InputGroup>
        </Col>
        <Col sm={3}>
          <Form.Select
            size="sm"
            value={statusFilter}
            onChange={(e) => handleStatusChange(e.target.value)}
          >
            <option value="">Semua Status</option>
            <option value="PENDING">Pending</option>
            <option value="PAID">Paid</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </Form.Select>
        </Col>
      </Row>

      <DataTable<AdminOrder>
        title="Daftar Pesanan"
        columns={columns}
        data={list}
        loading={loading}
        searchable={false}
        actions={[
          {
            icon: <FiEye size={14} />,
            title: "Detail",
            variant: "primary",
            onClick: (row) => navigate(`/admin/orders/${row.id}`),
          },
        ]}
      />

      {meta && meta.lastPage > 1 && (
        <div className="d-flex justify-content-center mt-3 gap-2">
          <Button
            size="sm"
            variant="outline-secondary"
            disabled={meta.currentPage <= 1}
            onClick={() => handlePageChange(meta.currentPage - 1)}
          >
            Prev
          </Button>
          <span className="align-self-center" style={{ fontSize: "0.85rem" }}>
            Halaman {meta.currentPage} dari {meta.lastPage}
          </span>
          <Button
            size="sm"
            variant="outline-secondary"
            disabled={meta.currentPage >= meta.lastPage}
            onClick={() => handlePageChange(meta.currentPage + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

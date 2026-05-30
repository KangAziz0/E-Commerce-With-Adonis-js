import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge, Form } from "react-bootstrap";
import { FiRefreshCw, FiRepeat } from "react-icons/fi";

import DataTable from "@/components/common/Table/DataTable";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  fetchShipments,
  refreshShipmentTracking,
  retryShipmentCreation,
} from "@/features/admin/adminSlice";
import type { AdminShipment } from "@/features/admin/admin.types";

const statusColor = (status: string) => {
  switch (status) {
    case "delivered":
      return "success";
    case "in_transit":
    case "picked":
      return "info";
    case "pending":
    case "confirmed":
      return "warning";
    case "cancelled":
    case "failed":
      return "danger";
    default:
      return "secondary";
  }
};

const columns: ColumnDef<AdminShipment, unknown>[] = [
  { accessorKey: "id", header: "ID", size: 60 },
  { accessorKey: "orderId", header: "Order ID", size: 80 },
  { accessorKey: "courierCompany", header: "Courier" },
  { accessorKey: "trackingId", header: "Tracking ID", cell: ({ getValue }) => (getValue() as string) || "-" },
  { accessorKey: "waybillId", header: "Waybill", cell: ({ getValue }) => (getValue() as string) || "-" },
  {
    accessorKey: "status",
    header: "Status",
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

export default function ShippingListPage() {
  const dispatch = useAppDispatch();
  const { list, loading, meta } = useAppSelector((state) => state.admin.shipments);

  const [page, setPage] = useState(1);
  const [courierFilter, setCourierFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    dispatch(
      fetchShipments({
        page,
        limit: 10,
        courierCompany: courierFilter || undefined,
        status: statusFilter || undefined,
      })
    );
  }, [dispatch, page, courierFilter, statusFilter]);

  return (
    <div>
      <div className="mb-4">
        <h4 className="fw-bold mb-1" style={{ color: "#0f172a" }}>
          Manajemen Pengiriman
        </h4>
        <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
          Kelola semua pengiriman pesanan
        </p>
      </div>

      <DataTable<AdminShipment>
        title="Daftar Pengiriman"
        columns={columns}
        data={list}
        loading={loading}
        searchable={false}
        toolbarContent={
          <>
            <Form.Select
              size="sm"
              value={courierFilter}
              onChange={(e) => { setCourierFilter(e.target.value); setPage(1); }}
              disabled={loading}
              style={{ width: 160, fontSize: "0.85rem" }}
            >
              <option value="">Semua Courier</option>
              <option value="jne">JNE</option>
              <option value="jnt">J&T</option>
              <option value="sicepat">SiCepat</option>
              <option value="anteraja">AnterAja</option>
            </Form.Select>
            <Form.Select
              size="sm"
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              disabled={loading}
              style={{ width: 170, fontSize: "0.85rem" }}
            >
              <option value="">Semua Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="picked">Picked</option>
              <option value="in_transit">In Transit</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
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
            title: "Refresh Tracking",
            variant: "info",
            onClick: (row) => dispatch(refreshShipmentTracking(row.id)),
          },
          {
            icon: <FiRepeat size={14} />,
            title: "Retry Creation",
            variant: "warning",
            onClick: (row) => dispatch(retryShipmentCreation(row.orderId)),
          },
        ]}
      />
    </div>
  );
}

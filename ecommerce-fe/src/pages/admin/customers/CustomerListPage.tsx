import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ColumnDef } from "@tanstack/react-table";
import { Badge, Form, InputGroup, Row, Col, Button } from "react-bootstrap";
import { FiEye, FiToggleLeft, FiToggleRight, FiSearch } from "react-icons/fi";

import DataTable from "@/components/common/Table/DataTable";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { fetchCustomers, toggleCustomerActive } from "@/features/admin/adminSlice";
import type { AdminCustomer } from "@/features/admin/admin.types";
import ConfirmActionModal from "@/components/common/Modal/ConfirmActionModal";

const columns: ColumnDef<AdminCustomer, unknown>[] = [
  { accessorKey: "id", header: "ID", size: 60 },
  { accessorKey: "fullName", header: "Nama" },
  { accessorKey: "email", header: "Email" },
  {
    accessorKey: "createdAt",
    header: "Terdaftar",
    cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString("id-ID"),
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ getValue }) => (
      <Badge bg={getValue() ? "success" : "secondary"}>
        {getValue() ? "Aktif" : "Nonaktif"}
      </Badge>
    ),
  },
];

export default function CustomerListPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { list, loading, meta } = useAppSelector((state) => state.admin.customers);
  const { actionLoading } = useAppSelector((state) => state.admin);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showToggle, setShowToggle] = useState(false);
  const [selected, setSelected] = useState<AdminCustomer | null>(null);

  useEffect(() => {
    dispatch(fetchCustomers({ page, limit: 10, search: search || undefined }));
  }, [dispatch, page]);

  const handleSearch = () => {
    setPage(1);
    dispatch(fetchCustomers({ page: 1, limit: 10, search: search || undefined }));
  };

  const handleToggle = (row: AdminCustomer) => {
    setSelected(row);
    setShowToggle(true);
  };

  const confirmToggle = () => {
    if (selected) {
      dispatch(toggleCustomerActive(selected.id));
    }
    setShowToggle(false);
  };

  return (
    <div>
      <div className="mb-4">
        <h4 className="fw-bold mb-1" style={{ color: "#0f172a" }}>
          Manajemen Pelanggan
        </h4>
        <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
          Kelola data pelanggan
        </p>
      </div>

      <Row className="g-2 mb-3">
        <Col sm={4}>
          <InputGroup size="sm">
            <Form.Control
              placeholder="Cari nama / email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button variant="outline-secondary" onClick={handleSearch}>
              <FiSearch size={14} />
            </Button>
          </InputGroup>
        </Col>
      </Row>

      <DataTable<AdminCustomer>
        title="Daftar Pelanggan"
        columns={columns}
        data={list}
        loading={loading}
        searchable={false}
        actions={[
          {
            icon: <FiEye size={14} />,
            title: "Detail",
            variant: "primary",
            onClick: (row) => navigate(`/admin/customers/${row.id}`),
          },
          {
            icon: <FiToggleLeft size={14} />,
            title: "Toggle Active",
            variant: "warning",
            onClick: handleToggle,
          },
        ]}
      />

      {meta && meta.lastPage > 1 && (
        <div className="d-flex justify-content-center mt-3 gap-2">
          <Button size="sm" variant="outline-secondary" disabled={page <= 1} onClick={() => setPage(page - 1)}>
            Prev
          </Button>
          <span className="align-self-center" style={{ fontSize: "0.85rem" }}>
            Halaman {meta.currentPage} dari {meta.lastPage}
          </span>
          <Button size="sm" variant="outline-secondary" disabled={page >= (meta?.lastPage ?? 1)} onClick={() => setPage(page + 1)}>
            Next
          </Button>
        </div>
      )}

      <ConfirmActionModal
        show={showToggle}
        onHide={() => setShowToggle(false)}
        onConfirm={confirmToggle}
        title="Ubah Status Pelanggan"
        message={`Apakah Anda yakin ingin ${selected?.isActive ? "menonaktifkan" : "mengaktifkan"} pelanggan ${selected?.fullName ?? ""}?`}
        confirmText={selected?.isActive ? "Nonaktifkan" : "Aktifkan"}
        confirmVariant={selected?.isActive ? "danger" : "success"}
        loading={actionLoading}
      />
    </div>
  );
}

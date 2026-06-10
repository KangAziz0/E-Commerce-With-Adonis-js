import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge, Form, Button, Modal } from "react-bootstrap";
import { FiEdit2 } from "react-icons/fi";

import DataTable from "@/components/common/Table/DataTable";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { fetchInventory, updateStock } from "@/features/admin/adminSlice";
import type { InventoryItem } from "@/features/admin/admin.types";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(value);

const labelStyle = { fontSize: "0.85rem", fontWeight: 600, color: "#334155" };
const inputStyle = { borderRadius: 8, border: "1px solid #e2e8f0", fontSize: "0.9rem" };
const primaryButtonStyle = {
  borderRadius: 8,
  fontWeight: 600,
  background: "#6366f1",
  border: "none",
  boxShadow: "0 2px 8px rgba(99,102,241,0.3)",
};
const secondaryButtonStyle = {
  borderRadius: 8,
  fontWeight: 600,
  border: "1px solid #e2e8f0",
  color: "#475569",
};

const columns: ColumnDef<InventoryItem, unknown>[] = [
  { accessorKey: "productName", header: "Produk" },
  { accessorKey: "variantName", header: "Varian" },
  {
    accessorKey: "stock",
    header: "Stok",
    cell: ({ getValue }) => {
      const val = getValue() as number;
      return (
        <span>
          {val}
          {val < 10 && (
            <Badge bg="danger" className="ms-2" style={{ fontSize: "0.65rem" }}>
              Low
            </Badge>
          )}
        </span>
      );
    },
  },
  {
    accessorKey: "price",
    header: "Harga",
    cell: ({ getValue }) => formatCurrency(getValue() as number),
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const stock = row.original.stock;
      if (stock === 0) return <Badge bg="danger">Habis</Badge>;
      if (stock < 10) return <Badge bg="warning">Low Stock</Badge>;
      return <Badge bg="success">Tersedia</Badge>;
    },
  },
];

export default function InventoryListPage() {
  const dispatch = useAppDispatch();
  const { list, loading, meta } = useAppSelector((state) => state.admin.inventory);
  const { actionLoading } = useAppSelector((state) => state.admin);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [stockInput, setStockInput] = useState(0);

  useEffect(() => {
    dispatch(
      fetchInventory({
        page,
        limit,
        search: search || undefined,
        low_stock: lowStockOnly || undefined,
      })
    );
  }, [dispatch, page, limit, lowStockOnly]);

  const handleSearch = () => {
    setPage(1);
    dispatch(
      fetchInventory({
        page: 1,
        limit,
        search: search || undefined,
        low_stock: lowStockOnly || undefined,
      })
    );
  };

  const handlePageSizeChange = (pageSize: number) => {
    setLimit(pageSize);
    setPage(1);
  };

  const handleEdit = (item: InventoryItem) => {
    setSelectedItem(item);
    setStockInput(item.stock);
    setShowModal(true);
  };

  const handleUpdateStock = () => {
    if (selectedItem) {
      dispatch(updateStock({ variantId: selectedItem.variantId, stock: stockInput }));
      setShowModal(false);
      // Refetch after a short delay
      setTimeout(() => {
        dispatch(
          fetchInventory({
            page,
            limit,
            search: search || undefined,
            low_stock: lowStockOnly || undefined,
          })
        );
      }, 500);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h4 className="fw-bold mb-1" style={{ color: "#0f172a" }}>
          Manajemen Inventory
        </h4>
        <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
          Kelola stok produk
        </p>
      </div>

      <DataTable<InventoryItem>
        title="Daftar Inventory"
        columns={columns}
        data={list}
        loading={loading}
        searchPlaceholder="Cari produk..."
        searchValue={search}
        onSearchChange={setSearch}
        onSearchSubmit={handleSearch}
        toolbarContent={
          <Form.Check
            type="switch"
            id="low-stock-switch"
            label="Low Stock Only"
            checked={lowStockOnly}
            onChange={(e) => { setLowStockOnly(e.target.checked); setPage(1); }}
            disabled={loading}
            className="d-flex align-items-center gap-2 mb-0"
            style={{ fontSize: "0.85rem", color: "#475569" }}
          />
        }
        serverPagination={
          meta
            ? {
                total: meta.total,
                perPage: meta.perPage,
                currentPage: meta.currentPage,
                lastPage: meta.lastPage,
                onPageChange: setPage,
                onPageSizeChange: handlePageSizeChange,
              }
            : undefined
        }
        actions={[
          {
            icon: <FiEdit2 size={14} />,
            title: "Update Stok",
            variant: "primary",
            onClick: handleEdit,
          },
        ]}
      />

      <Modal show={showModal} onHide={() => setShowModal(false)} centered contentClassName="border-0 rounded-4 overflow-hidden shadow">
        <Modal.Header closeButton className="border-0 pb-0 px-4 pt-4">
          <div>
            <Modal.Title style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0f172a" }}>
              Update Stok
            </Modal.Title>
            <p className="text-muted mb-0 mt-1" style={{ fontSize: "0.85rem" }}>
              Perbarui jumlah stok varian produk
            </p>
          </div>
        </Modal.Header>
        <Modal.Body className="px-4 py-3">
          {selectedItem && (
            <div
              className="p-3"
              style={{
                borderRadius: 12,
                border: "1px solid #f1f5f9",
                background: "#fff",
              }}
            >
              <div className="mb-3">
                <span className="text-muted d-block" style={{ fontSize: "0.78rem", fontWeight: 600 }}>
                  Produk
                </span>
                <strong style={{ color: "#0f172a", fontSize: "0.95rem" }}>
                  {selectedItem.productName}
                </strong>
                <div className="text-muted" style={{ fontSize: "0.85rem" }}>
                  {selectedItem.variantName}
                </div>
              </div>
              <Form.Group>
                <Form.Label style={labelStyle}>Stok Baru</Form.Label>
                <Form.Control
                  type="number"
                  min={0}
                  value={stockInput}
                  onChange={(e) => setStockInput(Number(e.target.value))}
                  style={inputStyle}
                />
              </Form.Group>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0 px-4 pb-4 pt-2">
          <Button variant="light" onClick={() => setShowModal(false)} style={secondaryButtonStyle}>
            Batal
          </Button>
          <Button onClick={handleUpdateStock} disabled={actionLoading} style={primaryButtonStyle}>
            Simpan
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

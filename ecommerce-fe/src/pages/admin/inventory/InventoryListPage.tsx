import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge, Form, Row, Col, Button, Modal, InputGroup } from "react-bootstrap";
import { FiEdit2, FiSearch } from "react-icons/fi";

import DataTable from "@/components/common/Table/DataTable";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { fetchInventory, updateStock } from "@/features/admin/adminSlice";
import type { InventoryItem } from "@/features/admin/admin.types";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(value);

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
  const [search, setSearch] = useState("");
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [stockInput, setStockInput] = useState(0);

  useEffect(() => {
    dispatch(
      fetchInventory({
        page,
        limit: 10,
        search: search || undefined,
        low_stock: lowStockOnly || undefined,
      })
    );
  }, [dispatch, page, lowStockOnly]);

  const handleSearch = () => {
    setPage(1);
    dispatch(
      fetchInventory({
        page: 1,
        limit: 10,
        search: search || undefined,
        low_stock: lowStockOnly || undefined,
      })
    );
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
            limit: 10,
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

      <Row className="g-2 mb-3">
        <Col sm={4}>
          <InputGroup size="sm">
            <Form.Control
              placeholder="Cari produk..."
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
          <Form.Check
            type="switch"
            id="low-stock-switch"
            label="Low Stock Only"
            checked={lowStockOnly}
            onChange={(e) => { setLowStockOnly(e.target.checked); setPage(1); }}
            style={{ fontSize: "0.85rem" }}
          />
        </Col>
      </Row>

      <DataTable<InventoryItem>
        title="Daftar Inventory"
        columns={columns}
        data={list}
        loading={loading}
        searchable={false}
        actions={[
          {
            icon: <FiEdit2 size={14} />,
            title: "Update Stok",
            variant: "primary",
            onClick: handleEdit,
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

      {/* Stock Update Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="sm">
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "1rem" }}>Update Stok</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedItem && (
            <div>
              <p className="mb-2" style={{ fontSize: "0.85rem" }}>
                <strong>{selectedItem.productName}</strong> - {selectedItem.variantName}
              </p>
              <Form.Group>
                <Form.Label style={{ fontSize: "0.85rem" }}>Stok Baru</Form.Label>
                <Form.Control
                  type="number"
                  min={0}
                  value={stockInput}
                  onChange={(e) => setStockInput(Number(e.target.value))}
                  size="sm"
                />
              </Form.Group>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button size="sm" variant="light" onClick={() => setShowModal(false)}>
            Batal
          </Button>
          <Button size="sm" variant="primary" onClick={handleUpdateStock} disabled={actionLoading}>
            Simpan
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

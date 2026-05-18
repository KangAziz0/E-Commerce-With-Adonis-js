import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "react-bootstrap";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

import DataTable from "@/components/common/Table/DataTable";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  fetchProductsRequest,
  deleteProductRequest,
} from "@/features/products/productSlice";
import type { Product } from "@/types/ui/product";

const columns: ColumnDef<Product, any>[] = [
  {
    accessorKey: "id",
    header: "ID",
    size: 60,
  },
  {
    accessorKey: "name",
    header: "Nama Produk",
    cell: ({ getValue }) => {
      const val = getValue() as string;
      return val.length > 40 ? val.slice(0, 40) + "..." : val;
    },
  },
  {
    accessorKey: "price",
    header: "Harga",
    cell: ({ getValue }) => {
      const price = getValue() as number;
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(price);
    },
  },
  {
    accessorKey: "category",
    header: "Kategori",
    cell: ({ getValue }) => {
      const val = getValue() as string;
      return val || "—";
    },
  },
  {
    accessorKey: "brand",
    header: "Brand",
    cell: ({ getValue }) => {
      const val = getValue() as string;
      return val || "—";
    },
  },
  {
    accessorKey: "sku",
    header: "SKU",
    cell: ({ getValue }) => (
      <Badge bg="light" text="dark" className="font-monospace">
        {(getValue() as string) || "—"}
      </Badge>
    ),
  },
];

export default function ProductListPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { data: products, loading } = useAppSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProductsRequest({ limit: 100 }));
  }, [dispatch]);

  const handleCreate = () => {
    navigate("/admin/products/create");
  };

  const handleEdit = (row: Product) => {
    navigate(`/admin/products/${row.id}/edit`);
  };

  const handleDelete = (row: Product) => {
    if (window.confirm(`Hapus produk "${row.name}"?`)) {
      dispatch(deleteProductRequest({ id: row.id }));
    }
  };

  return (
    <DataTable<Product>
      title="Manajemen Produk"
      columns={columns}
      data={products}
      loading={loading}
      onCreate={handleCreate}
      createButtonText="+ Tambah Produk"
      searchPlaceholder="Cari produk..."
      actions={[
        {
          icon: <FiEdit2 size={14} />,
          title: "Edit",
          variant: "warning",
          onClick: handleEdit,
        },
        {
          icon: <FiTrash2 size={14} />,
          title: "Hapus",
          variant: "danger",
          onClick: handleDelete,
        },
      ]}
    />
  );
}

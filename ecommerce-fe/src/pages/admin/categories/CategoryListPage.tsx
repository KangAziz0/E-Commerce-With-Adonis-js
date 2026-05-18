import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "react-bootstrap";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

import DataTable from "@/components/common/Table/DataTable";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  fetchCategoriesRequest,
  saveCategoryRequest,
  deleteCategoryRequest,
} from "@/features/categories/categorySlice";
import type { Category } from "@/types/category";
import CategoryFormModal from "./CategoryFormModal";
import DeleteConfirmModal from "@/components/common/Modal/DeleteConfirmModal";

const columns: ColumnDef<Category, any>[] = [
  {
    accessorKey: "id",
    header: "ID",
    size: 60,
  },
  {
    accessorKey: "name",
    header: "Nama Kategori",
  },
  {
    accessorKey: "slug",
    header: "Slug",
  },
  {
    accessorKey: "description",
    header: "Deskripsi",
    cell: ({ getValue }) => {
      const val = getValue() as string;
      return val ? (val.length > 50 ? val.slice(0, 50) + "..." : val) : "—";
    },
  },
  {
    accessorKey: "is_active",
    header: "Status",
    cell: ({ getValue }) => (
      <Badge bg={getValue() ? "success" : "secondary"}>
        {getValue() ? "Aktif" : "Nonaktif"}
      </Badge>
    ),
  },
];

export default function CategoryListPage() {
  const dispatch = useAppDispatch();
  const { categories, loading } = useAppSelector((state) => state.categories);

  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selected, setSelected] = useState<Category | null>(null);

  useEffect(() => {
    dispatch(fetchCategoriesRequest());
  }, [dispatch]);

  const handleCreate = () => {
    setSelected(null);
    setShowForm(true);
  };

  const handleEdit = (row: Category) => {
    setSelected(row);
    setShowForm(true);
  };

  const handleDelete = (row: Category) => {
    setSelected(row);
    setShowDelete(true);
  };

  const handleFormSubmit = (data: { name: string; slug?: string; description?: string; is_active?: boolean }) => {
    dispatch(
      saveCategoryRequest({
        id: selected?.id,
        ...data,
      }),
    );
    setShowForm(false);
  };

  const handleConfirmDelete = () => {
    if (selected) {
      dispatch(deleteCategoryRequest({ id: selected.id }));
    }
    setShowDelete(false);
  };

  return (
    <>
      <DataTable<Category>
        title="Manajemen Kategori"
        columns={columns}
        data={categories}
        loading={loading}
        onCreate={handleCreate}
        createButtonText="+ Tambah Kategori"
        searchPlaceholder="Cari kategori..."
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

      <CategoryFormModal
        show={showForm}
        onHide={() => setShowForm(false)}
        onSubmit={handleFormSubmit}
        initialData={selected}
      />

      <DeleteConfirmModal
        show={showDelete}
        onHide={() => setShowDelete(false)}
        onConfirm={handleConfirmDelete}
        itemName={selected?.name ?? ""}
      />
    </>
  );
}

import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

import DataTable from "@/components/common/Table/DataTable";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  fetchBrandsRequest,
  saveBrandRequest,
  deleteBrandRequest,
} from "@/features/brands/brandSlice";
import type { Brand } from "@/features/brands/brand.types";
import BrandFormModal from "./BrandFormModal";
import DeleteConfirmModal from "@/components/common/Modal/DeleteConfirmModal";

const columns: ColumnDef<Brand, any>[] = [
  {
    accessorKey: "id",
    header: "ID",
    size: 60,
  },
  {
    accessorKey: "name",
    header: "Nama Brand",
  },
];

export default function BrandListPage() {
  const dispatch = useAppDispatch();
  const { brands, loading } = useAppSelector((state) => state.brands);

  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selected, setSelected] = useState<Brand | null>(null);

  useEffect(() => {
    dispatch(fetchBrandsRequest());
  }, [dispatch]);

  const handleCreate = () => {
    setSelected(null);
    setShowForm(true);
  };

  const handleEdit = (row: Brand) => {
    setSelected(row);
    setShowForm(true);
  };

  const handleDelete = (row: Brand) => {
    setSelected(row);
    setShowDelete(true);
  };

  const handleFormSubmit = (data: { name: string }) => {
    dispatch(
      saveBrandRequest({
        id: selected?.id,
        ...data,
      }),
    );
    setShowForm(false);
  };

  const handleConfirmDelete = () => {
    if (selected) {
      dispatch(deleteBrandRequest({ id: selected.id }));
    }
    setShowDelete(false);
  };

  return (
    <>
      <DataTable<Brand>
        title="Manajemen Brand"
        columns={columns}
        data={brands}
        loading={loading}
        onCreate={handleCreate}
        createButtonText="+ Tambah Brand"
        searchPlaceholder="Cari brand..."
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

      <BrandFormModal
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

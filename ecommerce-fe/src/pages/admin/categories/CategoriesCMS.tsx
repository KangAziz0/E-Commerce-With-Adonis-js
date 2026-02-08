import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { columns } from "./columns/columns";
import { Category } from "@/types/Category";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  deleteCategoryRequest,
  fetchCategoriesRequest,
} from "@/features/categories/categorySlice";
import { RootState } from "@/store/store";
import ConfirmDialog from "@/components/ConfirmDialog";
import DataTable from "@/components/Table/DataTable";
import CategoryModal from "./modals/modals";

const CategoriesCMS = () => {
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [modalData, setModalData] = useState<Category | null | undefined>(
    undefined,
  );

  const dispatch = useDispatch();
  const { categories, loading } = useSelector(
    (state: RootState) => state.categories,
  );

  useEffect(() => {
    dispatch(fetchCategoriesRequest());
  }, []);

  const data: Category[] = categories ?? [];

  return (
    <div className="p-4" style={{ background: "#f5f6f8", minHeight: "100vh" }}>
      <DataTable<Category>
        title="Kategori"
        columns={columns}
        data={data}
        loading={loading && categories.length === 0}
        onCreate={() => setModalData(null)}
        createButtonText="Tambah Kategori"
        actions={[
          {
            icon: <FaPencilAlt size={16} />,
            title: "Edit",
            variant: "primary",
            onClick: (row) => {
              setModalData(row);
            },
          },
          {
            icon: <FaTrash size={16} />,
            title: "Hapus",
            variant: "danger",
            onClick: (row) => {
              setDeleteId(row.id);
            },
          },
        ]}
      />

      <ConfirmDialog
        open={deleteId !== null}
        title="Hapus kategori?"
        description="Kategori yang dihapus tidak bisa dikembalikan."
        confirmText="Hapus"
        variant="danger"
        loading={loading}
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          dispatch(deleteCategoryRequest({ id: deleteId! }));
          setDeleteId(null);
        }}
      />

      <CategoryModal
        open={modalData !== undefined}
        data={modalData ?? null}
        loading={loading}
        onClose={() => setModalData(undefined)}
      />
    </div>
  );
};

export default CategoriesCMS;

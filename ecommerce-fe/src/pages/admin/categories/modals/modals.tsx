import * as Yup from "yup";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useFormik } from "formik";
import { Category } from "@/types/Category";
import { useDispatch } from "react-redux";
import { saveCategoryRequest } from "@/features/categories/categorySlice";

interface CategoryModalProps {
  open: boolean;
  data: Category | null;
  loading?: boolean;
  onClose: () => void;
}

export const categorySchema = Yup.object({
  name: Yup.string().required("Nama kategori wajib diisi"),
});

const CategoryModal = ({
  open,
  data,
  loading = false,
  onClose,
}: CategoryModalProps) => {
  if (!open) return null;

  const dispatch = useDispatch();
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: data?.id,
      name: data?.name ?? "",
      slug: data?.slug,
      description: data?.description,
      is_active: data?.is_active,
    },
    validationSchema: categorySchema,
    onSubmit: (values) => {
      dispatch(
        saveCategoryRequest({
          id: data?.id,
          name: values.name,
          slug: values.slug,
          description: values.description,
          is_active: values.is_active,
        }),
      );
      onClose();
    },
  });

  return (
    <Modal show={open} onHide={onClose} centered backdrop="static">
      {/* ===== HEADER ===== */}
      <Modal.Header closeButton={!loading}>
        <Modal.Title>
          {data?.id ? "Edit Kategori" : "Create Kategori"}
        </Modal.Title>
      </Modal.Header>

      {/* ===== BODY ===== */}
      <Modal.Body>
        <label className="form-label">Nama Kategori</label>
        <input
          type="text"
          className={`form-control ${
            formik.touched.name && formik.errors.name ? "is-invalid" : ""
          }`}
          {...formik.getFieldProps("name")}
        />
        {formik.touched.name && formik.errors.name && (
          <div className="invalid-feedback">{formik.errors.name}</div>
        )}
        <label className="form-label">Slug</label>
        <input
          type="text"
          className={`form-control ${
            formik.touched.slug && formik.errors.slug ? "is-invalid" : ""
          }`}
          {...formik.getFieldProps("slug")}
        />
        {formik.touched.slug && formik.errors.slug && (
          <div className="invalid-feedback">{formik.errors.slug}</div>
        )}
        <label className="form-label">Description</label>
        <input
          type="text"
          className={`form-control ${
            formik.touched.description && formik.errors.description
              ? "is-invalid"
              : ""
          }`}
          {...formik.getFieldProps("description")}
        />
        {formik.touched.description && formik.errors.description && (
          <div className="invalid-feedback">{formik.errors.description}</div>
        )}
      </Modal.Body>

      {/* ===== FOOTER ===== */}
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Batal
        </Button>

        <Button
          variant="primary"
          onClick={() => formik.handleSubmit()}
          disabled={loading}
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CategoryModal;

import { useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";

import type { Category } from "@/types/category";

interface Props {
  show: boolean;
  onHide: () => void;
  onSubmit: (data: { name: string; slug?: string; description?: string; is_active?: boolean }) => void;
  initialData: Category | null;
}

const validationSchema = Yup.object({
  name: Yup.string().required("Nama kategori wajib diisi"),
  slug: Yup.string(),
  description: Yup.string(),
  is_active: Yup.boolean(),
});

export default function CategoryFormModal({ show, onHide, onSubmit, initialData }: Props) {
  const formik = useFormik({
    initialValues: {
      name: "",
      slug: "",
      description: "",
      is_active: true,
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
      formik.resetForm();
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    if (initialData) {
      formik.setValues({
        name: initialData.name || "",
        slug: initialData.slug || "",
        description: initialData.description || "",
        is_active: initialData.is_active ?? true,
      });
    } else {
      formik.resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData, show]);

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{initialData ? "Edit Kategori" : "Tambah Kategori"}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={formik.handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nama Kategori *</Form.Label>
            <Form.Control
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.name && !!formik.errors.name}
              placeholder="Masukkan nama kategori"
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.name}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Slug</Form.Label>
            <Form.Control
              name="slug"
              value={formik.values.slug}
              onChange={formik.handleChange}
              placeholder="contoh: kategori-baru"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Deskripsi</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              placeholder="Deskripsi singkat kategori"
            />
          </Form.Group>

          <Form.Group>
            <Form.Check
              type="switch"
              id="is_active"
              name="is_active"
              label="Aktif"
              checked={formik.values.is_active}
              onChange={formik.handleChange}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Batal
          </Button>
          <Button variant="success" type="submit">
            {initialData ? "Simpan Perubahan" : "Tambah"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

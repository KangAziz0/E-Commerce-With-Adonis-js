import { useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";

import type { Brand } from "@/features/brands/brand.types";

interface Props {
  show: boolean;
  onHide: () => void;
  onSubmit: (data: { name: string }) => void;
  initialData: Brand | null;
}

const validationSchema = Yup.object({
  name: Yup.string().required("Nama brand wajib diisi"),
});

export default function BrandFormModal({ show, onHide, onSubmit, initialData }: Props) {
  const formik = useFormik({
    initialValues: {
      name: "",
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
      formik.setValues({ name: initialData.name || "" });
    } else {
      formik.resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData, show]);

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton className="border-0 pb-0 px-4 pt-4">
        <Modal.Title style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0f172a" }}>
          {initialData ? "Edit Brand" : "Tambah Brand"}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={formik.handleSubmit}>
        <Modal.Body className="px-4 py-3">
          <Form.Group className="mb-3">
            <Form.Label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#334155" }}>
              Nama Brand <span style={{ color: "#ef4444" }}>*</span>
            </Form.Label>
            <Form.Control
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.name && !!formik.errors.name}
              placeholder="Masukkan nama brand"
              style={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: "0.9rem" }}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.name}
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="border-0 px-4 pb-4 pt-2">
          <Button
            variant="light"
            onClick={onHide}
            style={{ borderRadius: 8, fontWeight: 600, border: "1px solid #e2e8f0", color: "#475569" }}
          >
            Batal
          </Button>
          <Button
            type="submit"
            style={{
              borderRadius: 8,
              fontWeight: 600,
              background: "#6366f1",
              border: "none",
              boxShadow: "0 2px 6px rgba(99,102,241,0.3)",
            }}
          >
            {initialData ? "Simpan Perubahan" : "Tambah"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

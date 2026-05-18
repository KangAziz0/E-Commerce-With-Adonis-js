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
      <Modal.Header closeButton>
        <Modal.Title>{initialData ? "Edit Brand" : "Tambah Brand"}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={formik.handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nama Brand *</Form.Label>
            <Form.Control
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.name && !!formik.errors.name}
              placeholder="Masukkan nama brand"
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.name}
            </Form.Control.Feedback>
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

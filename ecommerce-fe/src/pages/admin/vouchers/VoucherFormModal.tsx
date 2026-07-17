import { useEffect } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";

import type { SaveVoucherPayload, Voucher } from "@/features/vouchers/voucher.types";

interface Props {
  show: boolean;
  onHide: () => void;
  onSubmit: (data: SaveVoucherPayload) => void;
  initialData: Voucher | null;
}

const validationSchema = Yup.object({
  code: Yup.string().required("Kode voucher wajib diisi"),
  name: Yup.string().required("Nama voucher wajib diisi"),
  discountType: Yup.string()
    .oneOf(["percentage", "fixed"])
    .required("Tipe diskon wajib dipilih"),
  discountValue: Yup.number()
    .typeError("Nilai diskon harus berupa angka")
    .positive("Nilai diskon harus lebih dari 0")
    .when("discountType", {
      is: "percentage",
      then: (schema) => schema.max(100, "Persentase maksimal 100"),
    })
    .required("Nilai diskon wajib diisi"),
  minimumPurchase: Yup.number()
    .typeError("Minimum belanja harus berupa angka")
    .min(0, "Minimum belanja tidak boleh negatif")
    .required("Minimum belanja wajib diisi"),
  maximumDiscount: Yup.number()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .min(0, "Maksimum diskon tidak boleh negatif"),
  usageLimit: Yup.number()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .integer("Batas pemakaian harus bilangan bulat")
    .positive("Batas pemakaian harus lebih dari 0"),
  startDate: Yup.string().nullable(),
  endDate: Yup.string().nullable(),
});

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

const toDateInputValue = (value?: string | null) => {
  if (!value) return "";
  return value.slice(0, 10);
};

export default function VoucherFormModal({ show, onHide, onSubmit, initialData }: Props) {
  const formik = useFormik({
    initialValues: {
      code: "",
      name: "",
      description: "",
      discountType: "percentage",
      discountValue: 0,
      minimumPurchase: 0,
      maximumDiscount: "",
      usageLimit: "",
      startDate: "",
      endDate: "",
      isActive: true,
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit({
        code: values.code.trim().toUpperCase(),
        name: values.name.trim(),
        description: values.description.trim() || null,
        discountType: values.discountType as "percentage" | "fixed",
        discountValue: Number(values.discountValue),
        minimumPurchase: Number(values.minimumPurchase),
        maximumDiscount: values.maximumDiscount === "" ? null : Number(values.maximumDiscount),
        usageLimit: values.usageLimit === "" ? null : Number(values.usageLimit),
        startDate: values.startDate || null,
        endDate: values.endDate || null,
        isActive: values.isActive,
      });
      formik.resetForm();
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    if (initialData) {
      formik.setValues({
        code: initialData.code || "",
        name: initialData.name || "",
        description: initialData.description || "",
        discountType: initialData.discountType || "percentage",
        discountValue: Number(initialData.discountValue ?? 0),
        minimumPurchase: Number(initialData.minimumPurchase ?? 0),
        maximumDiscount:
          initialData.maximumDiscount === null || initialData.maximumDiscount === undefined
            ? ""
            : String(initialData.maximumDiscount),
        usageLimit:
          initialData.usageLimit === null || initialData.usageLimit === undefined
            ? ""
            : String(initialData.usageLimit),
        startDate: toDateInputValue(initialData.startDate),
        endDate: toDateInputValue(initialData.endDate),
        isActive: Boolean(initialData.isActive),
      });
    } else {
      formik.resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData, show]);

  return (
    <Modal show={show} onHide={onHide} centered size="lg" contentClassName="border-0 rounded-4 overflow-hidden shadow">
      <Modal.Header closeButton className="border-0 pb-0 px-4 pt-4">
        <div>
          <Modal.Title style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0f172a" }}>
            {initialData ? "Edit Voucher" : "Tambah Voucher"}
          </Modal.Title>
          <p className="text-muted mb-0 mt-1" style={{ fontSize: "0.85rem" }}>
            {initialData ? "Perbarui aturan voucher" : "Buat kode voucher untuk promosi toko"}
          </p>
        </div>
      </Modal.Header>
      <Form onSubmit={formik.handleSubmit}>
        <Modal.Body className="px-4 py-3">
          <div className="p-3" style={{ borderRadius: 12, border: "1px solid #f1f5f9", background: "#fff" }}>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label style={labelStyle}>Kode Voucher <span style={{ color: "#ef4444" }}>*</span></Form.Label>
                  <Form.Control
                    name="code"
                    value={formik.values.code}
                    onChange={(event) => formik.setFieldValue("code", event.target.value.toUpperCase())}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.code && !!formik.errors.code}
                    placeholder="HEMAT50"
                    style={inputStyle}
                  />
                  <Form.Control.Feedback type="invalid">{formik.errors.code}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label style={labelStyle}>Nama Voucher <span style={{ color: "#ef4444" }}>*</span></Form.Label>
                  <Form.Control
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.name && !!formik.errors.name}
                    placeholder="Diskon akhir bulan"
                    style={inputStyle}
                  />
                  <Form.Control.Feedback type="invalid">{formik.errors.name}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label style={labelStyle}>Deskripsi</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    placeholder="Catatan singkat tentang voucher"
                    style={inputStyle}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label style={labelStyle}>Tipe Diskon <span style={{ color: "#ef4444" }}>*</span></Form.Label>
                  <Form.Select
                    name="discountType"
                    value={formik.values.discountType}
                    onChange={formik.handleChange}
                    style={inputStyle}
                  >
                    <option value="percentage">Persentase</option>
                    <option value="fixed">Nominal</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label style={labelStyle}>Nilai Diskon <span style={{ color: "#ef4444" }}>*</span></Form.Label>
                  <Form.Control
                    type="number"
                    name="discountValue"
                    value={formik.values.discountValue}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.discountValue && !!formik.errors.discountValue}
                    min={0}
                    style={inputStyle}
                  />
                  <Form.Control.Feedback type="invalid">{formik.errors.discountValue}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label style={labelStyle}>Minimum Belanja</Form.Label>
                  <Form.Control
                    type="number"
                    name="minimumPurchase"
                    value={formik.values.minimumPurchase}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.minimumPurchase && !!formik.errors.minimumPurchase}
                    min={0}
                    style={inputStyle}
                  />
                  <Form.Control.Feedback type="invalid">{formik.errors.minimumPurchase}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label style={labelStyle}>Maksimum Diskon</Form.Label>
                  <Form.Control
                    type="number"
                    name="maximumDiscount"
                    value={formik.values.maximumDiscount}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.maximumDiscount && !!formik.errors.maximumDiscount}
                    min={0}
                    placeholder="Opsional"
                    style={inputStyle}
                  />
                  <Form.Control.Feedback type="invalid">{formik.errors.maximumDiscount}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label style={labelStyle}>Batas Pemakaian</Form.Label>
                  <Form.Control
                    type="number"
                    name="usageLimit"
                    value={formik.values.usageLimit}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.usageLimit && !!formik.errors.usageLimit}
                    min={1}
                    placeholder="Tanpa batas"
                    style={inputStyle}
                  />
                  <Form.Control.Feedback type="invalid">{formik.errors.usageLimit}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="pt-md-4 mt-md-1">
                  <Form.Check
                    type="switch"
                    id="voucher-is-active"
                    name="isActive"
                    label="Voucher aktif"
                    checked={formik.values.isActive}
                    onChange={formik.handleChange}
                    style={{ fontSize: "0.9rem", color: "#334155" }}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label style={labelStyle}>Tanggal Mulai</Form.Label>
                  <Form.Control
                    type="date"
                    name="startDate"
                    value={formik.values.startDate}
                    onChange={formik.handleChange}
                    style={inputStyle}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label style={labelStyle}>Tanggal Berakhir</Form.Label>
                  <Form.Control
                    type="date"
                    name="endDate"
                    value={formik.values.endDate}
                    onChange={formik.handleChange}
                    style={inputStyle}
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0 px-4 pb-4 pt-2">
          <Button variant="light" onClick={onHide} style={secondaryButtonStyle}>
            Batal
          </Button>
          <Button type="submit" style={primaryButtonStyle}>
            {initialData ? "Simpan Perubahan" : "Tambah Voucher"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

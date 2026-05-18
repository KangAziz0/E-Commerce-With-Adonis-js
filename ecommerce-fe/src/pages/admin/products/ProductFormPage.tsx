import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Form, Button, Row, Col, Spinner, Image } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FiUpload, FiX, FiArrowLeft } from "react-icons/fi";
import { toast } from "react-toastify";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { fetchCategoriesRequest } from "@/features/categories/categorySlice";
import { fetchBrandsRequest } from "@/features/brands/brandSlice";
import {
  createProductRequest,
  updateProductRequest,
  fetchDetailProductRequest,
} from "@/features/products/productSlice";
import httpClient from "@/lib/httpClient";

interface ProductImageItem {
  id?: number;
  url: string;
  file?: File;
}

const validationSchema = Yup.object({
  name: Yup.string().required("Nama produk wajib diisi"),
  price: Yup.number().required("Harga wajib diisi").min(0, "Harga minimal 0"),
  sku: Yup.string(),
  description: Yup.string(),
  category_id: Yup.number().required("Kategori wajib dipilih"),
  is_active: Yup.boolean(),
});

const cardStyle = {
  borderRadius: 14,
  border: "none",
  boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)",
};

const labelStyle = { fontSize: "0.85rem", fontWeight: 600, color: "#334155" };
const inputStyle = { borderRadius: 8, border: "1px solid #e2e8f0", fontSize: "0.9rem" };

export default function ProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { categories } = useAppSelector((state) => state.categories);
  const { brands } = useAppSelector((state) => state.brands);
  const { detail: productDetail, loading } = useAppSelector((state) => state.products);

  const [images, setImages] = useState<ProductImageItem[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    dispatch(fetchCategoriesRequest());
    dispatch(fetchBrandsRequest());
    if (id) {
      dispatch(fetchDetailProductRequest(Number(id)));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (isEdit && productDetail) {
      formik.setValues({
        name: productDetail.name || "",
        price: productDetail.price || 0,
        sku: productDetail.sku || "",
        description: productDetail.description || "",
        category_id: 0,
        brand_id: 0,
        is_active: true,
      });

      if (productDetail.colors && productDetail.colors.length > 0) {
        const existingImages = productDetail.colors
          .filter((c) => c.image)
          .map((c) => ({ url: c.image }));
        setImages(existingImages);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productDetail, isEdit]);

  const formik = useFormik({
    initialValues: {
      name: "",
      price: 0,
      sku: "",
      description: "",
      category_id: 0,
      brand_id: 0,
      is_active: true,
    },
    validationSchema,
    onSubmit: async (values) => {
      const uploadedUrls: string[] = [];
      for (const img of images) {
        if (img.file) {
          try {
            setUploading(true);
            const formData = new FormData();
            formData.append("file", img.file);
            const res = await httpClient.post("/admin/upload", formData, {
              headers: { "Content-Type": "multipart/form-data" },
            });
            uploadedUrls.push(res.data?.data?.url);
          } catch {
            toast.error("Gagal upload gambar");
          }
        } else if (img.url) {
          uploadedUrls.push(img.url);
        }
      }
      setUploading(false);

      const payload = {
        ...values,
        image_url: uploadedUrls[0] || "",
      } as any;

      if (isEdit && id) {
        dispatch(updateProductRequest({ id: Number(id), ...payload }));
      } else {
        dispatch(createProductRequest(payload));
      }

      toast.success(isEdit ? "Produk berhasil diupdate" : "Produk berhasil ditambahkan");
      navigate("/admin/products");
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newImages: ProductImageItem[] = Array.from(files).map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }));
    setImages((prev) => [...prev, ...newImages]);
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  if (isEdit && loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <Spinner animation="border" style={{ color: "#6366f1" }} />
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h5 className="fw-bold mb-1" style={{ color: "#0f172a" }}>
            {isEdit ? "Edit Produk" : "Tambah Produk Baru"}
          </h5>
          <p className="text-muted mb-0" style={{ fontSize: "0.85rem" }}>
            {isEdit ? "Perbarui informasi produk" : "Isi informasi untuk menambahkan produk baru"}
          </p>
        </div>
        <Button
          variant="light"
          size="sm"
          onClick={() => navigate("/admin/products")}
          className="d-flex align-items-center gap-1"
          style={{ borderRadius: 8, border: "1px solid #e2e8f0", fontWeight: 600, color: "#475569" }}
        >
          <FiArrowLeft size={14} /> Kembali
        </Button>
      </div>

      <Form onSubmit={formik.handleSubmit}>
        <Row className="g-4">
          {/* Left Column */}
          <Col lg={8}>
            <Card style={cardStyle}>
              <Card.Body className="p-4">
                <h6 className="fw-bold mb-3" style={{ color: "#0f172a" }}>Informasi Produk</h6>

                <Form.Group className="mb-3">
                  <Form.Label style={labelStyle}>
                    Nama Produk <span style={{ color: "#ef4444" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.name && !!formik.errors.name}
                    placeholder="Masukkan nama produk"
                    style={inputStyle}
                  />
                  <Form.Control.Feedback type="invalid">{formik.errors.name}</Form.Control.Feedback>
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label style={labelStyle}>
                        Harga <span style={{ color: "#ef4444" }}>*</span>
                      </Form.Label>
                      <Form.Control
                        type="number"
                        name="price"
                        value={formik.values.price}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={formik.touched.price && !!formik.errors.price}
                        placeholder="0"
                        style={inputStyle}
                      />
                      <Form.Control.Feedback type="invalid">{formik.errors.price}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label style={labelStyle}>SKU</Form.Label>
                      <Form.Control
                        name="sku"
                        value={formik.values.sku}
                        onChange={formik.handleChange}
                        placeholder="SKU-001"
                        style={inputStyle}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-0">
                  <Form.Label style={labelStyle}>Deskripsi</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    placeholder="Deskripsi produk"
                    style={inputStyle}
                  />
                </Form.Group>
              </Card.Body>
            </Card>

            {/* Image Upload */}
            <Card style={cardStyle} className="mt-4">
              <Card.Body className="p-4">
                <h6 className="fw-bold mb-1" style={{ color: "#0f172a" }}>Gambar Produk</h6>
                <p className="text-muted mb-3" style={{ fontSize: "0.8rem" }}>
                  Upload gambar produk (Cloudflare R2)
                </p>

                <div className="d-flex flex-wrap gap-3">
                  {images.map((img, index) => (
                    <div
                      key={index}
                      className="position-relative"
                      style={{
                        width: 110,
                        height: 110,
                        borderRadius: 12,
                        overflow: "hidden",
                        border: "2px solid #e2e8f0",
                      }}
                    >
                      <Image
                        src={img.url}
                        alt={`product-${index}`}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="btn btn-sm position-absolute d-flex align-items-center justify-content-center"
                        style={{
                          top: 4,
                          right: 4,
                          width: 22,
                          height: 22,
                          padding: 0,
                          borderRadius: "50%",
                          background: "#ef4444",
                          color: "white",
                          border: "none",
                        }}
                      >
                        <FiX size={11} />
                      </button>
                    </div>
                  ))}

                  <label
                    className="d-flex flex-column align-items-center justify-content-center"
                    style={{
                      width: 110,
                      height: 110,
                      borderRadius: 12,
                      border: "2px dashed #cbd5e1",
                      cursor: "pointer",
                      transition: "border-color 0.2s",
                      background: "#f8fafc",
                    }}
                  >
                    <FiUpload size={22} style={{ color: "#94a3b8" }} />
                    <span style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: 4 }}>Upload</span>
                    <input type="file" accept="image/*" multiple hidden onChange={handleFileSelect} />
                  </label>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Right Column */}
          <Col lg={4}>
            <Card style={cardStyle}>
              <Card.Body className="p-4">
                <h6 className="fw-bold mb-3" style={{ color: "#0f172a" }}>Kategori & Brand</h6>

                <Form.Group className="mb-3">
                  <Form.Label style={labelStyle}>
                    Kategori <span style={{ color: "#ef4444" }}>*</span>
                  </Form.Label>
                  <Form.Select
                    name="category_id"
                    value={formik.values.category_id}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.category_id && !!formik.errors.category_id}
                    style={inputStyle}
                  >
                    <option value={0}>Pilih Kategori</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{formik.errors.category_id}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label style={labelStyle}>Brand</Form.Label>
                  <Form.Select
                    name="brand_id"
                    value={formik.values.brand_id}
                    onChange={formik.handleChange}
                    style={inputStyle}
                  >
                    <option value={0}>Pilih Brand</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>{brand.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Check
                    type="switch"
                    id="is_active"
                    name="is_active"
                    label="Produk Aktif"
                    checked={formik.values.is_active}
                    onChange={formik.handleChange}
                    style={{ fontSize: "0.9rem" }}
                  />
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button
                    type="submit"
                    disabled={uploading || loading}
                    style={{
                      borderRadius: 8,
                      fontWeight: 600,
                      background: "#6366f1",
                      border: "none",
                      padding: "0.6rem",
                      boxShadow: "0 2px 8px rgba(99,102,241,0.3)",
                    }}
                  >
                    {uploading ? (
                      <>
                        <Spinner size="sm" animation="border" className="me-2" />
                        Uploading...
                      </>
                    ) : isEdit ? (
                      "Simpan Perubahan"
                    ) : (
                      "Tambah Produk"
                    )}
                  </Button>
                  <Button
                    variant="light"
                    onClick={() => navigate("/admin/products")}
                    style={{ borderRadius: 8, fontWeight: 600, border: "1px solid #e2e8f0", color: "#475569" }}
                  >
                    Batal
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

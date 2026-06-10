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
import type { ProductVariant } from "@/types/ui/product";

interface ProductImageItem {
  id?: number;
  url: string;
  file?: File;
  hasError?: boolean;
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
  const [variants, setVariants] = useState<ProductVariant[]>([
    { name: "Default", price: 0, stock: 0, isActive: true },
  ]);
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
        category_id: productDetail.categoryId ?? 0,
        brand_id: productDetail.brandId ?? 0,
        is_active: true,
      });

      if (productDetail.images && productDetail.images.length > 0) {
        const existingImages = productDetail.images.map((url) => ({ url }));
        setImages(existingImages);
      } else {
        setImages([]);
      }

      setVariants(
        productDetail.variants && productDetail.variants.length > 0
          ? productDetail.variants
          : [
              {
                name: "Default",
                price: productDetail.price || 0,
                stock: 0,
                isActive: true,
              },
            ],
      );
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
      setUploading(true);
      for (const img of images) {
        if (img.file) {
          try {
            const formData = new FormData();
            formData.append("file", img.file);
            const res = await httpClient.post("/admin/upload", formData, {
              headers: { "Content-Type": "multipart/form-data" },
            });
            const url = res.data?.data?.url;
            if (!url) throw new Error("Upload response tidak berisi URL");
            uploadedUrls.push(url);
          } catch {
            toast.error("Gagal upload gambar");
            setUploading(false);
            return;
          }
        } else if (img.url) {
          uploadedUrls.push(img.url);
        }
      }
      setUploading(false);

      const payload = {
        ...values,
        variants: variants
          .filter((variant) => variant.name.trim())
          .map((variant) => ({
            ...variant,
            price: Number(variant.price || values.price),
            stock: Number(variant.stock || 0),
          })),
        image_urls: uploadedUrls,
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

  const markImageError = (index: number) => {
    setImages((prev) =>
      prev.map((img, i) => (i === index ? { ...img, hasError: true } : img)),
    );
  };

  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      { name: "", price: formik.values.price || 0, stock: 0, isActive: true },
    ]);
  };

  const updateVariant = <K extends keyof ProductVariant>(
    index: number,
    key: K,
    value: ProductVariant[K],
  ) => {
    setVariants((prev) =>
      prev.map((variant, i) =>
        i === index ? { ...variant, [key]: value } : variant,
      ),
    );
  };

  const removeVariant = (index: number) => {
    setVariants((prev) =>
      prev.length > 1 ? prev.filter((_, i) => i !== index) : prev,
    );
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

            <Card style={cardStyle} className="mt-4">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center gap-3 mb-3">
                  <div>
                    <h6 className="fw-bold mb-1" style={{ color: "#0f172a" }}>
                      Varian & Stok
                    </h6>
                    <p className="text-muted mb-0" style={{ fontSize: "0.8rem" }}>
                      Atur varian produk beserta harga dan stoknya.
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    onClick={addVariant}
                    style={{
                      borderRadius: 8,
                      fontWeight: 600,
                      background: "#6366f1",
                      border: "none",
                    }}
                  >
                    Tambah Varian
                  </Button>
                </div>

                <div className="d-flex flex-column gap-3">
                  {variants.map((variant, index) => (
                    <div
                      key={variant.id ?? index}
                      className="p-3"
                      style={{
                        borderRadius: 12,
                        border: "1px solid #f1f5f9",
                        background: "#fff",
                      }}
                    >
                      <Row className="g-3 align-items-end">
                        <Col md={4}>
                          <Form.Group>
                            <Form.Label style={labelStyle}>Nama Varian</Form.Label>
                            <Form.Control
                              value={variant.name}
                              onChange={(e) =>
                                updateVariant(index, "name", e.target.value)
                              }
                              placeholder="Default / Hitam / XL"
                              style={inputStyle}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={3}>
                          <Form.Group>
                            <Form.Label style={labelStyle}>Harga</Form.Label>
                            <Form.Control
                              type="number"
                              min={0}
                              value={variant.price}
                              onChange={(e) =>
                                updateVariant(index, "price", Number(e.target.value))
                              }
                              style={inputStyle}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={2}>
                          <Form.Group>
                            <Form.Label style={labelStyle}>Stok</Form.Label>
                            <Form.Control
                              type="number"
                              min={0}
                              value={variant.stock}
                              onChange={(e) =>
                                updateVariant(index, "stock", Number(e.target.value))
                              }
                              style={inputStyle}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={2}>
                          <Form.Check
                            type="switch"
                            id={`variant-active-${index}`}
                            label="Aktif"
                            checked={variant.isActive}
                            onChange={(e) =>
                              updateVariant(index, "isActive", e.target.checked)
                            }
                            style={{ fontSize: "0.85rem" }}
                          />
                        </Col>
                        <Col md={1}>
                          <Button
                            type="button"
                            variant="light"
                            onClick={() => removeVariant(index)}
                            disabled={variants.length === 1}
                            className="w-100"
                            style={{
                              borderRadius: 8,
                              border: "1px solid #e2e8f0",
                              color: "#ef4444",
                            }}
                            aria-label="Hapus varian"
                          >
                            <FiX />
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  ))}
                </div>
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
                      {img.hasError ? (
                        <div
                          className="d-flex h-100 w-100 flex-column align-items-center justify-content-center px-2 text-center"
                          style={{ background: "#fff1f2", color: "#be123c", fontSize: "0.68rem" }}
                          title={img.url}
                        >
                          <span style={{ fontWeight: 700 }}>Gagal dimuat</span>
                          <span
                            style={{
                              maxWidth: "100%",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {img.url}
                          </span>
                        </div>
                      ) : (
                        <Image
                          src={img.url}
                          alt={`product-${index}`}
                          onError={() => markImageError(index)}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      )}
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

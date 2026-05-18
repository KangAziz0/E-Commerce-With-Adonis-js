import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Form, Button, Row, Col, Spinner, Image } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FiUpload, FiX } from "react-icons/fi";
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
  uploading?: boolean;
}

const validationSchema = Yup.object({
  name: Yup.string().required("Nama produk wajib diisi"),
  price: Yup.number().required("Harga wajib diisi").min(0, "Harga minimal 0"),
  sku: Yup.string(),
  description: Yup.string(),
  category_id: Yup.number().required("Kategori wajib dipilih"),
  is_active: Yup.boolean(),
});

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
        category_id: 0, // will be resolved from categories
        brand_id: 0,
        is_active: true,
      });

      // Map existing images
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
      // Upload images first if there are new files
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
        <Spinner animation="border" variant="success" />
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">
          {isEdit ? "Edit Produk" : "Tambah Produk Baru"}
        </h4>
        <Button variant="outline-secondary" size="sm" onClick={() => navigate("/admin/products")}>
          Kembali
        </Button>
      </div>

      <Form onSubmit={formik.handleSubmit}>
        <Row className="g-4">
          {/* Left: Main info */}
          <Col md={8}>
            <Card className="border-0 shadow-sm rounded-4">
              <Card.Body className="p-4">
                <h6 className="fw-bold mb-3">Informasi Produk</h6>

                <Form.Group className="mb-3">
                  <Form.Label>Nama Produk *</Form.Label>
                  <Form.Control
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.name && !!formik.errors.name}
                    placeholder="Masukkan nama produk"
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.name}
                  </Form.Control.Feedback>
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Harga *</Form.Label>
                      <Form.Control
                        type="number"
                        name="price"
                        value={formik.values.price}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={formik.touched.price && !!formik.errors.price}
                        placeholder="0"
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.price}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>SKU</Form.Label>
                      <Form.Control
                        name="sku"
                        value={formik.values.sku}
                        onChange={formik.handleChange}
                        placeholder="SKU-001"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Deskripsi</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    placeholder="Deskripsi produk"
                  />
                </Form.Group>
              </Card.Body>
            </Card>

            {/* Image Upload */}
            <Card className="border-0 shadow-sm rounded-4 mt-4">
              <Card.Body className="p-4">
                <h6 className="fw-bold mb-3">Gambar Produk</h6>
                <p className="text-muted small mb-3">
                  Upload gambar produk (disimpan ke Cloudflare R2)
                </p>

                <div className="d-flex flex-wrap gap-3 mb-3">
                  {images.map((img, index) => (
                    <div
                      key={index}
                      className="position-relative"
                      style={{
                        width: 120,
                        height: 120,
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
                        className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: 24, height: 24, padding: 0 }}
                      >
                        <FiX size={12} />
                      </button>
                    </div>
                  ))}

                  {/* Upload Button */}
                  <label
                    className="d-flex flex-column align-items-center justify-content-center"
                    style={{
                      width: 120,
                      height: 120,
                      borderRadius: 12,
                      border: "2px dashed #cbd5e1",
                      cursor: "pointer",
                      transition: "border-color 0.2s",
                    }}
                  >
                    <FiUpload size={24} className="text-muted" />
                    <span className="text-muted small mt-1">Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      hidden
                      onChange={handleFileSelect}
                    />
                  </label>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Right: Sidebar */}
          <Col md={4}>
            <Card className="border-0 shadow-sm rounded-4">
              <Card.Body className="p-4">
                <h6 className="fw-bold mb-3">Kategori & Brand</h6>

                <Form.Group className="mb-3">
                  <Form.Label>Kategori *</Form.Label>
                  <Form.Select
                    name="category_id"
                    value={formik.values.category_id}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.category_id && !!formik.errors.category_id}
                  >
                    <option value={0}>Pilih Kategori</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.category_id}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Brand</Form.Label>
                  <Form.Select
                    name="brand_id"
                    value={formik.values.brand_id}
                    onChange={formik.handleChange}
                  >
                    <option value={0}>Pilih Brand</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
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
                  />
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button
                    variant="success"
                    type="submit"
                    disabled={uploading || loading}
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
                    variant="outline-secondary"
                    onClick={() => navigate("/admin/products")}
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

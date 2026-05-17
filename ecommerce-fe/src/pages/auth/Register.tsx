import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Col, Container, Form as RBForm, Row } from "react-bootstrap";
import { useFormik } from "formik";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import * as Yup from "yup";

import { env } from "@/config/env";
import { AUTH_STORAGE_KEYS } from "@/constants/auth";
import { registerRequest } from "@/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";

const RegisterSchema = Yup.object().shape({
  name: Yup.string().required("Username wajib diisi"),
  email: Yup.string()
    .email("Format email tidak valid")
    .required("Email wajib diisi"),
  password: Yup.string()
    .min(6, "Password minimal 6 karakter")
    .required("Password wajib diisi"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Password tidak cocok")
    .required("Konfirmasi password wajib diisi"),
});

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, otpSent } = useAppSelector((state) => state.auth.register);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formik = useFormik({
    initialValues: { name: "", email: "", password: "", confirmPassword: "" },
    enableReinitialize: true,
    validationSchema: RegisterSchema,
    onSubmit: ({ confirmPassword: _ignored, ...values }) => {
      dispatch(registerRequest(values));
    },
  });

  useEffect(() => {
    if (otpSent) {
      localStorage.setItem(AUTH_STORAGE_KEYS.otpEmail, formik.values.email);
      navigate(`/verify-otp?type=register`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otpSent]);

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        paddingTop: "40px",
        paddingBottom: "40px",
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8} lg={5} xl={4}>
            <div className="text-center mb-4">
              <h1 className="fw-bold mb-2" style={{ fontSize: "24px" }}>
                Buat Akun Baru
              </h1>
              <p className="text-muted small mb-0">
                Bergabung dan mulai belanja sekarang
              </p>
            </div>

            <div
              style={{
                backgroundColor: "white",
                borderRadius: "16px",
                padding: "32px",
                border: "1px solid #e5e7eb",
              }}
            >
              <RBForm onSubmit={formik.handleSubmit}>
                <RBForm.Group className="mb-3">
                  <RBForm.Label className="fw-semibold small">
                    Username
                  </RBForm.Label>
                  <RBForm.Control
                    type="text"
                    name="name"
                    placeholder="Masukkan username"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={!!formik.touched.name && !!formik.errors.name}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <div
                      style={{
                        color: "#dc2626",
                        fontSize: "12px",
                        marginTop: "6px",
                      }}
                    >
                      {formik.errors.name}
                    </div>
                  )}
                </RBForm.Group>

                <RBForm.Group className="mb-3">
                  <RBForm.Label className="fw-semibold small">
                    Email
                  </RBForm.Label>
                  <RBForm.Control
                    type="text"
                    name="email"
                    placeholder="Masukkan email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={!!formik.touched.email && !!formik.errors.email}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <div
                      style={{
                        color: "#dc2626",
                        fontSize: "12px",
                        marginTop: "6px",
                      }}
                    >
                      {formik.errors.email}
                    </div>
                  )}
                </RBForm.Group>

                <RBForm.Group className="mb-3">
                  <RBForm.Label className="fw-semibold small">
                    Kata Sandi
                  </RBForm.Label>
                  <div style={{ position: "relative" }}>
                    <RBForm.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Masukkan kata sandi"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={
                        !!formik.touched.password && !!formik.errors.password
                      }
                      style={{ paddingRight: "48px" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      style={{
                        position: "absolute",
                        right: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        color: "#6b7280",
                        cursor: "pointer",
                        padding: "4px",
                        display: "flex",
                        alignItems: "center",
                      }}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <FaEyeSlash size={18} />
                      ) : (
                        <FaEye size={18} />
                      )}
                    </button>
                  </div>
                  {formik.touched.password && formik.errors.password && (
                    <div
                      style={{
                        color: "#dc2626",
                        fontSize: "12px",
                        marginTop: "6px",
                      }}
                    >
                      {formik.errors.password}
                    </div>
                  )}
                </RBForm.Group>

                <RBForm.Group className="mb-4">
                  <RBForm.Label className="fw-semibold small">
                    Konfirmasi Kata Sandi
                  </RBForm.Label>
                  <div style={{ position: "relative" }}>
                    <RBForm.Control
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Masukkan ulang kata sandi"
                      value={formik.values.confirmPassword}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={
                        !!formik.touched.confirmPassword &&
                        !!formik.errors.confirmPassword
                      }
                      style={{ paddingRight: "48px" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((s) => !s)}
                      style={{
                        position: "absolute",
                        right: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        color: "#6b7280",
                        cursor: "pointer",
                        padding: "4px",
                        display: "flex",
                        alignItems: "center",
                      }}
                      aria-label={
                        showConfirmPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showConfirmPassword ? (
                        <FaEyeSlash size={18} />
                      ) : (
                        <FaEye size={18} />
                      )}
                    </button>
                  </div>
                  {formik.touched.confirmPassword &&
                    formik.errors.confirmPassword && (
                      <div
                        style={{
                          color: "#dc2626",
                          fontSize: "12px",
                          marginTop: "6px",
                        }}
                      >
                        {formik.errors.confirmPassword}
                      </div>
                    )}
                </RBForm.Group>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-100 fw-semibold"
                  style={{
                    padding: "14px",
                    backgroundColor: "#000",
                    border: "none",
                    borderRadius: "8px",
                    marginBottom: "16px",
                  }}
                >
                  {loading ? "Memproses..." : "Daftar"}
                </Button>

                <Button
                  type="button"
                  variant="light"
                  className="w-100 d-flex align-items-center justify-content-center gap-2"
                  style={{
                    padding: "12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                  }}
                  onClick={() => {
                    window.location.href = `${env.backendUrl}/auth/google`;
                  }}
                >
                  Lanjutkan dengan Google
                </Button>
              </RBForm>
            </div>

            <div className="text-center mt-3">
              <p className="small text-muted mb-0">
                Sudah punya akun?{" "}
                <a
                  href="/login"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/login");
                  }}
                  className="text-dark fw-semibold text-decoration-none"
                >
                  Masuk
                </a>
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

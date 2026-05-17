import { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useFormik } from "formik";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

import { env } from "@/config/env";
import { AUTH_STORAGE_KEYS } from "@/constants/auth";
import { loginRequest } from "@/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";

const LoginSchema = Yup.object({
  email: Yup.string()
    .email("Format email tidak valid")
    .required("Email wajib diisi"),
  password: Yup.string()
    .min(6, "Password minimal 6 karakter")
    .required("Password wajib diisi"),
});

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, otpSent } = useAppSelector((state) => state.auth.login);

  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    enableReinitialize: true,
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      dispatch(loginRequest(values));
    },
  });

  useEffect(() => {
    if (otpSent) {
      localStorage.setItem(AUTH_STORAGE_KEYS.otpEmail, formik.values.email);
      navigate(`/verify-otp?type=login`);
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
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "56px",
                  height: "56px",
                  backgroundColor: "#000",
                  borderRadius: "12px",
                  marginBottom: "16px",
                }}
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
              </div>
              <h1
                style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "#111827",
                  marginBottom: "8px",
                }}
              >
                Masuk ke Akun Anda
              </h1>
              <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>
                Belanja mudah dimulai dari sini
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
              <Form onSubmit={formik.handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold small">
                    Email atau Nomor HP
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="email"
                    placeholder="Masukkan email atau nomor HP"
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
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold small">
                    Kata Sandi
                  </Form.Label>
                  <div style={{ position: "relative" }}>
                    <Form.Control
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
                </Form.Group>

                <div className="text-end mb-4">
                  <a
                    href="#"
                    className="text-dark text-decoration-none small fw-semibold"
                  >
                    Lupa kata sandi?
                  </a>
                </div>

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
                  {loading ? "Memproses..." : "Masuk"}
                </Button>

                <div
                  className="d-flex align-items-center"
                  style={{ margin: "24px 0" }}
                >
                  <div
                    style={{
                      flex: 1,
                      height: "1px",
                      backgroundColor: "#e5e7eb",
                    }}
                  />
                  <span
                    className="px-3 small"
                    style={{ color: "#9ca3af", fontSize: "12px" }}
                  >
                    atau
                  </span>
                  <div
                    style={{
                      flex: 1,
                      height: "1px",
                      backgroundColor: "#e5e7eb",
                    }}
                  />
                </div>

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
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Lanjutkan dengan Google
                </Button>
              </Form>
            </div>

            <div className="text-center mt-3">
              <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>
                Belum punya akun?{" "}
                <a
                  href="/register"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/register");
                  }}
                  style={{
                    color: "#000",
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  Daftar
                </a>
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { loginRequest } from "@/features/auth/authSlice";
import { RootState } from "@/store/store";

const LoginSchema = Yup.object({
  email: Yup.string()
    .email("Format email tidak valid")
    .required("Email wajib diisi"),
  password: Yup.string()
    .min(6, "Password minimal 6 karakter")
    .required("Password wajib diisi"),
});

export default function Login() {
  const dispatch = useDispatch();
  const { loading, otpSent } = useSelector(
    (state: RootState) => state.auth.login,
  );
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    enableReinitialize: true,
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      dispatch(loginRequest(values));
    },
  });

  useEffect(() => {
    if (otpSent) {
      localStorage.setItem("otpEmail", formik.values.email);
      navigate(`/verify-otp?type=login`);
    }
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
            {/* Logo / Brand */}
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "56px",
                  height: "56px",
                  backgroundColor: "#059669",
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
                  fontWeight: "700",
                  color: "#111827",
                  marginBottom: "8px",
                }}
              >
                Masuk ke Akun Anda
              </h1>
              <p
                style={{
                  fontSize: "14px",
                  color: "#6b7280",
                  margin: 0,
                }}
              >
                Belanja mudah dimulai dari sini
              </p>
            </div>

            {/* Login Form Card */}
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "16px",
                padding: "32px",
                border: "1px solid #e5e7eb",
              }}
            >
              <Form onSubmit={formik.handleSubmit}>
                {/* Email Input */}
                <Form.Group className="mb-3">
                  <Form.Label
                    style={{
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: "8px",
                      display: "block",
                    }}
                  >
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
                    style={{
                      padding: "12px 16px",
                      fontSize: "14px",
                      borderRadius: "8px",
                      border: "1px solid #d1d5db",
                      backgroundColor: "#ffffff",
                      transition: "all 0.2s",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#059669";
                      e.target.style.outline = "none";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(5, 150, 105, 0.08)";
                    }}
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

                {/* Password Input */}
                <Form.Group className="mb-3">
                  <Form.Label
                    style={{
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: "8px",
                      display: "block",
                    }}
                  >
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
                      style={{
                        padding: "12px 16px",
                        paddingRight: "48px",
                        fontSize: "14px",
                        borderRadius: "8px",
                        border: "1px solid #d1d5db",
                        backgroundColor: "#ffffff",
                        transition: "all 0.2s",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#059669";
                        e.target.style.outline = "none";
                        e.target.style.boxShadow =
                          "0 0 0 3px rgba(5, 150, 105, 0.08)";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
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

                {/* Forgot Password */}
                <div className="text-end mb-4">
                  <a
                    href="#"
                    style={{
                      color: "#059669",
                      textDecoration: "none",
                      fontSize: "13px",
                      fontWeight: "500",
                    }}
                  >
                    Lupa kata sandi?
                  </a>
                </div>

                {/* Login Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "14px",
                    fontSize: "15px",
                    fontWeight: "600",
                    backgroundColor: "#059669",
                    border: "none",
                    borderRadius: "8px",
                    marginBottom: "16px",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.currentTarget.style.backgroundColor = "#047857";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#059669";
                  }}
                >
                  {loading ? (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span
                        style={{
                          width: "16px",
                          height: "16px",
                          border: "2px solid #ffffff",
                          borderTopColor: "transparent",
                          borderRadius: "50%",
                          display: "inline-block",
                          animation: "spin 0.8s linear infinite",
                        }}
                      />
                      Memproses...
                    </span>
                  ) : (
                    "Masuk"
                  )}
                </Button>

                {/* Divider */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    margin: "24px 0",
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      height: "1px",
                      backgroundColor: "#e5e7eb",
                    }}
                  />
                  <span
                    style={{
                      padding: "0 12px",
                      fontSize: "12px",
                      color: "#9ca3af",
                    }}
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

                {/* Google Login */}
                <Button
                  type="button"
                  style={{
                    width: "100%",
                    padding: "12px",
                    fontSize: "14px",
                    fontWeight: "500",
                    backgroundColor: "white",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    color: "#374151",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    transition: "all 0.2s",
                  }}
                  onClick={() => {
                    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/google`;
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f9fafb";
                    e.currentTarget.style.borderColor = "#9ca3af";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "white";
                    e.currentTarget.style.borderColor = "#d1d5db";
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

            {/* Register Link */}
            <div
              style={{
                textAlign: "center",
                marginTop: "24px",
              }}
            >
              <p
                style={{
                  fontSize: "14px",
                  color: "#6b7280",
                  margin: 0,
                }}
              >
                Belum punya akun?{" "}
                <a
                  href="/register"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/register");
                  }}
                  style={{
                    color: "#059669",
                    textDecoration: "none",
                    fontWeight: "600",
                  }}
                >
                  Daftar
                </a>
              </p>
            </div>

            {/* Terms */}
            <div
              style={{
                textAlign: "center",
                marginTop: "32px",
                fontSize: "12px",
                color: "#9ca3af",
                lineHeight: "1.5",
              }}
            >
              Dengan masuk, Anda menyetujui{" "}
              <a
                href="#"
                style={{
                  color: "#059669",
                  textDecoration: "none",
                }}
              >
                Syarat & Ketentuan
              </a>{" "}
              dan{" "}
              <a
                href="#"
                style={{
                  color: "#059669",
                  textDecoration: "none",
                }}
              >
                Kebijakan Privasi
              </a>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Add spinning animation */}
      <style>
        {`
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
}

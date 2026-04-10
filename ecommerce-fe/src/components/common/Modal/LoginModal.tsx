import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { loginRequest } from "@/features/auth/authSlice";

type Props = {
  show: boolean;
  onHide: () => void;
};

type View = "login" | "method";

const LoginSchema = Yup.object({
  email: Yup.string()
    .email("Format email tidak valid")
    .required("Email wajib diisi"),
  password: Yup.string()
    .min(6, "Password minimal 6 karakter")
    .required("Password wajib diisi"),
});

export default function LoginModal({ show, onHide }: Props) {
  const dispatch = useDispatch();

  const [view, setView] = useState<View>("login");
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

  const navigate = useNavigate();

  const handleClose = () => {
    // onHide();
    // formik.resetForm();
    // reset state saat modal ditutup
    // setTimeout(() => {
    //   setView("login");
    //   setShowPassword(false);
    // }, 300);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Body className="p-4">
        {view === "login" ? (
          <>
            {/* Header */}
            <div className="d-flex justify-content-between align-items-start mb-4">
              <h4 className="fw-bold mb-0">Masuk</h4>
              <div className="d-flex align-items-center gap-3">
                <span
                  onClick={() => {
                    (navigate("/register"), onHide());
                  }}
                  className="text-dark"
                  role="button"
                  style={{ cursor: "pointer", fontSize: "14px" }}
                >
                  Daftar
                </span>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleClose}
                  aria-label="Close"
                />
              </div>
            </div>

            {/* Form */}
            <Form onSubmit={formik.handleSubmit}>
              <Form.Group className="mb-1">
                <Form.Label className="text-muted" style={{ fontSize: "13px" }}>
                  Nomor HP atau Email
                </Form.Label>
                <Form.Control
                  type="text"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="border-success"
                  style={{ borderRadius: "8px" }}
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
              <Form.Group className="mb-4">
                <Form.Label className="text-muted" style={{ fontSize: "13px" }}>
                  Kata Sandi
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    name="password"
                    className="border-success"
                    placeholder="Masukkan kata sandi"
                    type={showPassword ? "text" : "password"}
                    value={formik.values.password}
                    onBlur={formik.handleBlur} // 🔥 WAJIB
                    onChange={formik.handleChange}
                    style={{ borderRadius: "8px 0 0 8px" }}
                    isInvalid={
                      !!formik.touched.password && !!formik.errors.password
                    }
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
                </InputGroup>
              </Form.Group>
              <div className="text-end mb-3">
                <span
                  className="text-dark"
                  role="button"
                  style={{ cursor: "pointer", fontSize: "13px" }}
                >
                  Lupa kata sandi?
                </span>
              </div>
              <Button
                type="submit"
                variant="dark"
                className="w-100 fw-semibold mb-2"
                disabled={!formik.isValid || formik.isSubmitting}
              >
                Masuk
              </Button>
            </Form>

            {/* Divider */}
            <div
              className="d-flex align-items-center gap-2 mb-3"
              style={{ color: "#aaa", fontSize: "13px" }}
            >
              <hr className="flex-grow-1 m-0" />
              <span>atau masuk dengan</span>
              <hr className="flex-grow-1 m-0" />
            </div>

            {/* Metode Lain */}
            <Button
              variant="outline-dark"
              className="w-100 fw-semibold"
              style={{ borderRadius: "8px" }}
              onClick={() => setView("method")}
            >
              Metode Lain
            </Button>
          </>
        ) : (
          <>
            {/* Header Metode Lain */}
            <div className="d-flex align-items-center justify-content-between mb-4">
              <button
                type="button"
                className="btn btn-link p-0 text-dark"
                onClick={() => setView("login")}
                aria-label="Kembali"
                style={{ fontSize: "18px", textDecoration: "none" }}
              >
                <FaArrowLeft />
              </button>
              <h6 className="fw-semibold mb-0">Pilih Akun Untuk Masuk</h6>
              <button
                type="button"
                className="btn-close"
                onClick={handleClose}
                aria-label="Close"
              />
            </div>

            {/* Google Button */}
            <Button
              variant="outline-dark"
              className="w-100 d-flex align-items-center justify-content-center gap-2"
              style={{ borderRadius: "8px", padding: "10px" }}
            >
              {/* Google Icon SVG */}
              <svg
                width="18"
                height="18"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                />
                <path fill="none" d="M0 0h48v48H0z" />
              </svg>
              <span className="fw-semibold">Google</span>
            </Button>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
}

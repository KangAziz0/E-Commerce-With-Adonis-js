import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginRequest } from "../features/auth/authSlice";
import { RootState } from "../store/store";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginRequest({ email, password }));
  };

  const navigate = useNavigate();

  return (
    <div
      style={{
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
        paddingTop: "40px",
        paddingBottom: "40px",
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={10} lg={8}>
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <Row className="g-0">
                {/* Left Side - Image/Illustration */}
                <Col
                  md={6}
                  className="d-none d-md-block"
                  style={{
                    background:
                      "linear-gradient(135deg, #00AA5B 0%, #00D26A 100%)",
                    padding: "60px 40px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "white",
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        width: "200px",
                        height: "200px",
                        backgroundColor: "rgba(255,255,255,0.2)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 30px",
                      }}
                    >
                      <svg
                        width="100"
                        height="100"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                    <h3 style={{ fontWeight: "bold", marginBottom: "15px" }}>
                      Belanja Kebutuhan Sehari-hari Jadi Mudah
                    </h3>
                    <p style={{ fontSize: "14px", opacity: 0.9 }}>
                      Masuk untuk mendapatkan pengalaman belanja terbaik dengan
                      berbagai promo menarik
                    </p>
                  </div>
                </Col>

                {/* Right Side - Login Form */}
                <Col xs={12} md={6} style={{ padding: "50px 40px" }}>
                  <div>
                    <h2
                      style={{
                        fontWeight: "bold",
                        marginBottom: "10px",
                        fontSize: "28px",
                      }}
                    >
                      Masuk
                    </h2>
                    <p
                      style={{
                        color: "#6c757d",
                        marginBottom: "30px",
                        fontSize: "14px",
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
                          color: "#00AA5B",
                          textDecoration: "none",
                          fontWeight: "600",
                        }}
                      >
                        Daftar
                      </a>
                    </p>

                    {error && (
                      <Alert variant="danger" className="mb-3">
                        {error}
                      </Alert>
                    )}

                    <Form onSubmit={handleLogin}>
                      {/* Phone/Email Input */}
                      <Form.Group className="mb-3">
                        <Form.Label
                          style={{
                            fontSize: "14px",
                            fontWeight: "600",
                            marginBottom: "8px",
                          }}
                        >
                          Nomor HP atau Email
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Contoh: email@tokoku.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          style={{
                            padding: "12px 16px",
                            fontSize: "14px",
                            borderRadius: "8px",
                            border: "1px solid #ddd",
                          }}
                          required
                        />
                      </Form.Group>

                      {/* Password Input */}
                      <Form.Group className="mb-2">
                        <Form.Label
                          style={{
                            fontSize: "14px",
                            fontWeight: "600",
                            marginBottom: "8px",
                          }}
                        >
                          Kata Sandi
                        </Form.Label>
                        <div style={{ position: "relative" }}>
                          <Form.Control
                            type={showPassword ? "text" : "password"}
                            placeholder="Masukkan kata sandi"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                              padding: "12px 16px",
                              paddingRight: "45px",
                              fontSize: "14px",
                              borderRadius: "8px",
                              border: "1px solid #ddd",
                            }}
                            required
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
                              color: "#00AA5B",
                              fontSize: "12px",
                              fontWeight: "600",
                              cursor: "pointer",
                            }}
                          >
                            {showPassword ? "Sembunyikan" : "Lihat"}
                          </button>
                        </div>
                      </Form.Group>

                      <div className="text-end mb-4">
                        <a
                          href="#"
                          style={{
                            color: "#00AA5B",
                            textDecoration: "none",
                            fontSize: "13px",
                            fontWeight: "600",
                          }}
                        >
                          Lupa kata sandi?
                        </a>
                      </div>

                      {/* Login Button */}
                      <Button
                        type="submit"
                        disabled={loading || !email || !password}
                        style={{
                          width: "100%",
                          padding: "14px",
                          fontSize: "16px",
                          fontWeight: "bold",
                          backgroundColor: "#00AA5B",
                          border: "none",
                          borderRadius: "8px",
                          marginBottom: "20px",
                        }}
                      >
                        {loading ? "Memproses..." : "Masuk"}
                      </Button>

                      {/* Divider */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          margin: "20px 0",
                          color: "#6c757d",
                          fontSize: "13px",
                        }}
                      >
                        <div
                          style={{
                            flex: 1,
                            height: "1px",
                            backgroundColor: "#ddd",
                          }}
                        ></div>
                        <span style={{ padding: "0 15px" }}>
                          atau masuk dengan
                        </span>
                        <div
                          style={{
                            flex: 1,
                            height: "1px",
                            backgroundColor: "#ddd",
                          }}
                        ></div>
                      </div>

                      {/* Social Login Buttons */}
                      <Row className="g-2">
                        <Col xs={12}>
                          <Button
                            variant="outline-secondary"
                            style={{
                              width: "100%",
                              padding: "10px",
                              fontSize: "14px",
                              borderRadius: "8px",
                              border: "1px solid #ddd",
                              backgroundColor: "white",
                              color: "#333",
                              fontWeight: "600",
                            }}
                          >
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              style={{ marginRight: "8px" }}
                            >
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
                            Google
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                </Col>
              </Row>
            </div>

            {/* Additional Info */}
            <div
              style={{
                textAlign: "center",
                marginTop: "20px",
                fontSize: "12px",
                color: "#6c757d",
              }}
            >
              Dengan masuk, saya menyetujui{" "}
              <a href="#" style={{ color: "#00AA5B", textDecoration: "none" }}>
                Syarat & Ketentuan
              </a>{" "}
              serta{" "}
              <a href="#" style={{ color: "#00AA5B", textDecoration: "none" }}>
                Kebijakan Privasi
              </a>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

import { useState, useRef, useEffect } from "react";
import { Card, Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  verifyLoginOtpRequest,
  verifyRegisterOtpRequest,
} from "../../features/auth/authSlice";
import { RootState } from "../../store/store";

const OTP_LENGTH = 6;

export default function VerifyOtp() {
  const { success: registerSuccess } = useSelector(
    (state: RootState) => state.auth.registerOtp
  );
  const { success: loginSuccess } = useSelector(
    (state: RootState) => state.auth.loginOtp
  );

  const dispatch = useDispatch();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const navigate = useNavigate();

  /**
   * state dari login / register
   */
  const email = localStorage.getItem("otpEmail") || "";
  const type = searchParams.get("type") || "";
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const inputsRef = useRef<HTMLInputElement[]>([]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: any, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    const code = otp.join("");

    if (code.length < OTP_LENGTH) return;

    const payload = {
      email,
      otp: code,
    };

    if (type === "login") {
      dispatch(verifyLoginOtpRequest(payload));
    } else {
      dispatch(verifyRegisterOtpRequest(payload));
    }
  };

  useEffect(() => {
    if (registerSuccess) {
      navigate("/login");
    } else if (loginSuccess) {
      navigate("/");
    }
  }, [loginSuccess, registerSuccess]);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Card
        className="shadow-sm border-0"
        style={{ width: "100%", maxWidth: "420px" }}
      >
        <Card.Body className="p-4">
          <h4 className="fw-bold mb-2 text-center">Masukkan Kode Verifikasi</h4>

          <p className="text-muted text-center mb-4">
            Kode verifikasi telah dikirim ke <br />
            <strong>{email}</strong>
          </p>

          <Form>
            <div className="d-flex justify-content-center gap-2 mb-4">
              {otp.map((digit, index) => (
                <Form.Control
                  key={index}
                  ref={(el) => {
                    if (el) inputsRef.current[index] = el;
                  }}
                  type="text"
                  value={digit}
                  maxLength={1}
                  className="text-center fs-4 fw-bold"
                  style={{
                    width: "48px",
                    height: "56px",
                  }}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
            </div>

            <Button
              className="w-100 fw-semibold"
              size="lg"
              onClick={handleSubmit}
            >
              Verifikasi
            </Button>
          </Form>

          <div className="text-center mt-3">
            <small className="text-muted">
              Tidak menerima kode?{" "}
              <span
                className="text-success fw-semibold"
                style={{ cursor: "pointer" }}
              >
                Kirim ulang
              </span>
            </small>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

import { AUTH_STORAGE_KEYS, OTP_LENGTH } from "@/constants/auth";
import {
  resendOtpRequest,
  verifyLoginOtpRequest,
  verifyRegisterOtpRequest,
} from "@/features/auth/authSlice";
import type { OtpPurpose } from "@/features/auth/auth.types";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";

export default function VerifyOtp() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { success: registerSuccess } = useAppSelector(
    (state) => state.auth.registerOtp,
  );
  const { success: loginSuccess } = useAppSelector(
    (state) => state.auth.loginOtp,
  );
  const { loading: resendLoading } = useAppSelector(
    (state) => state.auth.resendOtp,
  );

  const email = localStorage.getItem(AUTH_STORAGE_KEYS.otpEmail) ?? "";
  const purpose = (new URLSearchParams(location.search).get("type") ??
    "login") as OtpPurpose;

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const inputsRef = useRef<HTMLInputElement[]>([]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    const code = otp.join("");
    if (code.length < OTP_LENGTH) return;
    const payload = { email, otp: code };
    if (purpose === "login") {
      dispatch(verifyLoginOtpRequest(payload));
    } else {
      dispatch(verifyRegisterOtpRequest(payload));
    }
  };

  useEffect(() => {
    if (registerSuccess) navigate("/login");
    else if (loginSuccess) navigate("/");
  }, [loginSuccess, registerSuccess, navigate]);

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
                  ref={(el: HTMLInputElement | null) => {
                    if (el) inputsRef.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  value={digit}
                  maxLength={1}
                  className="text-center fs-4 fw-bold"
                  style={{ width: "48px", height: "56px" }}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) =>
                    handleKeyDown(
                      e as React.KeyboardEvent<HTMLInputElement>,
                      index,
                    )
                  }
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
                onClick={() =>
                  dispatch(resendOtpRequest({ email, purpose }))
                }
              >
                {resendLoading ? "Loading..." : "Kirim ulang"}
              </span>
            </small>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

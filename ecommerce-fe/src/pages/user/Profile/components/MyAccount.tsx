import { useRef, useState } from "react";
import { Button, Col, Form, Image, Row, Spinner } from "react-bootstrap";
import { FaCamera, FaTrash, FaUserEdit } from "react-icons/fa";
import { toast } from "react-toastify";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  updateProfileRequest,
  uploadAvatarRequest,
} from "@/features/auth/authSlice";

const ALLOWED_AVATAR_MIME = ["image/png", "image/jpg", "image/jpeg", "image/webp"];
const MAX_AVATAR_SIZE_MB = 2;

const MyAccount = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const profileLoading = useAppSelector(
    (state) => state.auth.profile?.loading ?? false
  );
  const avatarLoading = useAppSelector(
    (state) => state.auth.avatarUpload?.loading ?? false
  );

  const fileRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [name, setName] = useState(user?.name ?? "");
  const [isEditing, setIsEditing] = useState(false);

  if (!user) return null;

  const onChangeAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_AVATAR_MIME.includes(file.type)) {
      toast.error("Tipe file tidak didukung. Gunakan JPG, PNG, atau WebP.");
      return;
    }
    if (file.size / 1024 / 1024 > MAX_AVATAR_SIZE_MB) {
      toast.error(`Ukuran file maksimal ${MAX_AVATAR_SIZE_MB}MB`);
      return;
    }

    setPreview(URL.createObjectURL(file));

    // Upload to R2 via backend
    const formData = new FormData();
    formData.append("avatar", file);
    dispatch(uploadAvatarRequest(formData));
  };

  const handleRemovePreview = () => {
    setPreview(null);
    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      toast.error("Nama minimal 2 karakter");
      return;
    }
    dispatch(updateProfileRequest({ name: name.trim() }));
    setIsEditing(false);
  };

  const avatarSrc = preview || user.avatar || "/images/default-avatar.jpg";

  return (
    <div>
      {/* Avatar Section */}
      <div className="mb-4 pb-4 border-bottom">
        <h6 className="fw-bold mb-3 text-dark">Foto Profil</h6>
        <div className="d-flex align-items-center gap-4">
          <div className="position-relative">
            <Image
              src={avatarSrc}
              width={110}
              height={110}
              roundedCircle
              className="border"
              style={{
                objectFit: "cover",
                border: "3px solid #e9ecef",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
            />

            {avatarLoading && (
              <div
                className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center rounded-circle"
                style={{ background: "rgba(0,0,0,0.5)" }}
              >
                <Spinner animation="border" size="sm" variant="light" />
              </div>
            )}

            <Form.Control
              type="file"
              accept="image/png,image/jpg,image/jpeg,image/webp"
              ref={fileRef}
              hidden
              onChange={onChangeAvatar}
            />

            <div
              onClick={() => !avatarLoading && fileRef.current?.click()}
              className="position-absolute d-flex align-items-center justify-content-center rounded-circle"
              style={{
                width: 36,
                height: 36,
                bottom: 0,
                right: 0,
                background: "linear-gradient(135deg, #00AA5B, #00C96B)",
                cursor: avatarLoading ? "not-allowed" : "pointer",
                boxShadow: "0 3px 8px rgba(0,170,91,0.3)",
                transition: "transform 0.2s",
              }}
              title="Ganti foto profil"
            >
              <FaCamera size={14} color="#fff" />
            </div>
          </div>

          <div>
            <p className="mb-1 fw-semibold text-dark" style={{ fontSize: 15 }}>
              Upload Foto Baru
            </p>
            <p className="text-muted small mb-2">
              Format: JPG, PNG, WebP. Maksimal 2MB.
            </p>
            <div className="d-flex gap-2">
              <Button
                size="sm"
                variant="outline-success"
                onClick={() => fileRef.current?.click()}
                disabled={avatarLoading}
              >
                <FaCamera size={12} className="me-1" />
                Pilih Foto
              </Button>
              {preview && (
                <Button
                  size="sm"
                  variant="outline-danger"
                  onClick={handleRemovePreview}
                  disabled={avatarLoading}
                >
                  <FaTrash size={12} className="me-1" />
                  Batal
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Info Section */}
      <div>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h6 className="fw-bold mb-0 text-dark">Informasi Profil</h6>
          {!isEditing && (
            <Button
              size="sm"
              variant="outline-success"
              onClick={() => setIsEditing(true)}
            >
              <FaUserEdit size={12} className="me-1" />
              Edit
            </Button>
          )}
        </div>

        <Form onSubmit={handleSaveProfile}>
          <Row>
            <Col xs={12} md={6} className="mb-3">
              <Form.Group>
                <Form.Label className="small fw-semibold text-muted">
                  Nama Lengkap
                </Form.Label>
                {isEditing ? (
                  <Form.Control
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Masukkan nama lengkap"
                    style={{
                      borderRadius: 10,
                      padding: "10px 14px",
                      borderColor: "#dee2e6",
                    }}
                  />
                ) : (
                  <div
                    className="p-2 px-3 rounded-3"
                    style={{ background: "#f8f9fa", fontSize: 15 }}
                  >
                    {user.name}
                  </div>
                )}
              </Form.Group>
            </Col>

            <Col xs={12} md={6} className="mb-3">
              <Form.Group>
                <Form.Label className="small fw-semibold text-muted">
                  Email
                </Form.Label>
                <div
                  className="p-2 px-3 rounded-3 d-flex align-items-center gap-2"
                  style={{ background: "#f8f9fa", fontSize: 15 }}
                >
                  {user.email}
                  <span
                    className="badge rounded-pill"
                    style={{
                      background: "#e8f8ef",
                      color: "#00AA5B",
                      fontSize: 10,
                    }}
                  >
                    Terverifikasi
                  </span>
                </div>
              </Form.Group>
            </Col>
          </Row>

          {isEditing && (
            <div className="d-flex gap-2 mt-2">
              <Button
                type="submit"
                disabled={profileLoading}
                style={{
                  background: "linear-gradient(135deg, #00AA5B, #00C96B)",
                  border: "none",
                  borderRadius: 10,
                  padding: "10px 24px",
                  fontWeight: 600,
                }}
              >
                {profileLoading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Menyimpan...
                  </>
                ) : (
                  "Simpan Perubahan"
                )}
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() => {
                  setIsEditing(false);
                  setName(user.name);
                }}
                disabled={profileLoading}
                style={{ borderRadius: 10, padding: "10px 24px" }}
              >
                Batal
              </Button>
            </div>
          )}
        </Form>
      </div>
    </div>
  );
};

export default MyAccount;

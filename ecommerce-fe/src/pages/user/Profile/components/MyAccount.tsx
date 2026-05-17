import { useRef, useState } from "react";
import { Col, Form, Image } from "react-bootstrap";
import { toast } from "react-toastify";

import { useAppSelector } from "@/hooks/redux";

const ALLOWED_AVATAR_MIME = ["image/png", "image/jpg", "image/jpeg"];
const MAX_AVATAR_SIZE_MB = 2;

const MyAccount = () => {
  const user = useAppSelector((state) => state.auth.user);

  const fileRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  if (!user) return null;

  const onChangeAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_AVATAR_MIME.includes(file.type)) {
      toast.error("Tipe file tidak didukung");
      return;
    }
    if (file.size / 1024 / 1024 > MAX_AVATAR_SIZE_MB) {
      toast.error(`Ukuran file maksimal ${MAX_AVATAR_SIZE_MB}MB`);
      return;
    }

    setPreview(URL.createObjectURL(file));
    toast.info("Avatar siap diupload");
    // TODO: dispatch(updateAvatarRequest(formData)) once endpoint exists.
  };

  return (
    <Form>
      <Form.Group as={Col} className="mb-4">
        <Form.Label>Avatar</Form.Label>
        <div className="position-relative" style={{ width: 200 }}>
          <Image
            src={preview || user.avatar || "/images/default-avatar.jpg"}
            width={200}
            height={200}
            rounded
            className="border"
            style={{ objectFit: "cover" }}
          />
          <Form.Control
            type="file"
            accept="image/*"
            ref={fileRef}
            hidden
            onChange={onChangeAvatar}
          />
          <div
            onClick={() => fileRef.current?.click()}
            className="position-absolute bg-success text-white rounded-circle d-flex align-items-center justify-content-center"
            style={{
              width: 32,
              height: 32,
              top: 8,
              right: 8,
              cursor: "pointer",
            }}
          >
            ✎
          </div>
        </div>
        <small className="text-muted">JPG / PNG maksimal 2MB</small>
      </Form.Group>

      <Form.Group as={Col} className="mb-3">
        <Form.Label>Nama</Form.Label>
        <Form.Control value={user.name} disabled />
      </Form.Group>

      <Form.Group as={Col}>
        <Form.Label>Email</Form.Label>
        <Form.Control value={user.email} disabled />
      </Form.Group>
    </Form>
  );
};

export default MyAccount;

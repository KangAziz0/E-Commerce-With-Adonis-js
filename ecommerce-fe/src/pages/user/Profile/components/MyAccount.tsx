import React, { useState } from "react";
import { Col, Form, Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store/store";
import { toast } from "react-toastify";

const MyAccount = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  const fileRef = React.useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  if (!user) return null;

  const onChangeAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["image/png", "image/jpg", "image/jpeg"];
    if (!allowed.includes(file.type)) {
      toast.error("Tipe file tidak didukung");
      return;
    }

    if (file.size / 1024 / 1024 > 2) {
      toast.error("Ukuran file maksimal 2MB");
      return;
    }

    setPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("avatar", file);

    toast.info("Avatar siap diupload");
    // dispatch(updateAvatarRequest(formData))
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

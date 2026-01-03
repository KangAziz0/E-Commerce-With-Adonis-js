import React, { useRef, useState } from "react";
import { Image } from "react-bootstrap";
import { Col, FormGroup, Input, Label } from "reactstrap";
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

    // 🔥 NANTI GANTI INI KE SAGA
    const formData = new FormData();
    formData.append("avatar", file);

    toast.info("Avatar siap diupload");
    // dispatch(updateAvatarRequest(formData))
  };

  return (
    <>
      <FormGroup row>
        <Label sm={3}>Avatar</Label>
        <Col sm={9}>
          <div className="position-relative" style={{ width: 200 }}>
            <Image
              src={preview || user.avatar || "/images/default-avatar.jpg"}
              width={200}
              height={200}
              rounded
              className="border"
              style={{ objectFit: "cover" }}
            />

            <Input
              type="file"
              accept="image/*"
              innerRef={fileRef}
              hidden
              onChange={onChangeAvatar}
            />

            <Label
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
            </Label>
          </div>

          <small className="text-muted">JPG / PNG maksimal 2MB</small>
        </Col>
      </FormGroup>

      <FormGroup row>
        <Label sm={3}>Nama</Label>
        <Col sm={9}>
          <Input value={user.name} disabled />
        </Col>
      </FormGroup>

      <FormGroup row>
        <Label sm={3}>Email</Label>
        <Col sm={9}>
          <Input value={user.email} disabled />
        </Col>
      </FormGroup>
    </>
  );
};

export default MyAccount;

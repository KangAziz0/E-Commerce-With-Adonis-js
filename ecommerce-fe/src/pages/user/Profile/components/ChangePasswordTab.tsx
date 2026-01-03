import { FormGroup, Label, Input } from "reactstrap";
import { Button } from "react-bootstrap";

const ChangePassword = () => {
  return (
    <div style={{ maxWidth: 400 }}>
      <FormGroup>
        <Label>Password Lama</Label>
        <Input type="password" />
      </FormGroup>

      <FormGroup>
        <Label>Password Baru</Label>
        <Input type="password" />
      </FormGroup>

      <FormGroup>
        <Label>Konfirmasi Password</Label>
        <Input type="password" />
      </FormGroup>

      <Button
        className="mt-3"
        style={{ background: "#00AA5B", border: "none" }}
      >
        Simpan Password
      </Button>
    </div>
  );
};

export default ChangePassword;

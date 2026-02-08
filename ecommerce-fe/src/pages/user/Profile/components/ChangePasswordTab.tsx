import { Form, Button } from "react-bootstrap";

const ChangePassword = () => {
  return (
    <div style={{ maxWidth: 400 }}>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Password Lama</Form.Label>
          <Form.Control type="password" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password Baru</Form.Label>
          <Form.Control type="password" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Konfirmasi Password</Form.Label>
          <Form.Control type="password" />
        </Form.Group>

        <Button
          className="mt-3 w-100"
          style={{ background: "#00AA5B", border: "none" }}
        >
          Simpan Password
        </Button>
      </Form>
    </div>
  );
};

export default ChangePassword;

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  variant?: "danger" | "primary";
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog = ({
  open,
  title,
  description,
  confirmText = "Ya",
  cancelText = "Batal",
  loading = false,
  variant = "primary",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  return (
    <Modal
      show={open}
      onHide={onCancel}
      centered
      backdrop="static"
      keyboard={!loading}
    >
      <Modal.Header closeButton={!loading}>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {description && <p className="mb-0">{description}</p>}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          {cancelText}
        </Button>

        <Button variant={variant} onClick={onConfirm} disabled={loading}>
          {loading ? "Memproses..." : confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmDialog;

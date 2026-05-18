import { Modal, Button } from "react-bootstrap";
import { FiAlertTriangle } from "react-icons/fi";

interface Props {
  show: boolean;
  onHide: () => void;
  onConfirm: () => void;
  itemName: string;
  title?: string;
  message?: string;
}

export default function DeleteConfirmModal({
  show,
  onHide,
  onConfirm,
  itemName,
  title = "Konfirmasi Hapus",
  message,
}: Props) {
  return (
    <Modal show={show} onHide={onHide} centered size="sm">
      <Modal.Body className="text-center px-4 pt-4 pb-3">
        <div
          className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
          style={{
            width: 56,
            height: 56,
            background: "rgba(239, 68, 68, 0.1)",
            color: "#ef4444",
          }}
        >
          <FiAlertTriangle size={24} />
        </div>
        <h6 className="fw-bold mb-2" style={{ color: "#0f172a" }}>
          {title}
        </h6>
        <p className="text-muted mb-0" style={{ fontSize: "0.875rem" }}>
          {message || (
            <>
              Apakah Anda yakin ingin menghapus{" "}
              <strong style={{ color: "#334155" }}>{itemName}</strong>?
              <br />
              Tindakan ini tidak dapat dibatalkan.
            </>
          )}
        </p>
      </Modal.Body>
      <Modal.Footer className="border-0 px-4 pb-4 pt-2 justify-content-center gap-2">
        <Button
          variant="light"
          size="sm"
          onClick={onHide}
          style={{
            borderRadius: 8,
            fontWeight: 600,
            padding: "0.5rem 1.25rem",
            border: "1px solid #e2e8f0",
            color: "#475569",
          }}
        >
          Batal
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={onConfirm}
          style={{
            borderRadius: 8,
            fontWeight: 600,
            padding: "0.5rem 1.25rem",
            background: "#ef4444",
            border: "none",
            boxShadow: "0 2px 6px rgba(239,68,68,0.3)",
          }}
        >
          Hapus
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

import { Modal, Button } from "react-bootstrap";

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
      <Modal.Header closeButton>
        <Modal.Title className="fs-6">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="mb-0">
          {message || (
            <>
              Apakah Anda yakin ingin menghapus{" "}
              <strong>{itemName}</strong>? Tindakan ini tidak dapat dibatalkan.
            </>
          )}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" size="sm" onClick={onHide}>
          Batal
        </Button>
        <Button variant="danger" size="sm" onClick={onConfirm}>
          Hapus
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

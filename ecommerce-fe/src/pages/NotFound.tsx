import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="text-center col-md-6">
        <h1 className="fw-bold text-success display-1">404</h1>

        <h4 className="fw-semibold mt-3">Waduh, halaman nggak ditemukan 😥</h4>

        <p className="text-muted mt-2">
          Sepertinya halaman yang kamu cari sudah dipindahkan atau tidak
          tersedia.
        </p>

        <div className="d-flex justify-content-center gap-3 mt-4">
          <Link to="/" className="btn btn-success px-4">
            Kembali ke Beranda
          </Link>

          <Link to="/" className="btn btn-outline-success px-4">
            Belanja Lagi
          </Link>
        </div>
      </div>
    </div>
  );
}

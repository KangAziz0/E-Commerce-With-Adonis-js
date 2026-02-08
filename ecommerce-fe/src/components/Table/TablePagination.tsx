export const TablePagination = ({
  pageIndex,
  pageCount,
  canPrev,
  canNext,
  onPageChange,
}: {
  pageIndex: number;
  pageCount: number;
  canPrev: boolean;
  canNext: boolean;
  onPageChange: (page: number) => void;
}) => {
  const pages = Array.from({ length: pageCount }, (_, i) => i);

  return (
    <div className="d-flex align-items-center gap-1">
      <button
        className="btn btn-light btn-sm rounded-pill px-3"
        disabled={!canPrev}
        onClick={() => onPageChange(pageIndex - 1)}
      >
        ← Prev
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`btn btn-sm rounded-pill px-3 ${
            page === pageIndex
              ? "btn-success text-white"
              : "btn-outline-secondary"
          }`}
        >
          {page + 1}
        </button>
      ))}

      <button
        className="btn btn-light btn-sm rounded-pill px-3"
        disabled={!canNext}
        onClick={() => onPageChange(pageIndex + 1)}
      >
        Next →
      </button>
    </div>
  );
};

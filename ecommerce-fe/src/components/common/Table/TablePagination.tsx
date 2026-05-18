import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

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
  // Show max 5 page buttons
  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(0, pageIndex - Math.floor(maxVisible / 2));
    const end = Math.min(pageCount, start + maxVisible);
    start = Math.max(0, end - maxVisible);

    for (let i = start; i < end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="d-flex align-items-center gap-1">
      <button
        className="btn btn-sm d-flex align-items-center justify-content-center"
        disabled={!canPrev}
        onClick={() => onPageChange(pageIndex - 1)}
        style={{
          width: 30,
          height: 30,
          borderRadius: 8,
          border: "1px solid #e2e8f0",
          color: canPrev ? "#334155" : "#cbd5e1",
          background: "white",
          padding: 0,
        }}
      >
        <FiChevronLeft size={14} />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className="btn btn-sm d-flex align-items-center justify-content-center"
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            border: page === pageIndex ? "none" : "1px solid #e2e8f0",
            background: page === pageIndex ? "#6366f1" : "white",
            color: page === pageIndex ? "white" : "#475569",
            fontWeight: page === pageIndex ? 600 : 500,
            fontSize: "0.8rem",
            padding: 0,
          }}
        >
          {page + 1}
        </button>
      ))}

      <button
        className="btn btn-sm d-flex align-items-center justify-content-center"
        disabled={!canNext}
        onClick={() => onPageChange(pageIndex + 1)}
        style={{
          width: 30,
          height: 30,
          borderRadius: 8,
          border: "1px solid #e2e8f0",
          color: canNext ? "#334155" : "#cbd5e1",
          background: "white",
          padding: 0,
        }}
      >
        <FiChevronRight size={14} />
      </button>
    </div>
  );
};

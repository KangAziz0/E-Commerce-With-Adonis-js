import React from "react";
import {
  Table,
  Button,
  Form,
  InputGroup,
  Card,
  Dropdown,
  Spinner,
} from "react-bootstrap";

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";

import {
  FiSearch,
  FiColumns,
  FiChevronUp,
  FiChevronDown,
} from "react-icons/fi";
import { TablePagination } from "./TablePagination";

/* =======================
   Types
======================= */
interface DataTableProps<T> {
  title?: string;
  columns: ColumnDef<T, any>[];
  data: T[];
  loading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  showColumnToggle?: boolean;
  showFooter?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearchSubmit?: (value: string) => void;
  toolbarContent?: React.ReactNode;
  serverPagination?: {
    total: number;
    perPage: number;
    currentPage: number;
    lastPage: number;
    onPageChange: (page: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
  };
  onCreate?: () => void;
  createButtonText?: string;
  actions?: Array<{
    icon: React.ReactNode;
    title: string;
    variant: string;
    onClick: (row: T) => void;
  }>;
  onRowClick?: (row: T) => void;
}

/* =======================
   DataTable Component
======================= */
export default function DataTable<T>({
  title,
  columns,
  data,
  loading = false,
  searchable = true,
  searchPlaceholder = "Cari data...",
  showColumnToggle = true,
  showFooter = true,
  searchValue,
  onSearchChange,
  onSearchSubmit,
  toolbarContent,
  serverPagination,
  onCreate,
  createButtonText = "Tambah Data",
  actions,
  onRowClick,
}: DataTableProps<T>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const totalRows = table.getFilteredRowModel().rows.length;
  const isServerPaginated = Boolean(serverPagination);
  const pageIndex = isServerPaginated
    ? (serverPagination?.currentPage ?? 1) - 1
    : table.getState().pagination.pageIndex;
  const pageSize = isServerPaginated
    ? (serverPagination?.perPage ?? data.length)
    : table.getState().pagination.pageSize;
  const displayedTotalRows = serverPagination?.total ?? totalRows;
  const displayedRowCount = isServerPaginated
    ? data.length
    : table.getRowModel().rows.length;
  const startRow =
    displayedTotalRows === 0 ? 0 : pageIndex * pageSize + (displayedRowCount ? 1 : 0);
  const endRow = isServerPaginated
    ? Math.min(pageIndex * pageSize + displayedRowCount, displayedTotalRows)
    : Math.min((pageIndex + 1) * pageSize, displayedTotalRows);
  const searchInputValue = searchValue ?? globalFilter;

  const handleSearchChange = (value: string) => {
    if (onSearchChange) {
      onSearchChange(value);
      return;
    }

    setGlobalFilter(value);
  };

  const handleSearchSubmit = () => {
    onSearchSubmit?.(searchInputValue);
  };

  return (
    <Card
      className="border-0 overflow-hidden"
      style={{
        borderRadius: 14,
        boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)",
      }}
    >
      {/* ═══════ Header ═══════ */}
      <Card.Header
        className="border-0 px-4 py-3"
        style={{ background: "#fff" }}
      >
        <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap">
          <div>
            <h5
              className="fw-bold mb-0"
              style={{ color: "#0f172a", fontSize: "1.1rem" }}
            >
              {title}
            </h5>
          </div>

          <div className="d-flex align-items-center gap-2 flex-wrap">
            {/* Search */}
            {searchable && (
              <InputGroup size="sm" style={{ width: 220 }}>
                <InputGroup.Text
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRight: "none",
                    color: "#94a3b8",
                  }}
                >
                  <FiSearch size={14} />
                </InputGroup.Text>
                <Form.Control
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderLeft: "none",
                    fontSize: "0.85rem",
                  }}
                  className="p-2"
                  placeholder={searchPlaceholder}
                  value={searchInputValue}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearchSubmit();
                  }}
                  disabled={loading}
                />
              </InputGroup>
            )}

            {toolbarContent}

            {/* Column Visibility */}
            {showColumnToggle && (
            <Dropdown align="end">
              <Dropdown.Toggle
                variant="light"
                disabled={loading}
                className="d-flex align-items-center gap-1 p-2"
                style={{
                  border: "1px solid #e2e8f0",
                  color: "#475569",
                  fontSize: "0.8rem",
                  fontWeight: 500,
                }}
              >
                <FiColumns size={14} /> Kolom
              </Dropdown.Toggle>

              <Dropdown.Menu
                style={{
                  maxHeight: 280,
                  overflowY: "auto",
                  borderRadius: 12,
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                  padding: "0.25rem",
                }}
              >
                <Dropdown.Header
                  style={{ fontSize: "0.75rem", fontWeight: 600 }}
                >
                  Tampilkan Kolom
                </Dropdown.Header>
                {table.getAllLeafColumns().map((column) => {
                  if (!column.columnDef.header) return null;
                  return (
                    <Dropdown.Item
                      key={column.id}
                      as="div"
                      onClick={(e) => e.stopPropagation()}
                      style={{ borderRadius: 6 }}
                    >
                      <Form.Check
                        type="checkbox"
                        id={`column-${column.id}`}
                        label={
                          typeof column.columnDef.header === "string"
                            ? column.columnDef.header
                            : column.id
                        }
                        checked={column.getIsVisible()}
                        onChange={column.getToggleVisibilityHandler()}
                        style={{ fontSize: "0.85rem" }}
                      />
                    </Dropdown.Item>
                  );
                })}
              </Dropdown.Menu>
            </Dropdown>
            )}

            {/* Create Button */}
            {onCreate && (
              <Button
                size="sm"
                onClick={onCreate}
                disabled={loading}
                className="d-flex align-items-center gap-1 p-2"
                style={{
                  background: "#6366f1",
                  border: "none",
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  boxShadow: "0 2px 6px rgba(99,102,241,0.25)",
                }}
              >
                <span>{createButtonText}</span>
              </Button>
            )}
          </div>
        </div>
      </Card.Header>

      {/* ═══════ Table Body ═══════ */}
      <Card.Body className="p-0">
        <div className="table-responsive">
          <Table hover className="mb-0" style={{ fontSize: "0.875rem" }}>
            <thead>
              {table.getHeaderGroups().map((group) => (
                <tr key={group.id} style={{ background: "#f8fafc" }}>
                  {group.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 border-0"
                      style={{
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        color: "#64748b",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        borderBottom: "1px solid #f1f5f9",
                      }}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className="d-flex align-items-center gap-1 user-select-none"
                          onClick={header.column.getToggleSortingHandler()}
                          style={{
                            cursor: header.column.getCanSort()
                              ? "pointer"
                              : "default",
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {header.column.getCanSort() && (
                            <span style={{ opacity: 0.5 }}>
                              {header.column.getIsSorted() === "asc" ? (
                                <FiChevronUp size={12} />
                              ) : header.column.getIsSorted() === "desc" ? (
                                <FiChevronDown size={12} />
                              ) : (
                                <FiChevronUp
                                  size={12}
                                  style={{ opacity: 0.3 }}
                                />
                              )}
                            </span>
                          )}
                        </div>
                      )}
                    </th>
                  ))}
                  {actions && (
                    <th
                      className="text-center px-4 py-3 border-0"
                      style={{
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        color: "#64748b",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        borderBottom: "1px solid #f1f5f9",
                      }}
                    >
                      Aksi
                    </th>
                  )}
                </tr>
              ))}
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={columns.length + (actions ? 1 : 0)}
                    className="text-center py-5"
                  >
                    <Spinner
                      animation="border"
                      role="status"
                      style={{ color: "#6366f1", width: 32, height: 32 }}
                    />
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (actions ? 1 : 0)}
                    className="text-center py-5"
                  >
                    <div className="py-4">
                      <div
                        className="mb-2"
                        style={{ fontSize: "2.5rem", opacity: 0.15 }}
                      >
                        <FiSearch />
                      </div>
                      <h6
                        className="fw-semibold mb-1"
                        style={{ color: "#334155" }}
                      >
                        Tidak ada data
                      </h6>
                      <p
                        className="text-muted mb-0"
                        style={{ fontSize: "0.85rem" }}
                      >
                        {globalFilter
                          ? "Coba ubah kata kunci pencarian Anda"
                          : "Belum ada data yang tersedia"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => onRowClick && onRowClick(row.original)}
                    style={{
                      cursor: onRowClick ? "pointer" : "default",
                      transition: "background-color 0.12s ease",
                    }}
                    className="align-middle"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-4 py-3"
                        style={{ color: "#334155", borderColor: "#f1f5f9" }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                    {actions && (
                      <td
                        className="text-center px-4 py-3"
                        style={{ borderColor: "#f1f5f9" }}
                      >
                        <div className="d-flex justify-content-center gap-1">
                          {actions.map((action, i) => (
                            <Button
                              key={i}
                              size="sm"
                              variant={`outline-${action.variant}`}
                              title={action.title}
                              onClick={(e) => {
                                e.stopPropagation();
                                action.onClick(row.original);
                              }}
                              className="d-flex align-items-center justify-content-center"
                              style={{
                                width: 30,
                                height: 30,
                                borderRadius: 8,
                                padding: 0,
                              }}
                            >
                              {action.icon}
                            </Button>
                          ))}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </Card.Body>

      {/* ═══════ Footer ═══════ */}
      {showFooter && (
      <Card.Footer
        className="border-0 px-4 py-3"
        style={{ background: "#fff", borderTop: "1px solid #f1f5f9" }}
      >
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div className="text-muted" style={{ fontSize: "0.8rem" }}>
            Menampilkan <strong style={{ color: "#334155" }}>{endRow}</strong>{" "}
            dari{" "}
            <strong style={{ color: "#334155" }}>{displayedTotalRows}</strong>{" "}
            data
            {startRow > 0 && endRow > startRow && (
              <span>
                {" "}
                ({startRow}-{endRow})
              </span>
            )}
          </div>

          <div className="d-flex align-items-center gap-3">
            <div className="d-flex align-items-center gap-2">
              <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                Baris
              </span>
              <Form.Select
                size="sm"
                style={{
                  maxWidth: 72,
                  fontSize: "0.8rem",
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                }}
                value={pageSize}
                onChange={(e) => {
                  const nextPageSize = Number(e.target.value);
                  if (serverPagination?.onPageSizeChange) {
                    serverPagination.onPageSizeChange(nextPageSize);
                    return;
                  }
                  table.setPageSize(nextPageSize);
                }}
                disabled={loading || (isServerPaginated && !serverPagination?.onPageSizeChange)}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </Form.Select>
            </div>

            <TablePagination
              pageIndex={pageIndex}
              pageCount={serverPagination?.lastPage ?? table.getPageCount()}
              canPrev={
                isServerPaginated
                  ? (serverPagination?.currentPage ?? 1) > 1
                  : table.getCanPreviousPage()
              }
              canNext={
                isServerPaginated
                  ? (serverPagination?.currentPage ?? 1) <
                    (serverPagination?.lastPage ?? 1)
                  : table.getCanNextPage()
              }
              onPageChange={(page) => {
                if (serverPagination) {
                  serverPagination.onPageChange(page + 1);
                  return;
                }
                table.setPageIndex(page);
              }}
            />
          </div>
        </div>
      </Card.Footer>
      )}
    </Card>
  );
}

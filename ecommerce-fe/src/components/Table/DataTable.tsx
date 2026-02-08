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
   Skeleton Row
======================= */
const SkeletonRow = ({ columns }: { columns: number }) => (
  <tr>
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i} className="px-4 py-3">
        <div
          className="bg-secondary bg-opacity-25 rounded animate-pulse"
          style={{ height: 16 }}
        />
      </td>
    ))}
  </tr>
);

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
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;

  // const startRow = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
  const endRow = Math.min((pageIndex + 1) * pageSize, totalRows);

  /* =======================
     Render
  ======================= */
  return (
    <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
      {/* ================= Card Header ================= */}
      <Card.Header className="bg-white border-0 px-4 py-4">
        <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap">
          {/* Left: Title */}
          <div>
            <h5 className="fw-bold mb-1">{title}</h5>
          </div>

          {/* Right: Search, Column Visibility, Create Button */}
          <div className="d-flex align-items-center gap-2 flex-wrap">
            {/* Search */}
            {searchable && (
              <InputGroup size="sm" style={{ width: 240 }}>
                <InputGroup.Text className="bg-light border-end-0">
                  🔍
                </InputGroup.Text>
                <Form.Control
                  className="border-start-0 bg-light"
                  placeholder={searchPlaceholder}
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  disabled={loading}
                />
              </InputGroup>
            )}

            {/* Column Visibility Toggle */}
            <Dropdown align="end">
              <Dropdown.Toggle
                variant="outline-secondary"
                size="sm"
                disabled={loading}
              >
                👁️ Kolom
              </Dropdown.Toggle>

              <Dropdown.Menu style={{ maxHeight: 300, overflowY: "auto" }}>
                <Dropdown.Header>Tampilkan Kolom</Dropdown.Header>
                {table.getAllLeafColumns().map((column) => {
                  // Skip columns without header (like action columns)
                  if (!column.columnDef.header) return null;

                  return (
                    <Dropdown.Item
                      key={column.id}
                      as="div"
                      onClick={(e) => e.stopPropagation()}
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
                      />
                    </Dropdown.Item>
                  );
                })}
              </Dropdown.Menu>
            </Dropdown>

            {/* Create Button */}
            {onCreate && (
              <Button
                size="sm"
                variant="success"
                onClick={onCreate}
                disabled={loading}
                className="d-flex align-items-center gap-1 px-2 rounded"
              >
                <span>{createButtonText}</span>
              </Button>
            )}
          </div>
        </div>
      </Card.Header>

      {/* ================= Table ================= */}
      <Card.Body className="p-0">
        <div className="table-responsive" style={{ borderRadius: "0.5rem" }}>
          <Table hover className="mb-0">
            <thead className="bg-light">
              {table.getHeaderGroups().map((group) => (
                <tr key={group.id}>
                  {group.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 fw-semibold text-secondary"
                      style={{ fontSize: "0.875rem" }}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className="d-flex align-items-center gap-2 user-select-none"
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
                            <span
                              className="text-muted"
                              style={{ fontSize: "0.75rem" }}
                            >
                              {header.column.getIsSorted() === "asc"
                                ? "▲"
                                : header.column.getIsSorted() === "desc"
                                  ? "▼"
                                  : "⇅"}
                            </span>
                          )}
                        </div>
                      )}
                    </th>
                  ))}
                  {actions && (
                    <th
                      className="text-center px-4 py-3 fw-semibold text-secondary"
                      style={{ fontSize: "0.875rem" }}
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
                    <Spinner animation="border" role="status" />
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                // Empty State
                <tr>
                  <td
                    colSpan={columns.length + (actions ? 1 : 0)}
                    className="text-center py-5"
                  >
                    <div className="py-4">
                      <div
                        className="mb-3"
                        style={{ fontSize: "3rem", opacity: 0.3 }}
                      >
                        📭
                      </div>
                      <h6 className="fw-bold mb-2">Tidak ada data</h6>
                      <p className="text-muted mb-0">
                        {globalFilter
                          ? "Coba ubah pencarian Anda"
                          : "Belum ada data yang tersedia"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                // Data Rows
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => onRowClick && onRowClick(row.original)}
                    style={{
                      cursor: onRowClick ? "pointer" : "default",
                      transition: "background-color 0.15s ease",
                    }}
                    className="align-middle"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                    {actions && (
                      <td className="text-center px-4 py-3">
                        <div className="d-flex justify-content-center gap-2">
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
                              style={{ width: 32, height: 32 }}
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

      {/* ================= Card Footer ================= */}
      <Card.Footer className="bg-white border-0 px-4 py-3">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          {/* Info */}
          <div className="text-muted" style={{ fontSize: "0.875rem" }}>
            Menampilkan <strong className="text-dark">{endRow}</strong> dari{" "}
            <strong className="text-dark">{totalRows}</strong> data
          </div>

          {/* Controls */}
          <div className="d-flex align-items-center gap-3">
            {/* Page Size Selector */}

            <label>Show</label>
            <Form.Select
              size="sm"
              style={{ maxWidth: 80 }}
              value={pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              disabled={loading}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={250}>250</option>
              <option value={500}>500</option>
            </Form.Select>

            {/* Pagination */}
            <TablePagination
              pageIndex={pageIndex}
              pageCount={table.getPageCount()}
              canPrev={table.getCanPreviousPage()}
              canNext={table.getCanNextPage()}
              onPageChange={(page) => table.setPageIndex(page)}
            />
          </div>
        </div>
      </Card.Footer>
    </Card>
  );
}

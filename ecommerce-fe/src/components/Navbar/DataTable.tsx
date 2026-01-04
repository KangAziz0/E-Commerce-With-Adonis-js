import React from "react";
import {
  Table,
  Button,
  Form,
  InputGroup,
  Card,
  Pagination,
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
} from "@tanstack/react-table";

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

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
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

  return (
    <div>
      {/* Header */}
      {(title || onCreate || searchable) && (
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            {title && (
              <div>
                <h2 className="mb-1 fw-bold">{title}</h2>
              </div>
            )}
            {onCreate && (
              <Button
                variant="success"
                onClick={onCreate}
                className="d-flex align-items-center gap-2"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                {createButtonText}
              </Button>
            )}
          </div>

          {/* Search */}
          {searchable && (
            <div className="row">
              <div className="col-md-6">
                <InputGroup>
                  <InputGroup.Text>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder={searchPlaceholder}
                    value={globalFilter ?? ""}
                    onChange={(e: any) => setGlobalFilter(e.target.value)}
                  />
                </InputGroup>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0">
            <thead className="bg-light">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-4 py-3">
                      {header.isPlaceholder ? null : (
                        <div
                          className={
                            header.column.getCanSort()
                              ? "cursor-pointer user-select-none"
                              : ""
                          }
                          onClick={header.column.getToggleSortingHandler()}
                          style={{
                            cursor: header.column.getCanSort()
                              ? "pointer"
                              : "default",
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.getCanSort() && (
                            <span className="ms-1">
                              {header.column.getIsSorted() === "asc" ? (
                                <svg
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                >
                                  <path d="M7 14l5-5 5 5z" />
                                </svg>
                              ) : header.column.getIsSorted() === "desc" ? (
                                <svg
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                >
                                  <path d="M7 10l5 5 5-5z" />
                                </svg>
                              ) : (
                                <svg
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  opacity="0.3"
                                >
                                  <path d="M7 14l5-5 5 5z" />
                                  <path d="M7 10l5 5 5-5z" />
                                </svg>
                              )}
                            </span>
                          )}
                        </div>
                      )}
                    </th>
                  ))}
                  {actions && <th className="py-3 text-center">Aksi</th>}
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
                    <div className="spinner-border text-success" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (actions ? 1 : 0)}
                    className="text-center py-5 text-muted"
                  >
                    Tidak ada data ditemukan
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => onRowClick && onRowClick(row.original)}
                    style={{ cursor: onRowClick ? "pointer" : "default" }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                    {actions && (
                      <td className="py-3">
                        <div className="d-flex justify-content-center gap-2">
                          {actions.map((action, index) => (
                            <Button
                              key={index}
                              variant={`outline-${action.variant}`}
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                action.onClick(row.original);
                              }}
                              title={action.title}
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
        </Card.Body>
      </Card>

      {/* Pagination */}
      {table.getPageCount() > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-4">
          <div className="text-muted">
            Menampilkan{" "}
            {table.getState().pagination.pageIndex *
              table.getState().pagination.pageSize +
              1}{" "}
            -{" "}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) *
                table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}{" "}
            dari {table.getFilteredRowModel().rows.length} data
          </div>

          <Pagination className="mb-0">
            <Pagination.First
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            />
            <Pagination.Prev
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            />

            {[...Array(table.getPageCount())].map((_, index) => (
              <Pagination.Item
                key={index}
                active={index === table.getState().pagination.pageIndex}
                onClick={() => table.setPageIndex(index)}
              >
                {index + 1}
              </Pagination.Item>
            ))}

            <Pagination.Next
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            />
            <Pagination.Last
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            />
          </Pagination>
        </div>
      )}
    </div>
  );
}

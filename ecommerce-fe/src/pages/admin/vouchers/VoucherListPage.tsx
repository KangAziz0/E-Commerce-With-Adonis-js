import { useEffect, useState } from "react";
import { Badge } from "react-bootstrap";
import { ColumnDef } from "@tanstack/react-table";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

import DataTable from "@/components/common/Table/DataTable";
import DeleteConfirmModal from "@/components/common/Modal/DeleteConfirmModal";
import {
  deleteVoucherRequest,
  fetchVouchersRequest,
  saveVoucherRequest,
} from "@/features/vouchers/voucherSlice";
import type { SaveVoucherPayload, Voucher } from "@/features/vouchers/voucher.types";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { formatRupiahCurrency } from "@/utils/currency";
import VoucherFormModal from "./VoucherFormModal";

const formatDate = (value: string | null) => {
  if (!value) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
};

const formatDiscount = (row: Voucher) => {
  if (row.discountType === "percentage") return `${Number(row.discountValue)}%`;
  return formatRupiahCurrency(Number(row.discountValue));
};

const columns: ColumnDef<Voucher, any>[] = [
  {
    accessorKey: "code",
    header: "Kode",
    cell: ({ row }) => (
      <span style={{ fontWeight: 700, color: "#0f172a" }}>{row.original.code}</span>
    ),
  },
  {
    accessorKey: "name",
    header: "Nama Voucher",
  },
  {
    accessorKey: "discountValue",
    header: "Diskon",
    cell: ({ row }) => formatDiscount(row.original),
  },
  {
    accessorKey: "minimumPurchase",
    header: "Min. Belanja",
    cell: ({ row }) => formatRupiahCurrency(Number(row.original.minimumPurchase ?? 0)),
  },
  {
    accessorKey: "usageLimit",
    header: "Pemakaian",
    cell: ({ row }) => {
      const limit = row.original.usageLimit ? String(row.original.usageLimit) : "Tidak terbatas";
      return `${row.original.usedCount ?? 0} / ${limit}`;
    },
  },
  {
    accessorKey: "endDate",
    header: "Periode",
    cell: ({ row }) => `${formatDate(row.original.startDate)} - ${formatDate(row.original.endDate)}`,
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => (
      <Badge bg={row.original.isActive ? "success" : "secondary"}>
        {row.original.isActive ? "Aktif" : "Nonaktif"}
      </Badge>
    ),
  },
];

export default function VoucherListPage() {
  const dispatch = useAppDispatch();
  const { vouchers, loading } = useAppSelector((state) => state.vouchers);

  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selected, setSelected] = useState<Voucher | null>(null);

  useEffect(() => {
    dispatch(fetchVouchersRequest());
  }, [dispatch]);

  const handleCreate = () => {
    setSelected(null);
    setShowForm(true);
  };

  const handleEdit = (row: Voucher) => {
    setSelected(row);
    setShowForm(true);
  };

  const handleDelete = (row: Voucher) => {
    setSelected(row);
    setShowDelete(true);
  };

  const handleFormSubmit = (data: SaveVoucherPayload) => {
    dispatch(
      saveVoucherRequest({
        id: selected?.id,
        ...data,
      }),
    );
    setShowForm(false);
  };

  const handleConfirmDelete = () => {
    if (selected) {
      dispatch(deleteVoucherRequest({ id: selected.id }));
    }
    setShowDelete(false);
  };

  return (
    <>
      <DataTable<Voucher>
        title="Manajemen Voucher"
        columns={columns}
        data={vouchers}
        loading={loading}
        onCreate={handleCreate}
        createButtonText="+ Tambah Voucher"
        searchPlaceholder="Cari voucher..."
        actions={[
          {
            icon: <FiEdit2 size={14} />,
            title: "Edit",
            variant: "warning",
            onClick: handleEdit,
          },
          {
            icon: <FiTrash2 size={14} />,
            title: "Hapus",
            variant: "danger",
            onClick: handleDelete,
          },
        ]}
      />

      <VoucherFormModal
        show={showForm}
        onHide={() => setShowForm(false)}
        onSubmit={handleFormSubmit}
        initialData={selected}
      />

      <DeleteConfirmModal
        show={showDelete}
        onHide={() => setShowDelete(false)}
        onConfirm={handleConfirmDelete}
        itemName={selected?.code ?? ""}
      />
    </>
  );
}

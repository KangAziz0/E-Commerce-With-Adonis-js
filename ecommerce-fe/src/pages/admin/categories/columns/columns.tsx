import { Category } from "@/types/Category";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Category>[] = [
  {
    header: "Nama Kategori",
    accessorKey: "name",
  },
  {
    header: "Slug",
    accessorKey: "slug",
  },
  {
    header: "Deskripsi",
    accessorKey: "description",
  },
  {
    header: "Dibuat",
    accessorKey: "createdAt",
    cell: ({ getValue }) =>
      new Date(getValue<string>()).toLocaleDateString("id-ID"),
  },
];

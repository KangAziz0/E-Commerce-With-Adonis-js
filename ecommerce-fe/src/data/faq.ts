export const faqCategories = [
  "Pemesanan",
  "Pembayaran",
  "Pengiriman",
  "Pengembalian",
] as const;

export type FaqCategory = (typeof faqCategories)[number];

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: FaqCategory;
}

export const faqData: FaqItem[] = [
  {
    id: "1",
    question: "Bagaimana cara melakukan pemesanan?",
    answer:
      "Pilih produk, tambahkan ke keranjang, lanjutkan ke checkout, lalu isi alamat dan metode pembayaran untuk menyelesaikan pesanan.",
    category: "Pemesanan",
  },
  {
    id: "2",
    question: "Bisakah saya mengubah atau membatalkan pesanan?",
    answer:
      "Pesanan bisa diubah atau dibatalkan maksimal 1 jam setelah dibuat selama belum diproses gudang.",
    category: "Pemesanan",
  },
  {
    id: "3",
    question: "Metode pembayaran apa saja yang tersedia?",
    answer:
      "Kami menerima transfer bank, e-wallet, kartu debit/kredit, serta COD untuk area tertentu.",
    category: "Pembayaran",
  },
  {
    id: "4",
    question: "Apakah transaksi saya aman?",
    answer:
      "Ya, seluruh transaksi dilindungi enkripsi SSL dan diproses melalui payment gateway terpercaya.",
    category: "Pembayaran",
  },
  {
    id: "5",
    question: "Berapa lama proses pengiriman?",
    answer:
      "Estimasi pengiriman bervariasi antara same day hingga 4-7 hari kerja tergantung layanan yang dipilih.",
    category: "Pengiriman",
  },
  {
    id: "6",
    question: "Bagaimana cara melacak pesanan saya?",
    answer:
      "Nomor resi akan dikirim melalui email dan bisa digunakan di halaman lacak pesanan atau situs kurir.",
    category: "Pengiriman",
  },
  {
    id: "7",
    question: "Bagaimana prosedur pengembalian barang?",
    answer:
      "Ajukan pengembalian maksimal 7 hari sejak barang diterima melalui menu Pesanan Saya.",
    category: "Pengembalian",
  },
  {
    id: "8",
    question: "Kapan dana refund dikembalikan?",
    answer:
      "Setelah verifikasi, refund diproses sekitar 1-5 hari kerja tergantung metode pembayaran.",
    category: "Pengembalian",
  },
];

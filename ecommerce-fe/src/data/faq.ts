interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export const faqData: FAQItem[] = [
  // Pemesanan
  {
    id: "1",
    question: "Bagaimana cara melakukan pemesanan?",
    answer:
      "Pilih produk yang Anda inginkan, tambahkan ke keranjang belanja, lalu lanjutkan ke halaman checkout. Isi alamat pengiriman, pilih metode pembayaran, dan konfirmasi pesanan. Anda akan menerima email konfirmasi setelah pesanan berhasil dibuat.",
    category: "Pemesanan",
  },
  {
    id: "2",
    question: "Bisakah saya mengubah atau membatalkan pesanan?",
    answer:
      "Pesanan dapat diubah atau dibatalkan dalam waktu 1 jam setelah pemesanan, selama belum diproses. Hubungi layanan pelanggan kami melalui live chat atau email untuk membantu pembatalan pesanan Anda.",
    category: "Pemesanan",
  },
  {
    id: "3",
    question: "Apakah saya bisa memesan tanpa membuat akun?",
    answer:
      "Ya, Anda bisa berbelanja sebagai tamu tanpa perlu membuat akun. Namun, dengan memiliki akun Anda bisa melacak pesanan, menyimpan alamat, dan mendapatkan rekomendasi produk yang lebih personal.",
    category: "Pemesanan",
  },
  // Pembayaran
  {
    id: "4",
    question: "Metode pembayaran apa saja yang tersedia?",
    answer:
      "Kami menerima berbagai metode pembayaran: Transfer Bank (BCA, Mandiri, BNI, BRI), dompet digital (GoPay, OVO, Dana, ShopeePay), kartu kredit/debit Visa & Mastercard, serta bayar di tempat (COD) untuk area tertentu.",
    category: "Pembayaran",
  },
  {
    id: "5",
    question: "Apakah transaksi saya aman?",
    answer:
      "Keamanan transaksi Anda adalah prioritas kami. Semua transaksi dienkripsi menggunakan teknologi SSL 256-bit. Kami tidak menyimpan data kartu kredit Anda dan seluruh proses pembayaran diproses melalui gateway pembayaran yang telah tersertifikasi.",
    category: "Pembayaran",
  },
  {
    id: "6",
    question: "Kapan pembayaran saya akan dikonfirmasi?",
    answer:
      "Konfirmasi pembayaran via transfer bank biasanya membutuhkan waktu 1–2 jam pada hari kerja. Pembayaran via dompet digital dikonfirmasi secara otomatis dalam hitungan menit. Anda akan mendapatkan notifikasi melalui email dan SMS.",
    category: "Pembayaran",
  },
  // Pengiriman
  {
    id: "7",
    question: "Berapa lama proses pengiriman?",
    answer:
      "Lama pengiriman tergantung layanan yang dipilih: Same Day (hari yang sama, Jabodetabek), Next Day (1 hari kerja), Reguler (2–3 hari kerja), dan Ekonomi (4–7 hari kerja). Estimasi waktu dapat berbeda tergantung lokasi tujuan.",
    category: "Pengiriman",
  },
  {
    id: "8",
    question: "Bagaimana cara melacak pesanan saya?",
    answer:
      "Setelah pesanan dikirim, Anda akan menerima nomor resi melalui email dan notifikasi aplikasi. Gunakan nomor resi tersebut untuk melacak paket di halaman 'Lacak Pesanan' di website kami atau langsung di website kurir terkait.",
    category: "Pengiriman",
  },
  {
    id: "9",
    question: "Apakah ada biaya pengiriman gratis?",
    answer:
      "Ya! Nikmati gratis ongkos kirim untuk pembelian minimal Rp150.000 ke seluruh Indonesia menggunakan layanan reguler. Untuk member Premium, gratis ongkir tanpa minimum pembelian hingga 5x per bulan.",
    category: "Pengiriman",
  },
  // Pengembalian
  {
    id: "10",
    question: "Bagaimana prosedur pengembalian barang?",
    answer:
      "Ajukan pengembalian dalam 7 hari setelah barang diterima melalui menu 'Pesanan Saya'. Pastikan barang masih dalam kondisi original dengan tag dan kemasan lengkap. Tim kami akan memverifikasi dan menjemput barang dalam 1–2 hari kerja.",
    category: "Pengembalian",
  },
  {
    id: "11",
    question: "Kapan dana refund akan dikembalikan?",
    answer:
      "Setelah barang diterima dan diverifikasi (1–3 hari kerja), refund akan diproses dalam 3–5 hari kerja untuk transfer bank, dan 1–2 hari kerja untuk dompet digital. Total proses sekitar 5–10 hari kerja.",
    category: "Pengembalian",
  },
];

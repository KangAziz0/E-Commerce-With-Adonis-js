interface Testimoni {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
}

export const testimonials: Testimoni[] = [
  {
    id: 1,
    name: "Andi Wijaya",
    avatar:
      "https://ui-avatars.com/api/?name=Andi+Wijaya&background=10b981&color=fff",
    rating: 5,
    comment:
      "Kualitas produk sangat bagus! Pengiriman cepat dan pelayanan ramah. Highly recommended!",
    date: "2 hari yang lalu",
  },
  {
    id: 2,
    name: "Siti Nurhaliza",
    avatar:
      "https://ui-avatars.com/api/?name=Siti+Nurhaliza&background=10b981&color=fff",
    rating: 5,
    comment: "Barang sesuai deskripsi, packaging rapi. Pasti order lagi!",
    date: "5 hari yang lalu",
  },
  {
    id: 3,
    name: "Budi Santoso",
    avatar:
      "https://ui-avatars.com/api/?name=Budi+Santoso&background=10b981&color=fff",
    rating: 4,
    comment:
      "Produk bagus, harga terjangkau. Pengiriman agak lama tapi worth it!",
    date: "1 minggu yang lalu",
  },
];

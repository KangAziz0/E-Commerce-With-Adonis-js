export const formatRupiah = (value: number): string => {
  return value.toLocaleString("id-ID");
};

export const formatRupiahCurrency = (value: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
};

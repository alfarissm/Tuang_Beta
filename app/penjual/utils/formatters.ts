export function formatRupiah(angka: number) {
  return angka.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export function isOrderFilter(val: string): val is ("all" | "baru" | "diproses" | "selesai") {
  return ["all", "baru", "diproses", "selesai"].includes(val);
}
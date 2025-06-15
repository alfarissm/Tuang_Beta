export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  note?: string;
  sellerId?: number;
  image?: string;
  category?: string;
}

export type PesananStatus = "pending" | "diproses" | "selesai" | "gagal";

export function formatRupiah(angka: number) {
  return angka.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("cart") ?? "[]");
  } catch {
    return [];
  }
}

export function getTableNumber(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("tableNumber") ?? "";
}
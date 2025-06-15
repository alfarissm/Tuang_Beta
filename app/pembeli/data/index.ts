import { FoodItem, Seller } from "../types";

// Dummy data penjual
export const sellers: Seller[] = [
  { id: 1, nama: "Wowo" },
  { id: 2, nama: "Luhut" },
];

// Dummy menu per penjual
export const foodItems: FoodItem[] = [
  { id: 101, sellerId: 1, name: "Mie Ayam", price: 15000, category: "mains", image: "/Mie-ayam.jpg" },
  { id: 102, sellerId: 1, name: "Ayam Bakar", price: 15000, category: "mains", image: "/Ayam bakar.jpg" },
  { id: 201, sellerId: 1, name: "Matcha", price: 25000, category: "drinks", image: "/matcha.webp" },
  { id: 202, sellerId: 1, name: "Jus Alpukat", price: 25000, category: "drinks", image: "/jus.jpg" },
  { id: 301, sellerId: 2, name: "Martabak", price: 10000, category: "sides", image: "/martabak.jpg" },
  { id: 302, sellerId: 2, name: "Nasi Goreng", price: 10000, category: "mains", image: "/nasigoreng.jpg" },
  { id: 303, sellerId: 2, name: "Teh", price: 10000, category: "drinks", image: "/tehhangat.jpeg" },
  { id: 304, sellerId: 2, name: "Iphone 16", price: 16999999, category: "others", image: "/iphone.webp" },
];

// Formatter for currency
export function formatRupiah(angka: number) {
  return angka.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}
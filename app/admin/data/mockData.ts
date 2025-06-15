import { User, Menu, Order, Category } from '../types';


export const initialCategories: Category[] = [
  { value: "mains", label: "Makanan Utama" },
  { value: "sides", label: "Lauk/Pendamping" },
  { value: "drinks", label: "Minuman" },
  { value: "desserts", label: "Dessert" },
  { value: "others", label: "Lainnya" },
];

export const initialUsers: User[] = [
  { id: 2, nama: "Wowo", nip: "456", role: "penjual" },
  { id: 3, nama: "Luhut", nip: "789", role: "penjual" },
  { id: 4, nama: "Admin", nip: "000", role: "admin" },
];

export const initialMenus: Menu[] = [
  { id: 101, sellerId: 2, name: "Mie Ayam", price: 15000, category: "mains", image: "/Mie-ayam.jpg", stok: 10 },
  { id: 102, sellerId: 2, name: "Ayam Bakar", price: 17000, category: "mains", image: "/Ayam bakar.jpg", stok: 5 },
  { id: 201, sellerId: 3, name: "Martabak", price: 25000, category: "mains", image: "/martabak.jpg", stok: 7 },
  { id: 202, sellerId: 3, name: "Jus Alpukat", price: 12000, category: "drinks", image: "/jus.jpg", stok: 12 },
];

export const initialOrders: Order[] = [
  {
    id: 555,
    table: "8",
    items: [
      { menuId: 101, sellerId: 2, name: "Mie Ayam", qty: 2, price: 15000, note: "Tanpa bawang" },
      { menuId: 102, sellerId: 2, name: "Ayam Bakar", qty: 3, price: 17000 },
      { menuId: 201, sellerId: 3, name: "Martabak", qty: 1, price: 25000 },
    ],
    status: "selesai",
    createdAt: "2025-06-11T10:00:00Z",
    updatedBy: "admin",
    updatedAt: "2025-06-11T10:01:00Z",
  },
  {
    id: 556,
    table: "7",
    items: [
      { menuId: 202, sellerId: 3, name: "Jus Alpukat", qty: 2, price: 12000 },
      { menuId: 101, sellerId: 2, name: "Mie Ayam", qty: 1, price: 15000 },
    ],
    status: "selesai",
    createdAt: "2025-06-12T09:15:00Z",
    updatedBy: "admin",
    updatedAt: "2025-06-12T09:16:00Z",
  },
  {
    id: 557,
    table: "10",
    items: [
      { menuId: 201, sellerId: 3, name: "Martabak", qty: 2, price: 25000 },
    ],
    status: "selesai",
    createdAt: "2025-06-12T11:35:00Z",
    updatedBy: "admin",
    updatedAt: "2025-06-12T11:36:00Z",
  },
  {
    id: 558,
    table: "1",
    items: [
      { menuId: 101, sellerId: 2, name: "Mie Ayam", qty: 1, price: 15000 },
      { menuId: 202, sellerId: 3, name: "Jus Alpukat", qty: 1, price: 12000 },
    ],
    status: "baru",
    createdAt: "2025-06-13T08:00:00Z"
  }
];
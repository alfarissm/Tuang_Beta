export const categories = [
  { value: "mains", label: "Mains" },
  { value: "sides", label: "Sides" },
  { value: "drinks", label: "Drinks" },
  { value: "desserts", label: "Dessert" },
  { value: "others", label: "Lainnya" },
];

export const penjualList = [
  { id: 1, nama: "Wowo", nip: "456" },
  { id: 2, nama: "Luhut", nip: "789" }
];

// Dummy menu untuk Wowo (id:1) dan Luhut (id:2)
export const initialMenus = [
  // Penjual Wowo (id: 1)
  { id: 101, sellerId: 1, name: "Mie Ayam", price: 15000, category: "mains", stok: 10, image: "/Mie-ayam.jpg" },
  { id: 102, sellerId: 1, name: "Ayam Bakar", price: 15000, category: "mains", stok: 5, image: "/Ayam bakar.jpg" },
  { id: 201, sellerId: 1, name: "Matcha", price: 25000, category: "drinks", stok: 8, image: "/matcha.webp" },
  { id: 202, sellerId: 1, name: "Jus Alpukat", price: 25000, category: "drinks", stok: 7, image: "/jus.jpg" },
  // Penjual Luhut (id: 2)
  { id: 301, sellerId: 2, name: "Martabak", price: 10000, category: "sides", stok: 12, image: "/martabak.jpg" },
  { id: 302, sellerId: 2, name: "Nasi Goreng", price: 10000, category: "mains", stok: 9, image: "/nasigoreng.jpg" },
  { id: 303, sellerId: 2, name: "Teh", price: 10000, category: "drinks", stok: 20, image: "/tehhangat.jpeg" },
  { id: 304, sellerId: 2, name: "Iphone 16", price: 16999999, category: "others", stok: 2, image: "/iphone.webp" },
];

export const initialOrders = [
  // Pesanan untuk Wowo (id:1)
  {
    id: 1001,
    table: "8",
    items: [
      { menuId: 101, sellerId: 1, name: "Mie Ayam", qty: 2, price: 15000, note: "Tanpa bawang" },
      { menuId: 102, sellerId: 1, name: "Ayam Bakar", qty: 1, price: 15000 },
    ],
    status: "baru",
    createdAt: "2025-06-13T09:00:00Z",
  },
  {
    id: 1002,
    table: "5",
    items: [
      { menuId: 201, sellerId: 1, name: "Matcha", qty: 2, price: 25000 },
      { menuId: 202, sellerId: 1, name: "Jus Alpukat", qty: 1, price: 25000 },
    ],
    status: "diproses",
    createdAt: "2025-06-12T15:45:00Z",
  },
  {
    id: 1003,
    table: "1",
    items: [
      { menuId: 102, sellerId: 1, name: "Ayam Bakar", qty: 2, price: 15000 },
    ],
    status: "selesai",
    createdAt: "2025-06-10T12:00:00Z",
  },
  // Pesanan untuk Luhut (id:2)
  {
    id: 2001,
    table: "4",
    items: [
      { menuId: 301, sellerId: 2, name: "Martabak", qty: 3, price: 10000 },
      { menuId: 302, sellerId: 2, name: "Nasi Goreng", qty: 2, price: 10000 },
    ],
    status: "baru",
    createdAt: "2025-06-13T10:20:00Z",
  },
  {
    id: 2002,
    table: "2",
    items: [
      { menuId: 303, sellerId: 2, name: "Teh", qty: 5, price: 10000, note: "Tanpa gula" },
    ],
    status: "selesai",
    createdAt: "2025-06-11T19:30:00Z",
  },
  {
    id: 2003,
    table: "6",
    items: [
      { menuId: 304, sellerId: 2, name: "Iphone 16", qty: 1, price: 16999999 },
    ],
    status: "diproses",
    createdAt: "2025-06-12T13:10:00Z",
  },
];
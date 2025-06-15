// Menu Types
export type MenuData = {
  id?: number;
  sellerId?: number;
  name: string;
  category: string;
  price: number;
  stok: number;
  image: string;
};

// Order Types
export type OrderItem = {
  menuId: number;
  sellerId: number;
  name: string;
  qty: number;
  price: number;
  note?: string;
  image?: string;
};

export type Order = {
  id: number;
  table: string;
  items: OrderItem[];
  status: string;
  createdAt: string;
};

// Filter Types
export type OrderFilter = "all" | "baru" | "diproses" | "selesai";

// User Types
export type User = {
  id: number;
  nama: string;
  nip: string;
  role: string;
};

// Category Types
export type Category = {
  value: string;
  label: string;
};

// Modal Types
export type MenuModalProps = {
  mode: "add" | "edit";
  data?: MenuData;
  onClose: () => void;
  onSave: (data: MenuData) => void;
};

// Chart Data Types
export type BestSellerData = {
  menu: MenuData | undefined;
  quantity: number;
};

// Dashboard Chart Props
export type DashboardChartsProps = {
  bestSellerMenu: MenuData | undefined;
  bestSellerMenuQty: number;
  lowStockMenus: MenuData[];
  myOrders: Order[];
};
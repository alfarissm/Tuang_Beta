// User-related types
export type User = {
  id: number;
  nama: string;
  nip: string;
  role: "pembeli" | "penjual" | "admin";
};

export type UserPP = {
  id?: number;
  nama: string;
  nip: string;
  role: "pembeli" | "penjual";
};

// Menu-related types
export type Menu = {
  id?: number;
  sellerId: number;
  name: string;
  price: number;
  category: string;
  image: string;
  stok: number;
  updatedBy?: string;
  updatedAt?: string;
};

// Order-related types
export type OrderItem = {
  menuId: number;
  sellerId: number;
  name: string;
  qty: number;
  price: number;
  note?: string;
};

export type Order = {
  id: number;
  table: string;
  items: OrderItem[];
  status: string;
  createdAt: string;
  updatedAt?: string;
  updatedBy?: string;
};

// Category type
export type Category = { 
  value: string; 
  label: string;
};

// Modal types
export type UserModalProps = {
  mode: "add" | "edit";
  data?: UserPP;
  role: "pembeli" | "penjual";
  onClose: () => void;
  onSave: (d: UserPP) => void;
};

export type MenuModalProps = {
  mode: "add" | "edit";
  data?: Menu;
  penjualList: User[];
  selectedSeller: number | "all";
  categories: Category[];
  onClose: () => void;
  onSave: (d: Menu) => void;
};

export type CategoryModalProps = {
  mode: "add" | "edit";
  data?: Category;
  onClose: () => void;
  onSave: (d: Category) => void;
};

export type OrderModalProps = {
  data: Order;
  onClose: () => void;
};
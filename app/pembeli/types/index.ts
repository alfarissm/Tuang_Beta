// Common types for the pembeli section
export type Seller = {
  id: number | string;
  nama: string;
};

export type FoodItem = {
  id: number;
  sellerId: number;
  name: string;
  price: number;
  category: string;
  image: string;
};

export type CartItem = FoodItem & { quantity: number; note?: string };

export type SellerOption = Seller | { id: "all"; nama: string };
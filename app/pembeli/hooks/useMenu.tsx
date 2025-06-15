import { useState } from "react";
import { FoodItem } from "../types";
import { foodItems } from "../data";

export const useMenu = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSeller, setSelectedSeller] = useState("all");
  const [search, setSearch] = useState("");

  // Ambil semua kategori unik
  const categories = Array.from(new Set(foodItems.map(f => f.category)));

  // Filter menu
  const filteredItems = foodItems.filter(item => {
    const catOk = selectedCategory === "all" || item.category === selectedCategory;
    const sellerOk = selectedSeller === "all" || item.sellerId === Number(selectedSeller);
    const searchOk = item.name.toLowerCase().includes(search.toLowerCase());
    return catOk && sellerOk && searchOk;
  });

  // WRAPPER untuk memastikan setSelectedSeller menerima string
  const handleSetSelectedSeller = (id: string | number) => setSelectedSeller(String(id));

  return {
    selectedCategory,
    selectedSeller,
    search,
    categories,
    filteredItems,
    setSelectedCategory,
    setSearch,
    handleSetSelectedSeller
  };
};
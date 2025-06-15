import SellerDropdown from "@/components/SellerDropdown";
import { SellerOption } from "../types";

type CategoryFilterProps = {
  sellerOptions: SellerOption[];
  selectedSeller: string;
  selectedCategory: string;
  categories: string[];
  handleSetSelectedSeller: (id: string | number) => void;
  setSelectedCategory: (category: string) => void;
};

export default function CategoryFilter({ 
  sellerOptions, 
  selectedSeller, 
  selectedCategory, 
  categories,
  handleSetSelectedSeller,
  setSelectedCategory
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6 items-center bg-white p-3 rounded-lg shadow-sm">
      <SellerDropdown
        sellerOptions={sellerOptions}
        selectedSeller={selectedSeller}
        setSelectedSeller={handleSetSelectedSeller}
      />
      <div className="flex flex-wrap gap-1 sm:gap-2">
        <button
          key="all"
          className={`category-btn px-4 py-1 rounded-full border ${selectedCategory === "all" ? "active bg-[#53B175] text-white border-[#53B175]" : "border-gray-300 hover:bg-gray-50"}`}
          onClick={() => setSelectedCategory("all")}
        >
          Semua Kategori
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-btn px-4 py-1 rounded-full border ${selectedCategory === cat ? "active bg-[#53B175] text-white border-[#53B175]" : "border-gray-200 hover:bg-gray-50"}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}
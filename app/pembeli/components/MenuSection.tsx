import { FoodItem } from "../types";
import FoodCard from "./FoodCard";

type MenuSectionProps = {
  filteredItems: FoodItem[];
  handleAddToCart: (item: FoodItem) => void;
};

export default function MenuSection({ filteredItems, handleAddToCart }: MenuSectionProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
      {filteredItems.length === 0 ? (
        <p className="text-gray-500 col-span-2 sm:col-span-2 md:col-span-2 lg:col-span-3 text-center py-8 bg-white rounded-lg shadow-sm">
          Tidak ada menu.
        </p>
      ) : (
        filteredItems.map((item) => (
          <FoodCard 
            key={item.id} 
            item={item} 
            handleAddToCart={handleAddToCart} 
          />
        ))
      )}
    </div>
  );
}
import Image from "next/image";
import { FoodItem } from "../types";
import { formatRupiah } from "../data";
import { sellers } from "../data";

type FoodCardProps = {
  item: FoodItem;
  handleAddToCart: (item: FoodItem) => void;
};

export default function FoodCard({ item, handleAddToCart }: FoodCardProps) {
  return (
    <div className="food-card bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 flex flex-col">
      <div className="relative">
        <Image
          src={item.image}
          alt={item.name}
          width={400}
          height={192}
          className="w-full h-32 sm:h-40 object-cover food-img"
        />
        <div className="absolute bottom-0 right-0 bg-white px-2 py-1 m-2 rounded-md text-xs font-medium text-gray-600">
          {item.category}
        </div>
      </div>
    
      <div className="p-3 flex flex-col flex-1 food-card-content">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-gray-800 food-name">{item.name}</h3>
          <span className="text-green-500 font-bold food-price">{formatRupiah(item.price)}</span>
        </div>
        
        <div className="text-sm text-gray-500 mb-3">
          <i className="fas fa-store text-xs mr-1"></i>
          {sellers.find(s => s.id === item.sellerId)?.nama}
        </div>
        
        <button
          className="add-to-cart w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium mt-auto transition-colors flex items-center justify-center gap-2"
          onClick={() => handleAddToCart(item)}
        >
          <i className="fas fa-plus text-xs"></i>
          <span className="sm:inline hidden">Tambah ke Keranjang</span>
          <span className="inline sm:hidden">Tambah</span>
        </button>
      </div>
    </div>
  );
}
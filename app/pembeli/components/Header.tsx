import Image from "next/image";
import { CartItem } from "../types";

type HeaderProps = {
  search: string;
  cart: CartItem[];
  setSearch: (value: string) => void;
  toggleCartDrawer: () => void;
};

export default function Header({ search, cart, setSearch, toggleCartDrawer }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-2 sm:px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <Image src="/Frame 7.png" alt="Logo" className="h-10 w-auto mr-1" width={50} height={50} />
          <h1 className="text-lg font-bold text-gray-800">Tuang</h1>
        </div>
        
        {/* Search bar & Cart Icon */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="relative w-28 sm:w-48 md:w-64 lg:w-80 transition-all duration-300">
            <input
              type="text"
              placeholder="Cari menu"
              className="w-full border border-gray-300 rounded-full pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <i className="fas fa-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          </div>
          
          <div className="relative">
            <button 
              className="relative p-2 text-gray-700 hover:text-green-500 transition-colors" 
              onClick={toggleCartDrawer}
            >
              <i className="fas fa-shopping-cart text-xl"></i>
              {cart.length > 0 && (
                <span className="cart-badge">{cart.reduce((a, c) => a + c.quantity, 0)}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
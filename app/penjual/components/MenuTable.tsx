import Image from 'next/image';
import { useState } from 'react';
import { MenuData } from '../types';
import { formatRupiah } from '../utils/formatters';
import { categories } from '../utils/constants';

type MenuTableProps = {
  menus: MenuData[];
  onAddMenu: () => void;
  onEditMenu: (menu: MenuData) => void;
  onDeleteMenu: (id: number) => void;
};

export default function MenuTable({ menus, onAddMenu, onEditMenu, onDeleteMenu }: MenuTableProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get unique categories from menus
  const menuCategories = Array.from(new Set(menus.map(menu => menu.category)));
  
  const filteredMenus = menus.filter(menu => {
    // Filter by category
    const categoryMatch = activeCategory === 'all' || menu.category === activeCategory;
    
    // Filter by search term
    const searchMatch = menu.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    return categoryMatch && searchMatch;
  });
  
  // Group menus by category
  const getCategoryLabel = (categoryValue: string) => {
    return categories.find(c => c.value === categoryValue)?.label || categoryValue;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="font-bold text-lg">Menu Anda</h2>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari menu..."
              className="pl-9 pr-3 py-2 border rounded-lg text-sm w-full sm:w-auto focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg 
              className="absolute top-2.5 left-2.5 text-gray-400 w-4 h-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <button 
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition text-sm font-medium flex items-center justify-center gap-1" 
            onClick={onAddMenu}
          >
            <svg 
              className="w-4 h-4" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Tambah Menu
          </button>
        </div>
      </div>
      
      {/* Category Pills */}
      <div className="p-3 border-b overflow-x-auto whitespace-nowrap scrollbar-hide">
        <button
          className={`px-4 py-1.5 rounded-full text-sm font-medium mr-2 ${
            activeCategory === 'all' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
          }`}
          onClick={() => setActiveCategory('all')}
        >
          Semua
        </button>
        
        {menuCategories.map(cat => (
          <button
            key={cat}
            className={`px-4 py-1.5 rounded-full text-sm font-medium mr-2 ${
              activeCategory === cat ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
            }`}
            onClick={() => setActiveCategory(cat)}
          >
            {getCategoryLabel(cat)}
          </button>
        ))}
      </div>
      
      {/* Menu Grid View */}
      <div className="p-4">
        {filteredMenus.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            {searchTerm ? `Tidak ada menu dengan kata "${searchTerm}"` : 'Belum ada menu.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMenus.map(menu => (
              <div 
                key={menu.id} 
                className="border rounded-lg overflow-hidden hover:shadow-md transition"
              >
                <div className="relative h-40 bg-gray-100">
                  <Image 
                    src={menu.image} 
                    alt={menu.name} 
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{ objectFit: 'cover' }} 
                    className="rounded-t-lg"
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium bg-white/80 backdrop-blur-sm ${
                      menu.stok <= 3 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      Stok: {menu.stok}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{menu.name}</h3>
                      <p className="text-gray-500 text-sm">{getCategoryLabel(menu.category)}</p>
                      <p className="font-bold mt-1 text-blue-600">{formatRupiah(menu.price)}</p>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <button 
                        className="p-1.5 bg-blue-50 rounded hover:bg-blue-100 text-blue-600" 
                        onClick={() => onEditMenu(menu)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      
                      <button 
                        className="p-1.5 bg-red-50 rounded hover:bg-red-100 text-red-600" 
                        onClick={() => {
                          if (confirm('Yakin ingin menghapus menu ini?')) {
                            onDeleteMenu(menu.id!);
                          }
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
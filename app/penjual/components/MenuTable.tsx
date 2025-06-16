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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  
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
      {/* Delete Confirmation Modal */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-5 max-w-xs w-full">
            <h3 className="text-lg font-medium mb-3">Hapus Menu</h3>
            <p>Apakah Anda yakin ingin menghapus menu ini?</p>
            
            <div className="flex gap-3 mt-5">
              <button 
                className="flex-1 bg-gray-200 py-2 rounded-lg font-medium"
                onClick={() => setDeleteConfirmId(null)}
              >
                Batal
              </button>
              <button 
                className="flex-1 bg-red-500 text-white py-2 rounded-lg font-medium"
                onClick={() => {
                  onDeleteMenu(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header with search and add button */}
      <div className="p-4 border-b">
        <div className="flex flex-col gap-3">
          {/* Search Bar - Full width on mobile */}
          <div className="relative">
            <input
              type="text"
              placeholder="Cari menu..."
              className="w-full pl-9 pr-9 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg 
              className="absolute top-3 left-3 text-gray-400 w-4 h-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            
            {searchTerm && (
              <button 
                className="absolute top-3 right-3 text-gray-400"
                onClick={() => setSearchTerm('')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-3">
            {/* Toggle View Mode */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button 
                className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button 
                className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white shadow' : ''}`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
            
            {/* Add Menu Button */}
            <button 
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition text-sm font-medium flex-1 flex items-center justify-center gap-1" 
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
      </div>
      
      {/* Category Pills - Scrollable horizontally */}
      <div className="scrollbar-hide overflow-x-auto whitespace-nowrap px-4 py-3 border-b">
        <button
          className={`px-4 py-1.5 rounded-full text-sm font-medium mr-2 ${
            activeCategory === 'all' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}
          onClick={() => setActiveCategory('all')}
        >
          Semua
          <span className="ml-1 bg-gray-200 text-xs px-2 rounded-full">{menus.length}</span>
        </button>
        
        {menuCategories.map(cat => (
          <button
            key={cat}
            className={`px-4 py-1.5 rounded-full text-sm font-medium mr-2 ${
              activeCategory === cat ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}
            onClick={() => setActiveCategory(cat)}
          >
            {getCategoryLabel(cat)}
            <span className="ml-1 bg-gray-200 text-xs px-2 rounded-full">
              {menus.filter(m => m.category === cat).length}
            </span>
          </button>
        ))}
      </div>
      
      {/* Menu Display */}
      <div className="p-4">
        {filteredMenus.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            {searchTerm ? `Tidak ada menu dengan kata "${searchTerm}"` : 'Belum ada menu.'}
          </div>
        ) : (
          <>
            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMenus.map(menu => (
                  <div 
                    key={menu.id} 
                    className="border rounded-lg overflow-hidden hover:shadow-md transition"
                  >
                    <div className="relative h-44 bg-gray-100">
                      <Image 
                        src={menu.image} 
                        alt={menu.name} 
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        style={{ objectFit: 'cover' }} 
                        className="rounded-t-lg"
                      />
                      <div className="absolute top-2 right-2 flex flex-col gap-1">
                        {/* Stock Badge */}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm
                          ${menu.stok <= 3 
                            ? 'bg-red-500/90 text-white' 
                            : 'bg-white/80 text-green-600'}`
                        }>
                          Stok: {menu.stok}
                          {menu.stok <= 3 && <span className="ml-1">⚠️</span>}
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
                            className="p-2 bg-blue-50 rounded-full hover:bg-blue-100 text-blue-600"
                            onClick={() => onEditMenu(menu)}
                            title="Edit Menu"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                          
                          <button 
                            className="p-2 bg-red-50 rounded-full hover:bg-red-100 text-red-600" 
                            onClick={() => setDeleteConfirmId(menu.id!)}
                            title="Hapus Menu"
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
            
            {/* List View - More compact for mobile */}
            {viewMode === 'list' && (
              <div className="divide-y">
                {filteredMenus.map(menu => (
                  <div key={menu.id} className="py-3 flex items-center gap-3">
                    <div className="w-16 h-16 relative flex-shrink-0">
                      <Image 
                        src={menu.image} 
                        alt={menu.name} 
                        fill
                        sizes="64px"
                        style={{ objectFit: 'cover' }} 
                        className="rounded-md"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium truncate">{menu.name}</h3>
                          <p className="text-gray-500 text-xs">{getCategoryLabel(menu.category)}</p>
                          <p className="font-bold mt-0.5 text-blue-600">{formatRupiah(menu.price)}</p>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <span className={`px-1.5 py-0.5 rounded-full text-xs
                            ${menu.stok <= 3 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`
                          }>
                            {menu.stok}
                          </span>
                          
                          <button 
                            className="p-1.5 bg-blue-50 rounded hover:bg-blue-100 text-blue-600"
                            onClick={() => onEditMenu(menu)}
                            title="Edit Menu"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                          
                          <button 
                            className="p-1.5 bg-red-50 rounded hover:bg-red-100 text-red-600" 
                            onClick={() => setDeleteConfirmId(menu.id!)}
                            title="Hapus Menu"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          </>
        )}
      </div>
    </div>
  );
}
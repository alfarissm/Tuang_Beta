import React from 'react';
import Image from 'next/image';
import { Menu, User, Category } from '@/app/admin/types/index';
import { formatRupiah } from '@/app/admin/utils/formatting';
import { MenuModal } from './modals/MenuModal';

interface MenuManagementProps {
  menus: Menu[];
  penjualList: User[];
  categories: Category[];
  selectedSeller: number | "all";
  selectedCategory: string | "all";
  searchMenu: string;
  menuModal: { mode: "add" | "edit"; data?: Menu } | null;
  pagedMenus: Menu[];
  menuPage: number;
  menuPageCount: number;
  onSellerChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onAddMenu: () => void;
  onEditMenu: (menu: Menu) => void;
  onDeleteMenu: (id: number) => void;
  onDuplicateMenu: (menu: Menu) => void;
  onExportMenus: () => void;
  onPageChange: (page: number) => void;
  onCloseModal: () => void;
  onSaveMenu: (menu: Menu) => void;
}

export const MenuManagement: React.FC<MenuManagementProps> = ({

  penjualList,
  categories,
  selectedSeller,
  selectedCategory,
  searchMenu,
  menuModal,
  pagedMenus,
  menuPage,
  menuPageCount,
  onSellerChange,
  onCategoryChange,
  onSearchChange,
  onAddMenu,
  onEditMenu,
  onDeleteMenu,
  onDuplicateMenu,
  onExportMenus,
  onPageChange,
  onCloseModal,
  onSaveMenu
}) => {
  return (
    <div className="bg-white p-3 md:p-4 rounded shadow">
      {/* Filters - Responsive design with stacked filters on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 w-full mb-4">
        <div className="flex flex-col">
          <label className="text-sm text-gray-500 mb-1">Penjual:</label>
          <select
            className="border rounded px-2 py-1 text-sm md:text-base"
            value={selectedSeller}
            onChange={e => onSellerChange(e.target.value)}
          >
            <option value="all">Semua Penjual</option>
            {penjualList.map(p => (
              <option key={p.id} value={p.id}>{p.nama}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-500 mb-1">Kategori:</label>
          <select
            className="border rounded px-2 py-1 text-sm md:text-base"
            value={selectedCategory}
            onChange={e => onCategoryChange(e.target.value)}
          >
            <option value="all">Semua</option>
            {categories.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-500 mb-1">Cari Menu:</label>
          <input
            className="border px-2 py-1 rounded text-sm md:text-base"
            placeholder="Cari menu"
            value={searchMenu}
            onChange={e => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {/* Action buttons - Better spacing and stacking on mobile */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button 
          className="bg-green-500 text-white px-3 py-1 text-sm rounded hover:bg-green-600"
          onClick={onAddMenu}
          disabled={penjualList.length === 0}
        >
          + Tambah Menu
        </button>
        <button 
          className="bg-blue-500 text-white px-3 py-1 text-sm rounded hover:bg-blue-600"
          onClick={onExportMenus}
        >
          Export Menu CSV
        </button>
      </div>

      {/* Responsive table for mobile - Card-based view on small screens */}
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        {/* Mobile card view (visible on small screens only) */}
        <div className="md:hidden px-4">
          {pagedMenus.length === 0 ? (
            <div className="py-6 text-gray-400 text-center">Tidak ada menu.</div>
          ) : (
            <div className="space-y-3">
              {pagedMenus.map(menu => (
                <div key={menu.id} className="border rounded p-3 shadow-sm bg-gray-50">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-16 h-12 relative flex-shrink-0">
                      <Image src={menu.image} alt={menu.name} layout="fill" objectFit="cover" className="rounded" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-semibold">{menu.name}</h3>
                      <p className="text-sm text-gray-600">
                        {penjualList.find(p => p.id === menu.sellerId)?.nama || "-"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 text-sm mb-2">
                    <div>
                      <span className="text-gray-500">Kategori:</span><br />
                      <span>{categories.find(c => c.value === menu.category)?.label || menu.category}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Harga:</span><br />
                      <span>{formatRupiah(menu.price)}</span>
                    </div>
                    <div className="mt-1">
                      <span className="text-gray-500">Stok:</span><br />
                      <span>{menu.stok}</span>
                    </div>
                    <div className="mt-1">
                      <span className="text-gray-500">Last Edit:</span><br />
                      <span className="text-xs">{menu.updatedAt ? new Date(menu.updatedAt).toLocaleDateString() : "-"}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 pt-2 border-t">
                    <button 
                      className="text-blue-600 text-sm hover:underline" 
                      onClick={() => onEditMenu(menu)}
                    >
                      Edit
                    </button>
                    <button 
                      className="text-red-600 text-sm hover:underline" 
                      onClick={() => onDeleteMenu(menu.id!)}
                    >
                      Hapus
                    </button>
                    <button 
                      className="text-orange-600 text-sm hover:underline" 
                      onClick={() => onDuplicateMenu(menu)}
                    >
                      Duplikat
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Desktop table view (hidden on small screens) */}
        <div className="hidden md:block">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="py-2 px-3 border">Gambar</th>
                <th className="py-2 px-3 border">Nama</th>
                <th className="py-2 px-3 border">Penjual</th>
                <th className="py-2 px-3 border">Kategori</th>
                <th className="py-2 px-3 border">Harga</th>
                <th className="py-2 px-3 border">Stok</th>
                <th className="py-2 px-3 border">Last Edit</th>
                <th className="py-2 px-3 border">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pagedMenus.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-6 text-gray-400 text-center">Tidak ada menu.</td>
                </tr>
              )}
              {pagedMenus.map(menu => (
                <tr key={menu.id} className="border-t hover:bg-gray-50">
                  <td className="py-2 px-3 border">
                    <Image src={menu.image} alt={menu.name} width={56} height={40} className="rounded object-cover" />
                  </td>
                  <td className="py-2 px-3 border">{menu.name}</td>
                  <td className="py-2 px-3 border">
                    {penjualList.find(p => p.id === menu.sellerId)?.nama || "-"}
                  </td>
                  <td className="py-2 px-3 border capitalize">
                    {categories.find(c => c.value === menu.category)?.label || menu.category}
                  </td>
                  <td className="py-2 px-3 border">{formatRupiah(menu.price)}</td>
                  <td className="py-2 px-3 border">{menu.stok}</td>
                  <td className="py-2 px-3 border text-xs">
                    {menu.updatedAt ? new Date(menu.updatedAt).toLocaleString() : "-"}<br />
                    <span className="text-gray-500">{menu.updatedBy || ""}</span>
                  </td>
                  <td className="py-2 px-3 border">
                    <button className="text-blue-600 hover:underline mr-2" onClick={() => onEditMenu(menu)}>Edit</button>
                    <button className="text-red-600 hover:underline mr-2" onClick={() => onDeleteMenu(menu.id!)}>Hapus</button>
                    <button className="text-orange-600 hover:underline" onClick={() => onDuplicateMenu(menu)}>Duplikat</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Pagination - Improved for mobile */}
      {menuPageCount > 1 && (
        <div className="flex justify-center mt-4 gap-1 flex-wrap">
          {Array.from({ length: menuPageCount }, (_, i) => (
            <button 
              key={i} 
              className={`px-2 py-1 rounded text-sm ${menuPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
              onClick={() => onPageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
      
      {/* Modal remains unchanged */}
      {menuModal && (
        <MenuModal
          mode={menuModal.mode}
          data={menuModal.data}
          penjualList={penjualList}
          selectedSeller={selectedSeller}
          categories={categories}
          onClose={onCloseModal}
          onSave={onSaveMenu}
        />
      )}
    </div>
  );
};
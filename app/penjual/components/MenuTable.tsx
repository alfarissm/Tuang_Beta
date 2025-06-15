import Image from 'next/image';
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
  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg">Menu Anda</h2>
        <button 
          className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600" 
          onClick={onAddMenu}
        >
          + Tambah Menu
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-2 px-3 border">Gambar</th>
              <th className="py-2 px-3 border">Nama</th>
              <th className="py-2 px-3 border">Kategori</th>
              <th className="py-2 px-3 border">Harga</th>
              <th className="py-2 px-3 border">Stok</th>
              <th className="py-2 px-3 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {menus.map(menu => (
              <tr key={menu.id} className="border-t hover:bg-gray-50">
                <td className="py-2 px-3 border">
                  <Image 
                    src={menu.image} 
                    alt={menu.name} 
                    width={56} 
                    height={40} 
                    className="rounded object-cover" 
                  />
                </td>
                <td className="py-2 px-3 border">{menu.name}</td>
                <td className="py-2 px-3 border capitalize">
                  {categories.find(c => c.value === menu.category)?.label || menu.category}
                </td>
                <td className="py-2 px-3 border">{formatRupiah(menu.price)}</td>
                <td className="py-2 px-3 border">{menu.stok}</td>
                <td className="py-2 px-3 border">
                  <button 
                    className="text-blue-600 hover:underline mr-2" 
                    onClick={() => onEditMenu(menu)}
                  >
                    Edit
                  </button>
                  <button 
                    className="text-red-600 hover:underline" 
                    onClick={() => onDeleteMenu(menu.id!)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {menus.length === 0 && (
          <div className="text-gray-400 py-8 text-center">Belum ada menu.</div>
        )}
      </div>
    </div>
  );
}
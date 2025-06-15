import React from 'react';
import { Category } from '@/app/admin/types/index';
import { CategoryModal } from './modals/CategoryModal';

interface CategoryManagementProps {
  categories: Category[];
  categoryModal: { mode: "add" | "edit"; data?: Category } | null;
  onAddCategory: () => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (value: string) => void;
  onCloseModal: () => void;
  onSaveCategory: (category: Category) => void;
}

export const CategoryManagement: React.FC<CategoryManagementProps> = ({
  categories,
  categoryModal,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onCloseModal,
  onSaveCategory
}) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
        <h2 className="font-bold text-lg">Kategori Menu</h2>
        <button 
          className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
          onClick={onAddCategory}
        >
          + Tambah Kategori
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-2 px-3 border">Value</th>
              <th className="py-2 px-3 border">Label</th>
              <th className="py-2 px-3 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 && (
              <tr>
                <td colSpan={3} className="py-6 text-gray-400 text-center">Tidak ada kategori.</td>
              </tr>
            )}
            {categories.map(c => (
              <tr key={c.value} className="border-t hover:bg-gray-50">
                <td className="py-2 px-3 border">{c.value}</td>
                <td className="py-2 px-3 border">{c.label}</td>
                <td className="py-2 px-3 border">
                  <button 
                    className="text-blue-600 hover:underline mr-2" 
                    onClick={() => onEditCategory(c)}
                  >
                    Edit
                  </button>
                  <button 
                    className="text-red-600 hover:underline" 
                    onClick={() => onDeleteCategory(c.value)} 
                    disabled={["mains", "drinks"].includes(c.value)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {categoryModal && (
        <CategoryModal
          mode={categoryModal.mode}
          data={categoryModal.data}
          onClose={onCloseModal}
          onSave={onSaveCategory}
        />
      )}
    </div>
  );
};
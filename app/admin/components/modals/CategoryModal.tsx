import React, { useState } from 'react';
import { CategoryModalProps } from '@/app/admin/types/index';

export const CategoryModal: React.FC<CategoryModalProps> = ({ mode, data, onClose, onSave }) => {
  const [label, setLabel] = useState(data?.label || "");
  const [value, setValue] = useState(data?.value || "");
  const [error, setError] = useState("");
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!label.trim() || !value.trim()) {
      setError("Label dan Value wajib diisi!");
      return;
    }
    if (!/^[a-z0-9_-]+$/.test(value)) {
      setError("Value hanya boleh huruf kecil, angka, - atau _");
      return;
    }
    onSave({ label: label.trim(), value: value.trim() });
  };
  
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
      <form className="bg-white rounded p-6 w-full max-w-xs space-y-3" onSubmit={handleSubmit}>
        <div className="font-bold text-lg mb-2">{mode === "add" ? "Tambah Kategori" : "Edit Kategori"}</div>
        {error && <div className="text-red-600">{error}</div>}
        <div>
          <label className="block mb-1 font-medium">Label</label>
          <input className="w-full border rounded px-2 py-1" value={label} onChange={e => setLabel(e.target.value)} />
        </div>
        <div>
          <label className="block mb-1 font-medium">Value</label>
          <input className="w-full border rounded px-2 py-1" value={value} onChange={e => setValue(e.target.value)} disabled={mode === "edit"} />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="px-4 py-1 rounded bg-gray-200" onClick={onClose}>Batal</button>
          <button type="submit" className="px-4 py-1 rounded bg-green-500 text-white">{mode === "add" ? "Tambah" : "Simpan"}</button>
        </div>
      </form>
    </div>
  );
};
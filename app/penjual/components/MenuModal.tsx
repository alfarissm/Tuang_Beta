import Image from "next/image";
import { useState, useEffect, useRef } from 'react';
import { MenuModalProps } from '../types';
import { categories } from '../utils/constants';


export default function MenuModal({ mode, data, onClose, onSave }: MenuModalProps) {
  const [name, setName] = useState(data?.name || "");
  const [category, setCategory] = useState(data?.category || "mains");
  const [price, setPrice] = useState(data?.price ? String(data.price) : "");
  const [stok, setStok] = useState(data?.stok ?? 1);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(data?.image ? data.image : "");
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (imageFile) {
      const objectUrl = URL.createObjectURL(imageFile);
      setImagePreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [imageFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(e.target.value.replace(/[^0-9]/g, ""));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError("Nama menu wajib diisi!");
      return;
    }
    
    if (!price || Number(price) <= 0) {
      setError("Harga harus lebih dari 0 dan hanya angka!");
      return;
    }
    
    if (stok < 1) {
      setError("Stok harus minipal 1!");
      return;
    }
    
    if (!imageFile && !imagePreview) {
      setError("Gambar wajib diunggah!");
      return;
    }
    
    onSave({
      id: data?.id,
      name: name.trim(),
      category,
      price: Number(price),
      stok,
      image: imageFile ? imagePreview : imagePreview || "/Mie-Ayam.jpg"
    });
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <form className="bg-white rounded p-6 w-full max-w-xs space-y-3" onSubmit={handleSubmit}>
        <div className="font-bold text-lg mb-2">
          {mode === "add" ? "Tambah Menu" : "Edit Menu"}
        </div>
        
        {error && <div className="text-red-600">{error}</div>}
        
        <div>
          <label className="block mb-1 font-medium">Nama Menu</label>
          <input 
            className="w-full border rounded px-2 py-1" 
            value={name} 
            onChange={e => setName(e.target.value)} 
          />
        </div>
        
        <div>
          <label className="block mb-1 font-medium">Kategori</label>
          <select 
            className="w-full border rounded px-2 py-1" 
            value={category} 
            onChange={e => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block mb-1 font-medium">Harga</label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            className="w-full border rounded px-2 py-1"
            value={price}
            onChange={handlePriceChange}
            placeholder="Masukkan harga"
            autoComplete="off"
          />
        </div>
        
        <div>
          <label className="block mb-1 font-medium">Stok</label>
          <input
            type="number"
            min={1}
            className="w-full border rounded px-2 py-1"
            value={stok}
            onChange={e => setStok(Number(e.target.value))}
          />
        </div>
        
        <div>
          <label className="block mb-1 font-medium">Gambar Menu</label>
          <div className="relative flex">
            <label className="ml-auto bg-blue-500 text-white px-4 py-2 rounded cursor-pointer text-xs hover:bg-blue-600 transition-all">
              Pilih Foto
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </label>
          </div>
          {imagePreview && (
            <div className="mt-2">
              <Image 
                src={imagePreview} 
                alt="Preview Gambar" 
                width={100} 
                height={64} 
                className="rounded"
                unoptimized 
              />
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-2 pt-2">
          <button 
            type="button" 
            className="px-4 py-1 rounded bg-gray-200" 
            onClick={onClose}
          >
            Batal
          </button>
          <button 
            type="submit" 
            className="px-4 py-1 rounded bg-green-500 text-white"
          >
            {mode === "add" ? "Tambah" : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}
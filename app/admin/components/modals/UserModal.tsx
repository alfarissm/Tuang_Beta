import React, { useState } from 'react';
import { UserModalProps } from '@/app/admin/types/index';

export const UserModal: React.FC<UserModalProps> = ({ mode, data, role, onClose, onSave }) => {
  const [nama, setNama] = useState(data?.nama || "");
  const [nip, setNip] = useState(data?.nip || "");
  const [error, setError] = useState("");
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!nama.trim() || !nip.trim()) {
      setError("Nama dan NIP wajib diisi!");
      return;
    }
    onSave({ id: data?.id, nama: nama.trim(), nip: nip.trim(), role });
  };
  
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
      <form className="bg-white rounded p-6 w-full max-w-xs space-y-3" onSubmit={handleSubmit}>
        <div className="font-bold text-lg mb-2">{mode === "add" ? `Tambah ${role.charAt(0).toUpperCase() + role.slice(1)}` : `Edit ${role.charAt(0).toUpperCase() + role.slice(1)}`}</div>
        {error && <div className="text-red-600">{error}</div>}
        <div>
          <label className="block mb-1 font-medium">Nama</label>
          <input className="w-full border rounded px-2 py-1" value={nama} onChange={e => setNama(e.target.value)} />
        </div>
        <div>
          <label className="block mb-1 font-medium">NIP</label>
          <input className="w-full border rounded px-2 py-1" value={nip} onChange={e => setNip(e.target.value)} />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="px-4 py-1 rounded bg-gray-200" onClick={onClose}>Batal</button>
          <button type="submit" className="px-4 py-1 rounded bg-green-500 text-white">{mode === "add" ? "Tambah" : "Simpan"}</button>
        </div>
      </form>
    </div>
  );
};
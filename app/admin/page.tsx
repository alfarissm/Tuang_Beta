"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Tipe data User dan Menu
type User = {
  id: number;
  nama: string;
  nim: string;
  role: "pembeli" | "penjual" | "admin";
};

type UserPP = {
  id?: number;
  nama: string;
  nim: string;
  role: "pembeli" | "penjual";
};

type Menu = {
  id?: number; // <-- ubah jadi optional di sini!
  sellerId: number;
  name: string;
  price: number;
  category: string;
  image: string;
  stok: number;
};

const categories = [
  { value: "mains", label: "Makanan Utama" },
  { value: "sides", label: "Lauk/Pendamping" },
  { value: "drinks", label: "Minuman" },
  { value: "desserts", label: "Dessert" },
];

// Dummy user data
const initialUsers: User[] = [
  { id: 1, nama: "Budi", nim: "123", role: "pembeli" },
  { id: 2, nama: "Siti", nim: "456", role: "penjual" },
  { id: 3, nama: "Bambang", nim: "789", role: "penjual" },
  { id: 4, nama: "Admin", nim: "000", role: "admin" },
];

// Dummy menu, milik penjual berbeda (lihat sellerId)
const initialMenus: Menu[] = [
  { id: 101, sellerId: 2, name: "Mie Ayam", price: 15000, category: "mains", image: "/Mie-Ayam.jpg", stok: 10 },
  { id: 102, sellerId: 2, name: "Ayam Bakar", price: 15000, category: "mains", image: "/Ayam bakar.jpg", stok: 5 },
  { id: 201, sellerId: 3, name: "Burger", price: 25000, category: "mains", image: "/burger.jpg", stok: 7 },
];

function formatRupiah(angka: number) {
  return angka.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [menus, setMenus] = useState<Menu[]>(initialMenus);

  const [userModal, setUserModal] = useState<null | { mode: "add" | "edit", role: "pembeli" | "penjual", data?: UserPP }>(null);

  // Untuk filter menu berdasarkan penjual
  const penjualList = users.filter(u => u.role === "penjual");
  const [selectedSeller, setSelectedSeller] = useState<number | null>(penjualList.length ? penjualList[0].id : null);

  // Modal tambah/edit menu
  const [menuModal, setMenuModal] = useState<null | { mode: "add" | "edit", data?: Menu }>(null);

  const router = useRouter();

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      router.replace("/login");
      return;
    }
    const u = JSON.parse(userStr);
    if (u.role !== "admin") {
      router.replace("/login");
      return;
    }
    setUser(u);
  }, [router]);

  if (!user) return null;

  // CRUD USER
  const handleDeleteUser = (id: number) => {
    if (confirm("Hapus akun ini?")) {
      setUsers(users => users.filter(u => u.id !== id));
      // Jika penjual dihapus, juga hapus menu miliknya
      setMenus(menus => menus.filter(m => m.sellerId !== id));
      if (selectedSeller === id) setSelectedSeller(null);
    }
  };

  const handleOpenAddUser = (role: "pembeli" | "penjual") => setUserModal({ mode: "add", role });

  // Perbaikan: pastikan data hanya bertipe UserPP (role tidak mungkin admin)
  const handleOpenEditUser = (role: "pembeli" | "penjual", u: User) =>
    setUserModal({
      mode: "edit",
      role,
      data: {
        id: u.id,
        nama: u.nama,
        nim: u.nim,
        role: u.role as "pembeli" | "penjual",
      }
    });

  const handleSaveUser = (u: UserPP) => {
    if (userModal?.mode === "add") {
      const newId = Date.now();
      setUsers(users => [...users, { ...u, id: newId }]);
      if (u.role === "penjual" && !selectedSeller) setSelectedSeller(newId);
    } else if (userModal?.mode === "edit") {
      setUsers(users => users.map(us => us.id === u.id ? { ...us, ...u } : us));
    }
    setUserModal(null);
  };

  // CRUD MENU
  const menusForSeller = selectedSeller ? menus.filter(m => m.sellerId === selectedSeller) : [];

  const handleAddMenu = () => setMenuModal({ mode: "add" });
  const handleEditMenu = (menu: Menu) => setMenuModal({ mode: "edit", data: menu });
  const handleDeleteMenu = (id: number) => {
    if (confirm("Hapus menu ini?")) {
      setMenus(menus => menus.filter(m => m.id !== id));
    }
  };
  const handleSaveMenu = (m: Menu) => {
    if (!selectedSeller) return;
    if (menuModal?.mode === "add") {
      setMenus(menus => [...menus, { ...m, id: Date.now(), sellerId: selectedSeller }]);
    } else if (menuModal?.mode === "edit") {
      setMenus(menus => menus.map(menu => menu.id === m.id ? { ...m, sellerId: selectedSeller } : menu));
    }
    setMenuModal(null);
  };

  // Filter user
  const pembeliList = users.filter(u => u.role === "pembeli");

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Image src="/Frame 7.png" alt="Logo" width={40} height={40} />
          <div>
            <h1 className="text-3xl font-bold">Dashboard Admin</h1>
            <p className="text-gray-700">Selamat datang, <b>{user.nama}</b> ({user.nim})</p>
          </div>
        </div>

        {/* --- DATA AKUN PEMBELI --- */}
        <div className="bg-white p-4 rounded shadow mb-8">
          <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
            <h2 className="font-bold text-lg">Akun Pembeli</h2>
            <button className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
              onClick={() => handleOpenAddUser("pembeli")}>+ Tambah Pembeli</button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="py-2 px-3 border">Nama</th>
                  <th className="py-2 px-3 border">NIM</th>
                  <th className="py-2 px-3 border">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {pembeliList.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-6 text-gray-400 text-center">Tidak ada akun pembeli.</td>
                  </tr>
                )}
                {pembeliList.map(u => (
                  <tr key={u.id} className="border-t hover:bg-gray-50">
                    <td className="py-2 px-3 border">{u.nama}</td>
                    <td className="py-2 px-3 border">{u.nim}</td>
                    <td className="py-2 px-3 border">
                      <button className="text-blue-600 hover:underline mr-2" onClick={() => handleOpenEditUser("pembeli", u)}>Edit</button>
                      <button className="text-red-600 hover:underline" onClick={() => handleDeleteUser(u.id)}>Hapus</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- DATA AKUN PENJUAL --- */}
        <div className="bg-white p-4 rounded shadow mb-8">
          <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
            <h2 className="font-bold text-lg">Akun Penjual</h2>
            <button className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
              onClick={() => handleOpenAddUser("penjual")}>+ Tambah Penjual</button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="py-2 px-3 border">Nama</th>
                  <th className="py-2 px-3 border">NIM</th>
                  <th className="py-2 px-3 border">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {penjualList.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-6 text-gray-400 text-center">Tidak ada akun penjual.</td>
                  </tr>
                )}
                {penjualList.map(u => (
                  <tr key={u.id} className="border-t hover:bg-gray-50">
                    <td className="py-2 px-3 border">{u.nama}</td>
                    <td className="py-2 px-3 border">{u.nim}</td>
                    <td className="py-2 px-3 border">
                      <button className="text-blue-600 hover:underline mr-2" onClick={() => handleOpenEditUser("penjual", u)}>Edit</button>
                      <button className="text-red-600 hover:underline" onClick={() => handleDeleteUser(u.id)}>Hapus</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- FILTER & CRUD MENU PER PENJUAL --- */}
        <div className="bg-white p-4 rounded shadow">
          <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-lg">Daftar Menu</h2>
              <span className="text-gray-400">Penjual:</span>
              <select
                className="border rounded px-2 py-1"
                value={selectedSeller ?? ""}
                onChange={e => setSelectedSeller(Number(e.target.value))}
              >
                {penjualList.map(p => (
                  <option key={p.id} value={p.id}>{p.nama}</option>
                ))}
              </select>
            </div>
            <button className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
              onClick={handleAddMenu}
              disabled={!selectedSeller}
            >+ Tambah Menu</button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="py-2 px-3 border">Nama</th>
                  <th className="py-2 px-3 border">Kategori</th>
                  <th className="py-2 px-3 border">Harga</th>
                  <th className="py-2 px-3 border">Stok</th>
                  <th className="py-2 px-3 border">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {menusForSeller.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-6 text-gray-400 text-center">Tidak ada menu.</td>
                  </tr>
                )}
                {menusForSeller.map(menu => (
                  <tr key={menu.id} className="border-t hover:bg-gray-50">
                    <td className="py-2 px-3 border">{menu.name}</td>
                    <td className="py-2 px-3 border capitalize">
                      {categories.find(c => c.value === menu.category)?.label || menu.category}
                    </td>
                    <td className="py-2 px-3 border">{formatRupiah(menu.price)}</td>
                    <td className="py-2 px-3 border">{menu.stok}</td>
                    <td className="py-2 px-3 border">
                      <button className="text-blue-600 hover:underline mr-2" onClick={() => handleEditMenu(menu)}>Edit</button>
                      <button className="text-red-600 hover:underline" onClick={() => handleDeleteMenu(menu.id!)}>Hapus</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Tambah/Edit User */}
        {userModal && (
          <UserModal
            mode={userModal.mode}
            data={userModal.data}
            role={userModal.role}
            onClose={() => setUserModal(null)}
            onSave={handleSaveUser}
          />
        )}

        {/* Modal Tambah/Edit Menu */}
        {menuModal && (
          <MenuModal
            mode={menuModal.mode}
            data={menuModal.data}
            onClose={() => setMenuModal(null)}
            onSave={handleSaveMenu}
          />
        )}
      </div>
    </div>
  );
}

// Komponen Modal Tambah/Edit User
function UserModal({ mode, data, role, onClose, onSave }:{
  mode: "add" | "edit",
  data?: UserPP,
  role: "pembeli" | "penjual",
  onClose: () => void,
  onSave: (d: UserPP) => void
}) {
  const [nama, setNama] = useState(data?.nama || "");
  const [nim, setNim] = useState(data?.nim || "");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!nama.trim() || !nim.trim()) {
      setError("Nama dan NIM wajib diisi!");
      return;
    }
    onSave({ id: data?.id, nama: nama.trim(), nim: nim.trim(), role });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <form className="bg-white rounded p-6 w-full max-w-xs space-y-3" onSubmit={handleSubmit}>
        <div className="font-bold text-lg mb-2">{mode==="add"?`Tambah ${role.charAt(0).toUpperCase()+role.slice(1)}`:`Edit ${role.charAt(0).toUpperCase()+role.slice(1)}`}</div>
        {error && <div className="text-red-600">{error}</div>}
        <div>
          <label className="block mb-1 font-medium">Nama</label>
          <input className="w-full border rounded px-2 py-1" value={nama} onChange={e=>setNama(e.target.value)} />
        </div>
        <div>
          <label className="block mb-1 font-medium">NIM</label>
          <input className="w-full border rounded px-2 py-1" value={nim} onChange={e=>setNim(e.target.value)} />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="px-4 py-1 rounded bg-gray-200" onClick={onClose}>Batal</button>
          <button type="submit" className="px-4 py-1 rounded bg-green-500 text-white">{mode==="add"?"Tambah":"Simpan"}</button>
        </div>
      </form>
    </div>
  );
}

// Komponen Modal Tambah/Edit Menu (disamakan dengan penjual)
function MenuModal({ mode, data, onClose, onSave }: {
  mode: "add" | "edit",
  data?: Menu,
  onClose: () => void,
  onSave: (d: Menu) => void
}) {
  const [name, setName] = useState(data?.name || "");
  const [category, setCategory] = useState(data?.category || "mains");
  const [price, setPrice] = useState(data?.price ? String(data.price) : "");
  const [stok, setStok] = useState(data?.stok || 1);

  // Upload & preview gambar
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(data?.image || "");
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

  const handleStokChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStok(Number(e.target.value));
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
      setError("Stok harus minimal 1!");
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
      image: imageFile ? imagePreview : imagePreview || "/Mie-Ayam.jpg",
      sellerId: data?.sellerId ?? 0,
      stok
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <form className="bg-white rounded p-6 w-full max-w-xs space-y-3" onSubmit={handleSubmit}>
        <div className="font-bold text-lg mb-2">{mode === "add" ? "Tambah Menu" : "Edit Menu"}</div>
        {error && <div className="text-red-600">{error}</div>}
        <div>
          <label className="block mb-1 font-medium">Nama Menu</label>
          <input className="w-full border rounded px-2 py-1" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div>
          <label className="block mb-1 font-medium">Kategori</label>
          <select className="w-full border rounded px-2 py-1" value={category} onChange={e => setCategory(e.target.value)}>
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
            className="w-full border rounded px-2 py-1"
            value={stok}
            onChange={handleStokChange}
            min={1}
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imagePreview} alt="Preview Gambar" width={100} height={64} className="rounded object-cover" />
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="px-4 py-1 rounded bg-gray-200" onClick={onClose}>Batal</button>
          <button type="submit" className="px-4 py-1 rounded bg-green-500 text-white">{mode === "add" ? "Tambah" : "Simpan"}</button>
        </div>
      </form>
    </div>
  );
}
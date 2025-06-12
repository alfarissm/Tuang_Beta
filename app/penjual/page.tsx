"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Tipe data untuk menu, lengkap dengan sellerId agar struktur konsisten
type MenuData = {
  id?: number;
  sellerId?: number;
  name: string;
  category: string;
  price: number;
  stok: number;
  image: string;
};

const penjualList = [
  { id: 1, nama: "Wowo", nim: "456" },
  { id: 2, nama: "Luhut", nim: "789" }
];

const initialMenus: MenuData[] = [
  { id: 101, sellerId: 1, name: "Mie Ayam", price: 15000, category: "mains", stok: 10, image: "/Mie-Ayam.jpg"},
  { id: 102, sellerId: 1, name: "Ayam Bakar", price: 15000, category: "mains", stok: 5, image: "/Ayam bakar.jpg" },
  { id: 201, sellerId: 2, name: "Burger", price: 25000, category: "mains", stok: 7, image: "/burger.jpg"},
];

type OrderItem = {
  menuId: number;
  sellerId: number;
  name: string;
  qty: number;
  price: number;
  note?: string;
};

type Order = {
  id: number;
  table: string;
  items: OrderItem[];
  status: string;
  createdAt: string;
};

const initialOrders: Order[] = [
  {
    id: 101,
    table: "8A",
    items: [
      { menuId: 101, sellerId: 1, name: "Mie Ayam", qty: 2, price: 15000, note: "Tanpa bawang" },
      { menuId: 102, sellerId: 1, name: "Ayam Bakar", qty: 1, price: 15000 },
      { menuId: 201, sellerId: 2, name: "Burger", qty: 1, price: 25000, note: "Tanpa mayo" },
    ],
    status: "baru",
    createdAt: "2025-06-11T10:00:00Z",
  }
];

const categories = [
  { value: "mains", label: "Makanan Utama" },
  { value: "sides", label: "Lauk/Pendamping" },
  { value: "drinks", label: "Minuman" },
  { value: "desserts", label: "Dessert" },
];

function formatRupiah(angka: number) {
  return angka.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export default function SellerPage() {
  const [user, setUser] = useState<{ id: number; nama: string; nim: string; role: string } | null>(null);
  const router = useRouter();

  const [menus, setMenus] = useState<MenuData[]>(initialMenus);
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  const [menuModal, setMenuModal] = useState<null | { mode: "add" | "edit"; data?: MenuData }>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      router.replace("/login");
      return;
    }
    const u = JSON.parse(userStr);
    if (u.role !== "penjual") {
      router.replace("/login");
      return;
    }
    const seller = penjualList.find(s => s.nim === u.nim);
    setUser({ ...u, id: seller?.id ?? 0 });
  }, [router]);

  if (!user) return null;

  const myMenus = menus.filter(menu => menu.sellerId === user.id);

  const handleAddMenu = () => setMenuModal({ mode: "add" });

  const handleEditMenu = (menu: MenuData) => setMenuModal({ mode: "edit", data: menu });

  const handleDeleteMenu = (id: number) => {
    if (confirm("Hapus menu ini?")) {
      setMenus(menus.filter(m => m.id !== id));
    }
  };

  const handleSaveMenu = (m: MenuData) => {
    if (menuModal?.mode === "add") {
      setMenus([
        ...menus,
        {
          ...m,
          id: Date.now(),
          sellerId: user.id
        }
      ]);
    } else if (menuModal?.mode === "edit") {
      setMenus(menus.map(menu =>
        menu.id === m.id ? { ...m, sellerId: user.id } : menu
      ));
    }
    setMenuModal(null);
  };

  const myOrders = orders
    .map(order => ({
      ...order,
      items: order.items.filter(item => item.sellerId === user.id)
    }))
    .filter(order => order.items.length > 0);

  const updateOrderStatus = (id: number, nextStatus: string) => {
    setOrders(orders =>
      orders.map(order =>
        order.id === id ? { ...order, status: nextStatus } : order
      )
    );
  };

  const totalOrder = myOrders.length;
  const totalIncome = myOrders
    .filter(o => o.status === "selesai")
    .reduce((sum, order) =>
      sum + order.items.reduce((t, i) => t + i.qty * i.price, 0), 0
    );

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 mb-8">
          <Image src="/Frame 7.png" alt="Logo" width={40} height={40} />
          <div>
            <h1 className="text-3xl font-bold">Dashboard Penjual</h1>
            <p className="text-gray-700">Selamat datang, <b>{user.nama}</b> ({user.nim})</p>
          </div>
        </div>
        {/* Statistik */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="bg-white p-4 rounded shadow min-w-[180px]">
            <div className="text-gray-500 text-sm">Total Pesanan</div>
            <div className="text-2xl font-bold">{totalOrder}</div>
          </div>
          <div className="bg-white p-4 rounded shadow min-w-[180px]">
            <div className="text-gray-500 text-sm">Pesanan Selesai</div>
            <div className="text-2xl font-bold">{myOrders.filter(o => o.status === "selesai").length}</div>
          </div>
          <div className="bg-white p-4 rounded shadow min-w-[180px]">
            <div className="text-gray-500 text-sm">Pendapatan</div>
            <div className="text-2xl font-bold">{formatRupiah(totalIncome)}</div>
          </div>
        </div>
        {/* Daftar Pesanan */}
        <div className="bg-white p-4 rounded shadow mb-8">
          <h2 className="font-bold text-lg mb-4">Pesanan Masuk</h2>
          {myOrders.length === 0 && (
            <div className="text-gray-400 text-center py-8">Belum ada pesanan.</div>
          )}
          <div className="space-y-4">
            {myOrders.map(order => (
              <div key={order.id} className="border rounded-lg px-4 py-2 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex gap-4 items-center mb-1">
                    <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-semibold">Meja #{order.table}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold
                      ${order.status === "baru" ? "bg-yellow-100 text-yellow-800" : ""}
                      ${order.status === "diproses" ? "bg-blue-100 text-blue-800" : ""}
                      ${order.status === "selesai" ? "bg-green-100 text-green-800" : ""}
                    `}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <span className="text-gray-400 text-xs">{new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                    <span className="text-gray-500 text-xs font-mono">#{order.id}</span>
                  </div>
                  <ul className="flex flex-wrap gap-4 mb-1">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="flex flex-col items-start gap-1 bg-gray-50 rounded px-2 py-1 min-w-[120px]">
                        <div className="font-medium text-sm">{item.name}</div>
                        <div className="text-xs text-gray-500">
                          {item.qty} x {formatRupiah(item.price)}
                        </div>
                        {item.note && (
                          <div className="text-xs text-yellow-600 italic break-words max-w-[150px]">Note: {item.note}</div>
                        )}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="font-semibold">Total:</span> {formatRupiah(order.items.reduce((t, i) => t + i.qty * i.price, 0))}
                  </div>
                </div>
                <div className="flex flex-col md:items-end gap-2 mt-2 md:mt-0">
                  {order.status === "baru" && (
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium"
                      onClick={() => updateOrderStatus(order.id, "diproses")}
                    >Tandai Diproses</button>
                  )}
                  {order.status === "diproses" && (
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-full text-sm font-medium"
                      onClick={() => updateOrderStatus(order.id, "selesai")}
                    >Tandai Selesai</button>
                  )}
                  {order.status === "selesai" && (
                    <span className="text-green-600 font-semibold text-sm">Selesai</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Daftar Menu milik penjual login */}
        <div className="bg-white p-4 rounded shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg">Menu Anda</h2>
            <button className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600" onClick={handleAddMenu}>
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
                {myMenus.map(menu => (
                  <tr key={menu.id} className="border-t hover:bg-gray-50">
                    <td className="py-2 px-3 border">
                      <Image src={menu.image} alt={menu.name} width={56} height={40} className="rounded object-cover" />
                    </td>
                    <td className="py-2 px-3 border">{menu.name}</td>
                    <td className="py-2 px-3 border capitalize">{categories.find(c => c.value === menu.category)?.label || menu.category}</td>
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
            {myMenus.length === 0 && <div className="text-gray-400 py-8 text-center">Belum ada menu.</div>}
          </div>
        </div>
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

// Komponen Modal Tambah/Edit Menu
function MenuModal({ mode, data, onClose, onSave }: {
  mode: "add" | "edit",
  data?: MenuData,
  onClose: () => void,
  onSave: (d: MenuData) => void
}) {
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
      stok,
      image: imageFile ? imagePreview : imagePreview || "/Mie-Ayam.jpg"
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
            min={1}
            className="w-full border rounded px-2 py-1"
            value={stok}
            onChange={handleStokChange}
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

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
  { id: 1, nama: "Wowo", nip: "456" },
  { id: 2, nama: "Luhut", nip: "789" }
];

// Dummy menu untuk Wowo (id:1) dan Luhut (id:2)
const initialMenus: MenuData[] = [
  // Penjual Wowo (id: 1)
  { id: 101, sellerId: 1, name: "Mie Ayam", price: 15000, category: "mains", stok: 10, image: "/Mie-ayam.jpg" },
  { id: 102, sellerId: 1, name: "Ayam Bakar", price: 15000, category: "mains", stok: 5, image: "/Ayam bakar.jpg" },
  { id: 201, sellerId: 1, name: "Matcha", price: 25000, category: "drinks", stok: 8, image: "/matcha.webp" },
  { id: 202, sellerId: 1, name: "Jus Alpukat", price: 25000, category: "drinks", stok: 7, image: "/jus.jpg" },
  // Penjual Luhut (id: 2)
  { id: 301, sellerId: 2, name: "Martabak", price: 10000, category: "sides", stok: 12, image: "/martabak.jpg" },
  { id: 302, sellerId: 2, name: "Nasi Goreng", price: 10000, category: "mains", stok: 9, image: "/nasigoreng.jpg" },
  { id: 303, sellerId: 2, name: "Teh", price: 10000, category: "drinks", stok: 20, image: "/tehhangat.jpeg" },
  { id: 304, sellerId: 2, name: "Iphone 16", price: 16999999, category: "others", stok: 2, image: "/iphone.webp" },
];

type OrderItem = {
  menuId: number;
  sellerId: number;
  name: string;
  qty: number;
  price: number;
  note?: string;
  image?: string;
};

type Order = {
  id: number;
  table: string;
  items: OrderItem[];
  status: string;
  createdAt: string;
};

// Dummy pesanan kedua penjual
const initialOrders: Order[] = [
  // Pesanan untuk Wowo (id:1)
  {
    id: 1001,
    table: "8A",
    items: [
      { menuId: 101, sellerId: 1, name: "Mie Ayam", qty: 2, price: 15000, note: "Tanpa bawang" },
      { menuId: 102, sellerId: 1, name: "Ayam Bakar", qty: 1, price: 15000 },
    ],
    status: "baru",
    createdAt: "2025-06-13T09:00:00Z",
  },
  {
    id: 1002,
    table: "5B",
    items: [
      { menuId: 201, sellerId: 1, name: "Matcha", qty: 2, price: 25000 },
      { menuId: 202, sellerId: 1, name: "Jus Alpukat", qty: 1, price: 25000 },
    ],
    status: "diproses",
    createdAt: "2025-06-12T15:45:00Z",
  },
  {
    id: 1003,
    table: "1C",
    items: [
      { menuId: 102, sellerId: 1, name: "Ayam Bakar", qty: 2, price: 15000 },
    ],
    status: "selesai",
    createdAt: "2025-06-10T12:00:00Z",
  },
  // Pesanan untuk Luhut (id:2)
  {
    id: 2001,
    table: "4",
    items: [
      { menuId: 301, sellerId: 2, name: "Martabak", qty: 3, price: 10000 },
      { menuId: 302, sellerId: 2, name: "Nasi Goreng", qty: 2, price: 10000 },
    ],
    status: "baru",
    createdAt: "2025-06-13T10:20:00Z",
  },
  {
    id: 2002,
    table: "2",
    items: [
      { menuId: 303, sellerId: 2, name: "Teh", qty: 5, price: 10000, note: "Tanpa gula" },
    ],
    status: "selesai",
    createdAt: "2025-06-11T19:30:00Z",
  },
  {
    id: 2003,
    table: "6",
    items: [
      { menuId: 304, sellerId: 2, name: "Iphone 16", qty: 1, price: 16999999 },
    ],
    status: "diproses",
    createdAt: "2025-06-12T13:10:00Z",
  },
];

const categories = [
  { value: "mains", label: "Mains" },
  { value: "sides", label: "Sides" },
  { value: "drinks", label: "Drinks" },
  { value: "desserts", label: "Dessert" },
  { value: "others", label: "Lainnya" },
];

function formatRupiah(angka: number) {
  return angka.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

// ICON SVG 
function IconClipboard() {
  return (
    <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 2.25h6a2.25 2.25 0 012.25 2.25v.75h1.5a.75.75 0 01.75.75v14.25A2.25 2.25 0 0118.25 22.5H5.75A2.25 2.25 0 013.5 20.25V6A.75.75 0 014.25 5.25h1.5v-.75A2.25 2.25 0 018 2.25h1zM9 2.25V3a.75.75 0 01-.75.75H7.5A.75.75 0 017.5 3V2.25"></path></svg>
  );
}
function IconCheckCircle() {
  return (
    <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75l2.25 2.25L15 10.5m4.5 1.5A7.5 7.5 0 1112 3a7.5 7.5 0 017.5 9z"></path></svg>
  );
}
function IconMoney() {
  return (
    <svg className="w-7 h-7 text-yellow-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 7.5v9a2.25 2.25 0 002.25 2.25h12a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-12A2.25 2.25 0 003.75 7.5zM7.5 12a4.5 4.5 0 109 0 4.5 4.5 0 00-9 0z"></path></svg>
  );
}
function IconFire() {
  return (
    <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3c.44 1.36.63 2.68.41 3.99-.39 2.35-2.26 3.87-2.26 5.51 0 1.53 1.23 2.75 2.75 2.75s2.75-1.22 2.75-2.75c0-2.12-2.02-3.61-2.02-6.5z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M19.44 13.34a8.5 8.5 0 01-14.88 0"></path></svg>
  );
}
function IconWarning() {
  return (
    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86l-8.42 14A2 2 0 003.87 21h16.26a2 2 0 001.71-3.14l-8.42-14a2 2 0 00-3.42 0z"></path></svg>
  );
}

// Helper untuk 7 hari terakhir
function getLast7Days() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(new Date(d.getFullYear(), d.getMonth(), d.getDate()));
  }
  return days;
}

// order filter
type OrderFilter = "all" | "baru" | "diproses" | "selesai";
function isOrderFilter(val: string): val is OrderFilter {
  return ["all", "baru", "diproses", "selesai"].includes(val);
}

export default function SellerPage() {
  const [user, setUser] = useState<{ id: number; nama: string; nip: string; role: string } | null>(null);
  const router = useRouter();

  const [menus, setMenus] = useState<MenuData[]>(initialMenus);
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  const [menuModal, setMenuModal] = useState<null | { mode: "add" | "edit"; data?: MenuData }>(null);

  // FILTER PESANAN
  const [orderFilter, setOrderFilter] = useState<OrderFilter>("all");

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
    const seller = penjualList.find(s => s.nip === u.nip);
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
      items: order.items
        .map(item => {
          // Tambahkan image menu
          const menu = menus.find(m => m.id === item.menuId);
          return menu ? { ...item, image: menu.image } : item;
        })
        .filter(item => item.sellerId === user.id)
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

  // Filter berdasarkan status
  const filteredOrders = orderFilter === "all"
    ? myOrders
    : myOrders.filter(o => o.status === orderFilter);

  // 1. Menu Terlaris
  const menuSales: Record<number, number> = {};
  myOrders.forEach(order => {
    order.items.forEach(item => {
      menuSales[item.menuId] = (menuSales[item.menuId] || 0) + item.qty;
    });
  });
  // Urutkan dari qty terbanyak
  const bestMenuId = Object.keys(menuSales).sort((a, b) => menuSales[Number(b)] - menuSales[Number(a)])[0];
  const bestSellerMenu = myMenus.find(m => m.id === Number(bestMenuId));
  const bestSellerMenuQty = bestMenuId ? menuSales[Number(bestMenuId)] : 0;

  // 2. Stok Hampir Habis (stok <= 3)
  const lowStockMenus = myMenus.filter(m => m.stok <= 3);

  // 3. Grafik Pendapatan 7 Hari
  const last7days = getLast7Days();
  const dailyIncome = last7days.map(day => {
    const dayStr = day.toISOString().slice(0, 10);
    return myOrders
      .filter(o =>
        o.status === "selesai" &&
        o.createdAt.slice(0, 10) === dayStr
      )
      .reduce((sum, o) =>
        sum + o.items.reduce((t, i) => t + i.qty * i.price, 0), 0
      );
  });

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 mb-8">
          <Image src="/Frame 7.png" alt="Logo" width={40} height={40} />
          <div>
            <h1 className="text-3xl font-bold">Dashboard Penjual</h1>
            <p className="text-gray-700">Selamat datang, <b>{user.nama}</b> ({user.nip})</p>
          </div>
        </div>
        {/* Statistik */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4">
            <div className="bg-blue-100 rounded-full p-3">
              <IconClipboard />
            </div>
            <div>
              <div className="text-gray-500 text-sm">Total Pesanan</div>
              <div className="text-2xl font-bold">{totalOrder}</div>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4">
            <div className="bg-green-100 rounded-full p-3">
              <IconCheckCircle />
            </div>
            <div>
              <div className="text-gray-500 text-sm">Pesanan Selesai</div>
              <div className="text-2xl font-bold">{myOrders.filter(o => o.status === "selesai").length}</div>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4">
            <div className="bg-yellow-100 rounded-full p-3">
              <IconMoney />
            </div>
            <div>
              <div className="text-gray-500 text-sm">Pendapatan</div>
              <div className="text-2xl font-bold">{formatRupiah(totalIncome)}</div>
            </div>
          </div>
        </div>
        {/* Fitur tambahan */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Menu Terlaris */}
          <div className="bg-white p-4 rounded-xl shadow flex items-center gap-4">
            <IconFire />
            <div>
              <div className="text-gray-600 text-sm font-medium mb-1">Menu Terlaris</div>
              {bestSellerMenu ? (
                <div className="flex items-center gap-2">
                  <Image src={bestSellerMenu.image} alt={bestSellerMenu.name} width={40} height={28} className="rounded object-cover border" />
                  <span className="font-semibold">{bestSellerMenu.name}</span>
                  <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded text-xs font-bold">{bestSellerMenuQty} terjual</span>
                </div>
              ) : <div className="text-gray-400 text-sm">Belum ada penjualan.</div>}
            </div>
          </div>
          {/* Stok Hampir Habis */}
          <div className="bg-white p-4 rounded-xl shadow">
            <div className="flex items-center gap-2 mb-1">
              <IconWarning />
              <span className="text-red-600 font-semibold text-sm">Stok Hampir Habis</span>
            </div>
            {lowStockMenus.length === 0 ? (
              <div className="text-gray-400 text-sm">Semua menu cukup stok.</div>
            ) : (
              <ul className="mt-1 space-y-1">
                {lowStockMenus.map(menu => (
                  <li key={menu.id} className="flex items-center gap-2">
                    <Image src={menu.image} alt={menu.name} width={28} height={20} className="rounded object-cover border" />
                    <span>{menu.name}</span>
                    <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-bold">Sisa {menu.stok}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* Grafik Pendapatan 7 Hari */}
          <div className="bg-white p-4 rounded-xl shadow">
            <div className="text-gray-600 text-sm font-medium mb-2">Pendapatan 7 Hari Terakhir</div>
            <div className="flex items-end gap-1 h-28 w-full">
              {dailyIncome.map((income, idx) => {
                // Cari max untuk normalize tinggi bar
                const max = Math.max(...dailyIncome, 1);
                return (
                  <div key={idx} className="flex flex-col items-center justify-end w-full">
                    <div
                      className="bg-green-400 rounded-t"
                      style={{
                        height: `${Math.max(10, (income / max) * 80)}px`,
                        width: "16px",
                        transition: "height 0.3s"
                      }}
                      title={formatRupiah(income)}
                    />
                    <div className="text-[10px] text-gray-400 mt-0.5">
                      {last7days[idx].getDate()}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              {last7days.map((d, idx) => (
                <span key={idx} className="w-6 text-center">{d.toLocaleDateString("id-ID", { weekday: "short" })}</span>
              ))}
            </div>
          </div>
        </div>
         {/* Filter Pesanan */}
        <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
          <h2 className="font-bold text-lg">Pesanan Masuk</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Filter:</span>
            <select
              className="border px-2 py-1 rounded text-sm"
              value={orderFilter}
              onChange={e => {
                if (isOrderFilter(e.target.value)) setOrderFilter(e.target.value);
              }}
            >
              <option value="all">Semua</option>
              <option value="baru">Baru</option>
              <option value="diproses">Diproses</option>
              <option value="selesai">Selesai</option>
            </select>
          </div>
        </div>
        {/* Daftar Pesanan */}
        <div className="bg-white p-4 rounded shadow mb-8">
          {filteredOrders.length === 0 && (
            <div className="text-gray-400 text-center py-8">Belum ada pesanan.</div>
          )}
          <div className="space-y-4">
            {filteredOrders.map(order => (
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
                      <li key={idx} className="flex items-center gap-2 bg-gray-50 rounded px-2 py-1 min-w-[180px]">
                        {/* Gambar menu di pesanan */}
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={40}
                            height={28}
                            className="rounded object-cover border"
                          />
                        )}
                        <div className="flex flex-col items-start gap-1">
                          <div className="font-medium text-sm">{item.name}</div>
                          <div className="text-xs text-gray-500">
                            {item.qty} x {formatRupiah(item.price)}
                          </div>
                          {item.note && (
                            <div className="text-xs text-yellow-600 italic break-words max-w-[150px]">Note: {item.note}</div>
                          )}
                        </div>
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
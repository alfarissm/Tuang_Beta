"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// --- TYPE DEF --- //
type User = {
  id: number;
  nama: string;
  nip: string;
  role: "pembeli" | "penjual" | "admin";
};

type UserPP = {
  id?: number;
  nama: string;
  nip: string;
  role: "pembeli" | "penjual";
};

type Menu = {
  id?: number;
  sellerId: number;
  name: string;
  price: number;
  category: string;
  image: string;
  stok: number;
  updatedBy?: string;
  updatedAt?: string;
};

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
  updatedAt?: string;
  updatedBy?: string;
};

type Category = { value: string; label: string };

// --- DUMMY DATA --- //
const initialCategories: Category[] = [
  { value: "mains", label: "Makanan Utama" },
  { value: "sides", label: "Lauk/Pendamping" },
  { value: "drinks", label: "Minuman" },
  { value: "desserts", label: "Dessert" },
  { value: "others", label: "Lainnya" },
];

const initialUsers: User[] = [
  { id: 2, nama: "Wowo", nip: "456", role: "penjual" },
  { id: 3, nama: "Luhut", nip: "789", role: "penjual" },
  { id: 4, nama: "Admin", nip: "000", role: "admin" },
];

const initialMenus: Menu[] = [
  { id: 101, sellerId: 2, name: "Mie Ayam", price: 15000, category: "mains", image: "/Mie-Ayam.jpg", stok: 10 },
  { id: 102, sellerId: 2, name: "Ayam Bakar", price: 17000, category: "mains", image: "/Ayam bakar.jpg", stok: 5 },
  { id: 201, sellerId: 3, name: "Martabak", price: 25000, category: "mains", image: "/martabak.jpg", stok: 7 },
  { id: 202, sellerId: 3, name: "Jus Alpukat", price: 12000, category: "drinks", image: "/jus.jpg", stok: 12 },
];

const initialOrders: Order[] = [
  {
    id: 555,
    table: "8",
    items: [
      { menuId: 101, sellerId: 2, name: "Mie Ayam", qty: 2, price: 15000, note: "Tanpa bawang" },
      { menuId: 102, sellerId: 2, name: "Ayam Bakar", qty: 3, price: 17000 },
      { menuId: 201, sellerId: 3, name: "Martabak", qty: 1, price: 25000 },
    ],
    status: "selesai",
    createdAt: "2025-06-11T10:00:00Z",
    updatedBy: "admin",
    updatedAt: "2025-06-11T10:01:00Z",
  },
  {
    id: 556,
    table: "7",
    items: [
      { menuId: 202, sellerId: 3, name: "Jus Alpukat", qty: 2, price: 12000 },
      { menuId: 101, sellerId: 2, name: "Mie Ayam", qty: 1, price: 15000 },
    ],
    status: "selesai",
    createdAt: "2025-06-12T09:15:00Z",
    updatedBy: "admin",
    updatedAt: "2025-06-12T09:16:00Z",
  },
  {
    id: 557,
    table: "10",
    items: [
      { menuId: 201, sellerId: 3, name: "Martabak", qty: 2, price: 25000 },
    ],
    status: "selesai",
    createdAt: "2025-06-12T11:35:00Z",
    updatedBy: "admin",
    updatedAt: "2025-06-12T11:36:00Z",
  },
  {
    id: 558,
    table: "1",
    items: [
      { menuId: 101, sellerId: 2, name: "Mie Ayam", qty: 1, price: 15000 },
      { menuId: 202, sellerId: 3, name: "Jus Alpukat", qty: 1, price: 12000 },
    ],
    status: "baru",
    createdAt: "2025-06-13T08:00:00Z"
  }
];

// --- HELPER --- //
function formatRupiah(angka: number) {
  return angka.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}
function downloadCSV(filename: string, rows: string[][]) {
  const process = (v: string) => `"${(v || "").replace(/"/g, '""')}"`;
  const content = rows.map(row => row.map(process).join(",")).join("\r\n");
  const blob = new Blob([content], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}
// --- DEBOUNCE HOOK --- //
function useDebouncedValue<T>(value: T, delay: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}
// --- PAGINATION HOOK --- //
function usePagination<T>(data: T[], pageSize: number) {
  const [page, setPage] = useState(1);
  const pageCount = Math.ceil(data.length / pageSize);
  const pagedData = useMemo(
    () => data.slice((page - 1) * pageSize, page * pageSize),
    [data, page, pageSize]
  );
  useEffect(() => { if (page > pageCount) setPage(1); }, [data.length, pageCount, page]); // <= DITAMBAH 'page'
  return { page, setPage, pageCount, pagedData };
}

// --- MAIN PAGE --- //
export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [menus, setMenus] = useState<Menu[]>(initialMenus);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  const penjualList = users.filter(u => u.role === "penjual");
  const [selectedSeller, setSelectedSeller] = useState<number | "all">(penjualList.length ? penjualList[0].id : "all");
  const [selectedCategory, setSelectedCategory] = useState<string | "all">("all");
  const [searchMenu, setSearchMenu] = useState("");

  // Modal
  const [userModal, setUserModal] = useState<null | { mode: "add" | "edit", role: "pembeli" | "penjual", data?: UserPP }>(null);
  const [menuModal, setMenuModal] = useState<null | { mode: "add" | "edit", data?: Menu }>(null);
  const [categoryModal, setCategoryModal] = useState<null | { mode: "add" | "edit", data?: Category }>(null);

  // Order modal & filter
  const [orderModal, setOrderModal] = useState<null | Order>(null);
  const [orderFilter, setOrderFilter] = useState<string>("all");

  // Aktivitas
  const [logList, setLogList] = useState<string[]>([]);

  const router = useRouter();

  // Finance rekap penjual
  const [selectedFinanceSeller, setSelectedFinanceSeller] = useState<number | "all">("all");
  const penjualOptions = [{ id: "all", nama: "Semua Penjual" }, ...penjualList];
  const getFinanceData = (sellerId: number | "all") => {
    const menuPenjual = menus.filter(m => sellerId === "all" ? true : m.sellerId === sellerId);
    const menuMap = Object.fromEntries(menuPenjual.map(m => [m.id, m]));
    const ordersSelesai = orders.filter(o => o.status === "selesai");
    const sales: Record<number, { name: string; price: number; qty: number; total: number; }> = {};
    ordersSelesai.forEach(order => {
      order.items.forEach(item => {
        if (menuMap[item.menuId]) {
          if (!sales[item.menuId]) {
            sales[item.menuId] = {
              name: item.name,
              price: item.price,
              qty: 0,
              total: 0
            };
          }
          sales[item.menuId].qty += item.qty;
          sales[item.menuId].total += item.qty * item.price;
        }
      });
    });
    const total = Object.values(sales).reduce((t, v) => t + v.total, 0);
    return { sales: Object.values(sales), total };
  };

  // --- PAGINATION SIZE --- //
  const MENU_PAGE_SIZE = 25;
  const ORDER_PAGE_SIZE = 25;

  // --- DEBOUNCE SEARCH MENU --- //
  const debouncedSearchMenu = useDebouncedValue(searchMenu, 300);

  // --- AUTH --- //
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


  // --- CRUD USER --- //
  const handleDeleteUser = (id: number) => {
    if (confirm("Hapus akun ini?")) {
      setUsers(users => users.filter(u => u.id !== id));
      setMenus(menus => menus.filter(m => m.sellerId !== id));
      setLogList(l => [`[${new Date().toLocaleString()}] Admin menghapus user id=${id}`, ...l]);
      if (selectedSeller === id) setSelectedSeller("all");
    }
  };
  const handleOpenAddUser = (role: "pembeli" | "penjual") => setUserModal({ mode: "add", role });
  const handleOpenEditUser = (role: "pembeli" | "penjual", u: User) =>
    setUserModal({
      mode: "edit",
      role,
      data: {
        id: u.id,
        nama: u.nama,
        nip: u.nip,
        role: u.role as "pembeli" | "penjual",
      }
    });
  const handleSaveUser = (u: UserPP) => {
    if (userModal?.mode === "add") {
      const newId = Date.now();
      setUsers(users => [...users, { ...u, id: newId }]);
      setLogList(l => [`[${new Date().toLocaleString()}] Admin menambah user '${u.nama}'`, ...l]);
      if (u.role === "penjual" && selectedSeller === "all") setSelectedSeller(newId);
    } else if (userModal?.mode === "edit") {
      setUsers(users => users.map(us => us.id === u.id ? { ...us, ...u } : us));
      setLogList(l => [`[${new Date().toLocaleString()}] Admin mengedit user '${u.nama}'`, ...l]);
    }
    setUserModal(null);
  };

  // --- CRUD MENU --- //
  const filteredMenus = useMemo(() =>
    menus.filter(m =>
      (selectedSeller === "all" || m.sellerId === selectedSeller) &&
      (selectedCategory === "all" || m.category === selectedCategory) &&
      m.name.toLowerCase().includes(debouncedSearchMenu.toLowerCase())
    ),
    [menus, selectedSeller, selectedCategory, debouncedSearchMenu]
  );
  const { page: menuPage, setPage: setMenuPage, pageCount: menuPageCount, pagedData: pagedMenus } =
    usePagination(filteredMenus, MENU_PAGE_SIZE);

  const handleAddMenu = () => setMenuModal({ mode: "add" });
  const handleEditMenu = (menu: Menu) => setMenuModal({ mode: "edit", data: menu });
  const handleDeleteMenu = (id: number) => {
    if (confirm("Hapus menu ini?")) {
      setMenus(menus => menus.filter(m => m.id !== id));
      setLogList(l => [`[${new Date().toLocaleString()}] Admin menghapus menu id=${id}`, ...l]);
    }
  };
  const handleSaveMenu = (m: Menu) => {
  const sellerId = typeof selectedSeller === "number"
    ? selectedSeller
    : (penjualList[0]?.id || 0);

    if (menuModal?.mode === "add") {
      setMenus(menus => [
        ...menus,
        {
          ...m,
          id: Date.now(),
          sellerId,
          updatedBy: user!.nama,
          updatedAt: new Date().toISOString()
        }
      ]);
      setLogList(l => [`[${new Date().toLocaleString()}] Admin menambah menu '${m.name}'`, ...l]);
    } else if (menuModal?.mode === "edit") {
      setMenus(menus => menus.map(menu =>
        menu.id === m.id
          ? { ...m, sellerId, updatedBy: user.nama, updatedAt: new Date().toISOString() }
          : menu
      ));
      setLogList(l => [`[${new Date().toLocaleString()}] Admin mengedit menu '${m.name}'`, ...l]);
    }
    setMenuModal(null);
  };

  // --- DUPLIKASI MENU --- //
  const handleDuplicateMenu = (menu: Menu) => {
    const otherPenjual = penjualList.filter(p => p.id !== menu.sellerId);
    if (otherPenjual.length === 0) {
      alert("Tidak ada penjual lain untuk duplikasi.");
      return;
    }
    const targetId = prompt("Masukkan ID penjual baru untuk duplikasi menu ini:", String(otherPenjual[0].id));
    const idNum = Number(targetId);
    if (!otherPenjual.some(p => p.id === idNum)) {
      alert("ID penjual tidak valid.");
      return;
    }
    setMenus(menus => [
      ...menus,
      {
        ...menu,
        id: Date.now(),
        sellerId: idNum,
        updatedBy: user.nama,
        updatedAt: new Date().toISOString(),
        name: menu.name + " (Copy)"
      }
    ]);
    setLogList(l => [`[${new Date().toLocaleString()}] Admin menduplikasi menu '${menu.name}' ke penjual id=${idNum}`, ...l]);
  };

  // --- NOTIFIKASI STOK TIPIS --- //
  const stokWarning = useMemo(() => filteredMenus.filter(m => m.stok < 3), [filteredMenus]);

  // --- KATEGORI CRUD --- //
  const handleAddCategory = () => setCategoryModal({ mode: "add" });
  const handleEditCategory = (data: Category) => setCategoryModal({ mode: "edit", data });
  const handleSaveCategory = (c: Category) => {
    if (categoryModal?.mode === "add") {
      setCategories(cats => [...cats, c]);
      setLogList(l => [`[${new Date().toLocaleString()}] Admin menambah kategori '${c.label}'`, ...l]);
    } else if (categoryModal?.mode === "edit") {
      setCategories(cats => cats.map(cat => cat.value === categoryModal.data?.value ? c : cat));
      setLogList(l => [`[${new Date().toLocaleString()}] Admin mengedit kategori '${c.label}'`, ...l]);
    }
    setCategoryModal(null);
  };
  const handleDeleteCategory = (value: string) => {
    if (confirm("Hapus kategori ini?")) {
      setCategories(cats => cats.filter(cat => cat.value !== value));
      setLogList(l => [`[${new Date().toLocaleString()}] Admin menghapus kategori '${value}'`, ...l]);
    }
  };

  // --- EXPORT CSV --- //
  const handleExportMenus = () => {
    const rows = [
      ["ID", "Nama", "Penjual", "Kategori", "Harga", "Stok", "Last Edit", "Last Editor"],
      ...menus.map(m => [
        m.id, m.name,
        penjualList.find(p => p.id === m.sellerId)?.nama || "-",
        categories.find(c => c.value === m.category)?.label || m.category,
        formatRupiah(m.price), m.stok,
        m.updatedAt ? new Date(m.updatedAt).toLocaleString() : "",
        m.updatedBy || ""
      ])
    ];
    downloadCSV("menus.csv", rows);
  };
  const handleExportOrders = () => {
    const rows = [
      ["ID", "Meja", "Status", "Waktu", "Total", "Item List"],
      ...orders.map(o => [
        o.id, o.table, o.status,
        new Date(o.createdAt).toLocaleString(),
        formatRupiah(o.items.reduce((t, i) => t + i.price * i.qty, 0)),
        o.items.map(i => `${i.name} x${i.qty}`).join(", ")
      ])
    ];
    downloadCSV("orders.csv", rows);
  };

  // --- MONITORING PESANAN --- //
  const filteredOrders = useMemo(() =>
    orders.filter(o =>
      orderFilter === "all" || o.status === orderFilter
    ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [orders, orderFilter]
  );
  const { page: orderPage, setPage: setOrderPage, pageCount: orderPageCount, pagedData: pagedOrders } =
    usePagination(filteredOrders, ORDER_PAGE_SIZE);

  // --- STATISTIK --- //
  const totalOrder = orders.length;
  const totalIncome = useMemo(() =>
    orders.filter(o => o.status === "selesai")
      .reduce((sum, order) =>
        sum + order.items.reduce((t, i) => t + i.qty * i.price, 0), 0), [orders]);

  const bestMenu = useMemo(() => {
    const counts: Record<number, number> = {};
    orders.forEach(o => o.items.forEach(i => counts[i.menuId] = (counts[i.menuId] || 0) + i.qty));
    let max = 0, id = 0;
    Object.entries(counts).forEach(([mid, cnt]) => { if (cnt > max) { max = cnt; id = Number(mid); } });
    return menus.find(m => m.id === id);
  }, [orders, menus]);

  // --- RENDER --- //

  if (!user) return null;
  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Image src="/Frame 7.png" alt="Logo" width={40} height={40} />
          <div>
            <h1 className="text-3xl font-bold">Dashboard Admin</h1>
            <p className="text-gray-700">Selamat datang, <b>{user.nama}</b> ({user.nip})</p>
          </div>
        </div>

        {/* --- STATISTIK --- */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="bg-white p-4 rounded shadow min-w-[180px]">
            <div className="text-gray-500 text-sm">Total Pesanan</div>
            <div className="text-2xl font-bold">{totalOrder}</div>
          </div>
          <div className="bg-white p-4 rounded shadow min-w-[180px]">
            <div className="text-gray-500 text-sm">Pesanan Selesai</div>
            <div className="text-2xl font-bold">{orders.filter(o => o.status === "selesai").length}</div>
          </div>
          <div className="bg-white p-4 rounded shadow min-w-[180px]">
            <div className="text-gray-500 text-sm">Pendapatan</div>
            <div className="text-2xl font-bold">{formatRupiah(totalIncome)}</div>
          </div>
          <div className="bg-white p-4 rounded shadow min-w-[180px]">
            <div className="text-gray-500 text-sm">Menu Terlaris</div>
            <div className="text-lg font-bold">{bestMenu ? bestMenu.name : "-"}</div>
          </div>
        </div>

        {/* --- NOTIFIKASI STOK TIPIS --- */}
        {stokWarning.length > 0 && (
          <div className="bg-yellow-100 text-yellow-900 border border-yellow-200 rounded px-4 py-2 mb-4">
            <b>Perhatian!</b> Menu berikut stoknya menipis:{" "}
            {stokWarning.map(m => m.name).join(", ")}
          </div>
        )}

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
                  <th className="py-2 px-3 border">NIP</th>
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
                    <td className="py-2 px-3 border">{u.nip}</td>
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

        {/* --- KATEGORI --- */}
        <div className="bg-white p-4 rounded shadow mb-8">
          <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
            <h2 className="font-bold text-lg">Kategori Menu</h2>
            <button className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
              onClick={handleAddCategory}>+ Tambah Kategori</button>
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
                      <button className="text-blue-600 hover:underline mr-2" onClick={() => handleEditCategory(c)}>Edit</button>
                      <button className="text-red-600 hover:underline" onClick={() => handleDeleteCategory(c.value)} disabled={["mains", "drinks"].includes(c.value)}>Hapus</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- DAFTAR MENU --- */}
        <div className="bg-white p-4 rounded shadow mb-8">
          <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-bold text-lg">Daftar Menu</h2>
              <span className="text-gray-400">Penjual:</span>
              <select
                className="border rounded px-2 py-1"
                value={selectedSeller}
                onChange={e => setSelectedSeller(e.target.value === "all" ? "all" : Number(e.target.value))}
              >
                <option value="all">Semua Penjual</option>
                {penjualList.map(p => (
                  <option key={p.id} value={p.id}>{p.nama}</option>
                ))}
              </select>
              <span className="text-gray-400">Kategori:</span>
              <select
                className="border rounded px-2 py-1"
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
              >
                <option value="all">Semua</option>
                {categories.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
              <input
                className="border px-2 py-1 rounded"
                placeholder="Cari menu"
                value={searchMenu}
                onChange={e => setSearchMenu(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                onClick={handleAddMenu}
                disabled={penjualList.length === 0}
              >+ Tambah Menu</button>
              <button className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                onClick={handleExportMenus}>Export Menu CSV</button>
            </div>
          </div>
          <div className="overflow-x-auto">
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
                      <button className="text-blue-600 hover:underline mr-2" onClick={() => handleEditMenu(menu)}>Edit</button>
                      <button className="text-red-600 hover:underline mr-2" onClick={() => handleDeleteMenu(menu.id!)}>Hapus</button>
                      <button className="text-orange-600 hover:underline" onClick={() => handleDuplicateMenu(menu)}>Duplikat</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {menuPageCount > 1 && (
            <div className="flex justify-center mt-2 gap-1">
              {Array.from({ length: menuPageCount }, (_, i) => (
                <button key={i} className={`px-2 py-1 rounded ${menuPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                  onClick={() => setMenuPage(i + 1)}>{i + 1}</button>
              ))}
            </div>
          )}
        </div>

        {/* --- MONITORING PESANAN --- */}
        <div className="bg-white p-4 rounded shadow mb-8">
          <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-lg">Pesanan Masuk</h2>
              <span className="text-gray-400">Status:</span>
              <select
                className="border rounded px-2 py-1"
                value={orderFilter}
                onChange={e => setOrderFilter(e.target.value)}
              >
                <option value="all">Semua</option>
                <option value="baru">Baru</option>
                <option value="diproses">Diproses</option>
                <option value="selesai">Selesai</option>
              </select>
            </div>
            <button className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
              onClick={handleExportOrders}>Export Pesanan CSV</button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="py-2 px-3 border">ID</th>
                  <th className="py-2 px-3 border">Meja</th>
                  <th className="py-2 px-3 border">Status</th>
                  <th className="py-2 px-3 border">Waktu</th>
                  <th className="py-2 px-3 border">Total</th>
                  <th className="py-2 px-3 border">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {pagedOrders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-6 text-gray-400 text-center">Tidak ada pesanan.</td>
                  </tr>
                )}
                {pagedOrders.map(order => (
                  <tr key={order.id} className="border-t hover:bg-gray-50">
                    <td className="py-2 px-3 border">{order.id}</td>
                    <td className="py-2 px-3 border">{order.table}</td>
                    <td className="py-2 px-3 border">{order.status}</td>
                    <td className="py-2 px-3 border">{new Date(order.createdAt).toLocaleString()}</td>
                    <td className="py-2 px-3 border">
                      {formatRupiah(order.items.reduce((t, i) => t + i.price * i.qty, 0))}
                    </td>
                    <td className="py-2 px-3 border">
                      <button className="text-blue-600 hover:underline mr-2" onClick={() => setOrderModal(order)}>Detail</button>
                      {order.status !== "selesai" && (
                        <button className="text-green-600 hover:underline mr-2"
                          onClick={() => {
                            setOrders(orders => orders.map(o =>
                              o.id === order.id
                                ? { ...o, status: "selesai", updatedBy: user.nama, updatedAt: new Date().toISOString() }
                                : o
                            ));
                            setLogList(l => [`[${new Date().toLocaleString()}] Admin menandai pesanan #${order.id} selesai`, ...l]);
                          }}
                        >Tandai Selesai</button>
                      )}
                      <button className="text-red-600 hover:underline"
                        onClick={() => {
                          if (confirm("Batalkan pesanan?")) {
                            setOrders(orders => orders.filter(o => o.id !== order.id));
                            setLogList(l => [`[${new Date().toLocaleString()}] Admin membatalkan pesanan #${order.id}`, ...l]);
                          }
                        }}>Hapus</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {orderPageCount > 1 && (
            <div className="flex justify-center mt-2 gap-1">
              {Array.from({ length: orderPageCount }, (_, i) => (
                <button key={i} className={`px-2 py-1 rounded ${orderPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                  onClick={() => setOrderPage(i + 1)}>{i + 1}</button>
              ))}
            </div>
          )}
        </div>
        {/* --- REKAP KEUANGAN PENJUAL (QRIS) --- */}
        <div className="bg-white p-4 rounded shadow mb-8">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="font-bold text-lg">Rekap Keuangan Penjual</h2>
            <select
              className="border rounded px-2 py-1"
              value={selectedFinanceSeller}
              onChange={e => setSelectedFinanceSeller(e.target.value === "all" ? "all" : Number(e.target.value))}
            >
              {penjualOptions.map(p => (
                <option key={p.id} value={p.id}>{p.nama}</option>
              ))}
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="py-2 px-3 border">Menu</th>
                  <th className="py-2 px-3 border">Jumlah Terjual</th>
                  <th className="py-2 px-3 border">Harga Satuan</th>
                  <th className="py-2 px-3 border">Total</th>
                </tr>
              </thead>
              <tbody>
                {getFinanceData(selectedFinanceSeller).sales.length === 0 && (
                  <tr><td colSpan={4} className="py-6 text-gray-400 text-center">Belum ada penjualan.</td></tr>
                )}
                {getFinanceData(selectedFinanceSeller).sales.map((s, idx) => (
                  <tr key={idx} className="border-t hover:bg-gray-50">
                    <td className="py-2 px-3 border">{s.name}</td>
                    <td className="py-2 px-3 border">{s.qty}</td>
                    <td className="py-2 px-3 border">{formatRupiah(s.price)}</td>
                    <td className="py-2 px-3 border">{formatRupiah(s.total)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td className="py-2 px-3 border font-bold" colSpan={3}>Total Pendapatan</td>
                  <td className="py-2 px-3 border font-bold">{formatRupiah(getFinanceData(selectedFinanceSeller).total)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        {/* --- RIWAYAT (LOG AKTIVITAS) --- */}
        <div className="bg-white p-4 rounded shadow mb-8">
          <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
            <h2 className="font-bold text-lg">Log Aktivitas</h2>
          </div>
          <div className="max-h-48 overflow-y-auto text-xs font-mono">
            {logList.length === 0 && <div className="text-gray-400">Belum ada aktivitas.</div>}
            <ul>
              {logList.map((log, idx) => (
                <li key={idx}>{log}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* --- MODAL USER --- */}
        {userModal && (
          <UserModal
            mode={userModal.mode}
            data={userModal.data}
            role={userModal.role}
            onClose={() => setUserModal(null)}
            onSave={handleSaveUser}
          />
        )}

        {/* --- MODAL MENU --- */}
        {menuModal && (
          <MenuModal
            mode={menuModal.mode}
            data={menuModal.data}
            penjualList={penjualList}
            selectedSeller={selectedSeller}
            categories={categories}
            onClose={() => setMenuModal(null)}
            onSave={handleSaveMenu}
          />
        )}

        {/* --- MODAL KATEGORI --- */}
        {categoryModal && (
          <CategoryModal
            mode={categoryModal.mode}
            data={categoryModal.data}
            onClose={() => setCategoryModal(null)}
            onSave={handleSaveCategory}
          />
        )}

        {/* --- MODAL DETAIL ORDER --- */}
        {orderModal && (
          <OrderModal
            data={orderModal}
            onClose={() => setOrderModal(null)}
          />
        )}
      </div>
    </div>
  );
}

// --- MODAL: USER --- //
function UserModal({ mode, data, role, onClose, onSave }:{
  mode: "add" | "edit",
  data?: UserPP,
  role: "pembeli" | "penjual",
  onClose: () => void,
  onSave: (d: UserPP) => void
}) {
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <form className="bg-white rounded p-6 w-full max-w-xs space-y-3" onSubmit={handleSubmit}>
        <div className="font-bold text-lg mb-2">{mode==="add"?`Tambah ${role.charAt(0).toUpperCase()+role.slice(1)}`:`Edit ${role.charAt(0).toUpperCase()+role.slice(1)}`}</div>
        {error && <div className="text-red-600">{error}</div>}
        <div>
          <label className="block mb-1 font-medium">Nama</label>
          <input className="w-full border rounded px-2 py-1" value={nama} onChange={e=>setNama(e.target.value)} />
        </div>
        <div>
          <label className="block mb-1 font-medium">NIP</label>
          <input className="w-full border rounded px-2 py-1" value={nip} onChange={e=>setNip(e.target.value)} />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="px-4 py-1 rounded bg-gray-200" onClick={onClose}>Batal</button>
          <button type="submit" className="px-4 py-1 rounded bg-green-500 text-white">{mode==="add"?"Tambah":"Simpan"}</button>
        </div>
      </form>
    </div>
  );
}

// --- MODAL: MENU --- //
function MenuModal({ mode, data, penjualList, selectedSeller, categories, onClose, onSave }: {
  mode: "add" | "edit",
  data?: Menu,
  penjualList: User[],
  selectedSeller: number | "all",
  categories: Category[],
  onClose: () => void,
  onSave: (d: Menu) => void
}) {
  const [name, setName] = useState(data?.name || "");
  const [category, setCategory] = useState(data?.category || "mains");
  const [price, setPrice] = useState(data?.price ? String(data.price) : "");
  const [stok, setStok] = useState(data?.stok ?? 1);
  const [sellerId, setSellerId] = useState<number>(
    typeof selectedSeller === "number"
      ? selectedSeller
      : data?.sellerId ?? (penjualList[0]?.id || 0)
  );
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
      image: imageFile ? imagePreview : imagePreview || "/Mie-Ayam.jpg",
      sellerId: sellerId,
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
            min={1}
            className="w-full border rounded px-2 py-1"
            value={stok}
            onChange={handleStokChange}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Penjual</label>
          <select
            className="w-full border rounded px-2 py-1"
            value={sellerId}
            onChange={e => setSellerId(Number(e.target.value))}
            disabled={typeof selectedSeller === "number" && !!selectedSeller}
          >
            {penjualList.map(p => (
              <option key={p.id} value={p.id}>{p.nama}</option>
            ))}
          </select>
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

// --- MODAL: KATEGORI --- //
function CategoryModal({ mode, data, onClose, onSave }: {
  mode: "add" | "edit",
  data?: Category,
  onClose: () => void,
  onSave: (d: Category) => void
}) {
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
}

// --- MODAL: ORDER DETAIL --- //
function OrderModal({ data, onClose }: { data: Order, onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded p-6 w-full max-w-md">
        <div className="font-bold text-lg mb-2">Detail Pesanan</div>
        <div className="mb-2 text-sm">ID: <b>{data.id}</b></div>
        <div className="mb-2 text-sm">Meja: <b>{data.table}</b></div>
        <div className="mb-2 text-sm">Status: <b>{data.status}</b></div>
        <div className="mb-2 text-sm">Dibuat: {new Date(data.createdAt).toLocaleString()}</div>
        {data.updatedAt && <div className="mb-2 text-sm">Update: {new Date(data.updatedAt).toLocaleString()} oleh {data.updatedBy}</div>}
        <div className="font-semibold mt-4 mb-2">Item:</div>
        <ul className="mb-2">
          {data.items.map((i, idx) => (
            <li key={idx} className="mb-1">
              {i.name} <b>x{i.qty}</b> ({formatRupiah(i.price)}) {i.note && <span className="text-xs text-yellow-800">Note: {i.note}</span>}
            </li>
          ))}
        </ul>
        <div className="font-bold mt-4">Total: {formatRupiah(data.items.reduce((t, i) => t + i.price * i.qty, 0))}</div>
        <div className="flex justify-end gap-2 pt-4">
          <button className="px-4 py-1 rounded bg-gray-200" onClick={onClose}>Tutup</button>
        </div>
      </div>
    </div>
  );
}
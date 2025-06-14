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
  { id: 101, sellerId: 2, name: "Mie Ayam", price: 15000, category: "mains", image: "/Mie-ayam.jpg", stok: 10 },
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
  useEffect(() => { if (page > pageCount) setPage(1); }, [data.length, pageCount, page]);
  return { page, setPage, pageCount, pagedData };
}

// --- SIDEBAR MENU ITEM --- //
type MenuItemProps = {
  icon: React.ReactNode;
  text: string;
  active: boolean;
  onClick: () => void;
  count?: number;
};

const MenuItem = ({ icon, text, active, onClick, count }: MenuItemProps) => {
  return (
    <li 
      className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all rounded-lg ${
        active ? "bg-blue-500 text-white" : "hover:bg-gray-100"
      }`}
      onClick={onClick}
    >
      <div className="text-xl">{icon}</div>
      <span className="flex-grow">{text}</span>
      {count !== undefined && (
        <span className={`rounded-full px-2 text-xs font-medium ${
          active ? "bg-white text-blue-500" : "bg-blue-500 text-white"
        }`}>
          {count}
        </span>
      )}
    </li>
  );
};

// --- MAIN PAGE --- //
export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [menus, setMenus] = useState<Menu[]>(initialMenus);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
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
  const [searchOrder, setSearchOrder] = useState("");

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
          ? { ...m, sellerId, updatedBy: user!.nama, updatedAt: new Date().toISOString() }
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
        updatedBy: user!.nama,
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
      ["ID", "Nama", "Penjual", "Kategori", "Harga", "Stok"],
      ...menus.map(m => [
        `${m.id ?? ""}`,
        m.name ?? "",
        penjualList.find(p => p.id === m.sellerId)?.nama || "-",
        categories.find(c => c.value === m.category)?.label || m.category,
        formatRupiah(m.price),
        `${m.stok}`
      ])
    ];
    downloadCSV("menus.csv", rows);
  };
  
  const handleExportOrders = () => {
    const rows = [
      ["ID", "Meja", "Status", "Waktu", "Total", "Item List"],
      ...orders.map(o => [
        `${o.id ?? ""}`,
        `${o.table ?? ""}`,
        `${o.status ?? ""}`,
        new Date(o.createdAt).toLocaleString(),
        formatRupiah(o.items.reduce((t, i) => t + i.price * i.qty, 0)),
        o.items.map(i => `${i.name ?? ""} x${i.qty ?? ""}`).join(", ")
      ])
    ];
    downloadCSV("orders.csv", rows);
  };

  // --- MONITORING PESANAN --- //
  const filteredOrders = orders
    .filter(order => orderFilter === "all" || order.status === orderFilter)
    .filter(order =>
      searchOrder.trim() === "" ||
      `${order.id}`.includes(searchOrder) ||
      order.table.toLowerCase().includes(searchOrder.toLowerCase()) ||
      order.items.some(i => i.name.toLowerCase().includes(searchOrder.toLowerCase())) ||
      order.createdAt.toLowerCase().includes(searchOrder.toLowerCase())
    );
    
  const { page: orderPage, setPage: setOrderPage, pageCount: orderPageCount, pagedData: pagedOrders } =
    usePagination(filteredOrders, ORDER_PAGE_SIZE);

  // Count orders by status
  const newOrdersCount = orders.filter(o => o.status === "baru").length;
  const inProgressOrdersCount = orders.filter(o => o.status === "diproses").length;

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

  // --- SIDEBAR NAVIGATION --- //
  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return renderDashboard();
      case "sellers":
        return renderSellers();
      case "categories":
        return renderCategories();
      case "menus":
        return renderMenus();
      case "orders":
        return renderOrders();
      case "finance":
        return renderFinance();
      case "activity":
        return renderActivity();
      default:
        return renderDashboard();
    }
  };

  // --- RENDER SECTIONS --- //
  const renderDashboard = () => (
    <>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-2 gap-4 mb-8 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-gray-500 text-sm">Total Pesanan</div>
          <div className="text-2xl font-bold">{totalOrder}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-gray-500 text-sm">Pesanan Selesai</div>
          <div className="text-2xl font-bold">
            {orders.filter((o) => o.status === "selesai").length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-gray-500 text-sm">Pendapatan</div>
          <div className="text-2xl font-bold">{formatRupiah(totalIncome)}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-gray-500 text-sm">Menu Terlaris</div>
          <div className="text-lg font-bold">{bestMenu ? bestMenu.name : "-"}</div>
        </div>
      </div>

      {stokWarning.length > 0 && (
        <div className="bg-yellow-100 text-yellow-900 border border-yellow-200 rounded-lg px-4 py-3 mb-8">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="font-bold">Perhatian!</span>
          </div>
          <p className="mt-1">Menu berikut stoknya menipis: {stokWarning.map(m => m.name).join(", ")}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-lg shadow">
          <h2 className="font-bold text-lg mb-4">Pesanan Terbaru</h2>
          {pagedOrders.slice(0, 5).map(order => (
            <div key={order.id} className="border-b py-2 last:border-b-0">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">Pesanan #{order.id} - Meja {order.table}</div>
                  <div className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</div>
                </div>
                <div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    order.status === "baru" ? "bg-yellow-100 text-yellow-800" :
                    order.status === "diproses" ? "bg-blue-100 text-blue-800" :
                    "bg-green-100 text-green-800"
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
          <button 
            className="text-blue-500 hover:underline text-sm mt-3 inline-flex items-center"
            onClick={() => setActiveSection("orders")}
          >
            Lihat semua pesanan
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        <div className="bg-white p-5 rounded-lg shadow">
          <h2 className="font-bold text-lg mb-4">Menu Terpopuler</h2>
          {menus
            .sort((a, b) => {
              const countA = orders.reduce((sum, o) => sum + o.items.filter(i => i.menuId === a.id).reduce((s, i) => s + i.qty, 0), 0);
              const countB = orders.reduce((sum, o) => sum + o.items.filter(i => i.menuId === b.id).reduce((s, i) => s + i.qty, 0), 0);
              return countB - countA;
            })
            .slice(0, 5)
            .map(menu => (
              <div key={menu.id} className="flex items-center gap-3 py-2 border-b last:border-b-0">
                <Image
                  src={menu.image}
                  alt={menu.name}
                  width={40}
                  height={40}
                  className="rounded-md object-cover"
                />
                <div className="flex-grow">
                  <div className="font-medium">{menu.name}</div>
                  <div className="text-sm text-gray-500">
                    {penjualList.find(p => p.id === menu.sellerId)?.nama || "-"}
                  </div>
                </div>
                <div className="font-bold">{formatRupiah(menu.price)}</div>
              </div>
          ))}
          <button 
            className="text-blue-500 hover:underline text-sm mt-3 inline-flex items-center"
            onClick={() => setActiveSection("menus")}
          >
            Lihat semua menu
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );

  const renderSellers = () => (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold text-xl">Akun Penjual</h2>
        <button 
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 flex items-center gap-2"
          onClick={() => handleOpenAddUser("penjual")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tambah Penjual
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIP</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {penjualList.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-gray-400 text-center">Tidak ada akun penjual.</td>
              </tr>
            ) : (
              penjualList.map(u => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{u.nama}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{u.nip}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-blue-600 hover:text-blue-800 mr-3" onClick={() => handleOpenEditUser("penjual", u)}>
                      <span className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Edit
                      </span>
                    </button>
                    <button className="text-red-600 hover:text-red-800" onClick={() => handleDeleteUser(u.id)}>
                      <span className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Hapus
                      </span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCategories = () => (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold text-xl">Kategori Menu</h2>
        <button 
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 flex items-center gap-2"
          onClick={handleAddCategory}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tambah Kategori
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Label</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-gray-400 text-center">Tidak ada kategori.</td>
              </tr>
            ) : (
              categories.map(c => (
                <tr key={c.value} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{c.value}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{c.label}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-blue-600 hover:text-blue-800 mr-3" onClick={() => handleEditCategory(c)}>
                      <span className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Edit
                      </span>
                    </button>
                    <button 
                      className={`text-red-600 hover:text-red-800 ${["mains", "drinks"].includes(c.value) ? "opacity-50 cursor-not-allowed" : ""}`}
                      onClick={() => !["mains", "drinks"].includes(c.value) && handleDeleteCategory(c.value)} 
                      disabled={["mains", "drinks"].includes(c.value)}
                    >
                      <span className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Hapus
                      </span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderMenus = () => (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold text-xl">Daftar Menu</h2>
        <div className="flex gap-2">
          <button 
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 flex items-center gap-2"
            onClick={handleAddMenu}
            disabled={penjualList.length === 0}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tambah Menu
          </button>
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center gap-2"
            onClick={handleExportMenus}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export CSV
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="flex flex-col">
          <label className="text-sm text-gray-500 mb-1">Penjual:</label>
          <select
            className="border rounded px-3 py-2"
            value={selectedSeller}
            onChange={e =>
              setSelectedSeller(e.target.value === "all" ? "all" : Number(e.target.value))
            }
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
            className="border rounded px-3 py-2"
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
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
            className="border px-3 py-2 rounded"
            placeholder="Cari menu"
            value={searchMenu}
            onChange={e => setSearchMenu(e.target.value)}
          />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gambar</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Penjual</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stok</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Edit</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pagedMenus.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-gray-400 text-center">Tidak ada menu.</td>
              </tr>
            ) : (
              pagedMenus.map(menu => (
                <tr key={menu.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Image src={menu.image} alt={menu.name} width={56} height={40} className="rounded-md object-cover" />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{menu.name}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {penjualList.find(p => p.id === menu.sellerId)?.nama || "-"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap capitalize">
                    {categories.find(c => c.value === menu.category)?.label || menu.category}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{formatRupiah(menu.price)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      menu.stok < 3 ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                    }`}>
                      {menu.stok}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs">
                    {menu.updatedAt ? new Date(menu.updatedAt).toLocaleString() : "-"}<br />
                    <span className="text-gray-500">{menu.updatedBy || ""}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <button className="text-blue-600 hover:text-blue-800 mr-2" onClick={() => handleEditMenu(menu)}>Edit</button>
                    <button className="text-red-600 hover:text-red-800 mr-2" onClick={() => handleDeleteMenu(menu.id!)}>Hapus</button>
                    <button className="text-orange-600 hover:text-orange-800" onClick={() => handleDuplicateMenu(menu)}>Duplikat</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {menuPageCount > 1 && (
        <div className="flex justify-center mt-6 gap-1">
          {Array.from({ length: menuPageCount }, (_, i) => (
            <button key={i} className={`px-3 py-1 rounded ${menuPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
              onClick={() => setMenuPage(i + 1)}>{i + 1}</button>
          ))}
        </div>
      )}
    </div>
  );

  const renderOrders = () => (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h2 className="font-bold text-xl">Pesanan</h2>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Status:</span>
            <select
              className="border rounded px-3 py-2"
              value={orderFilter}
              onChange={e => setOrderFilter(e.target.value)}
            >
              <option value="all">Semua</option>
              <option value="baru">Baru</option>
              <option value="diproses">Diproses</option>
              <option value="selesai">Selesai</option>
            </select>
          </div>
        </div>
        
        <div className="flex gap-4">
          <input
            className="border px-3 py-2 rounded"
            placeholder="Cari pesanan (ID, meja, dll)"
            value={searchOrder}
            onChange={e => setSearchOrder(e.target.value)}
          />
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center gap-2"
            onClick={handleExportOrders}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export CSV
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIP/NIM</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Meja</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pagedOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-gray-400 text-center">Tidak ada pesanan.</td>
              </tr>
            ) : (
              pagedOrders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.table}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      order.status === "baru" ? "bg-yellow-100 text-yellow-800" :
                      order.status === "diproses" ? "bg-blue-100 text-blue-800" :
                      "bg-green-100 text-green-800"
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(order.createdAt).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">
                    {formatRupiah(order.items.reduce((t, i) => t + i.price * i.qty, 0))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-blue-600 hover:text-blue-800 mr-3" onClick={() => setOrderModal(order)}>
                      <span className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Detail
                      </span>
                    </button>
                    {order.status !== "selesai" && (
                      <button 
                        className="text-green-600 hover:text-green-800 mr-3"
                        onClick={() => {
                          setOrders(orders => orders.map(o =>
                            o.id === order.id
                              ? { ...o, status: "selesai", updatedBy: user!.nama, updatedAt: new Date().toISOString() }
                              : o
                          ));
                          setLogList(l => [`[${new Date().toLocaleString()}] Admin menandai pesanan #${order.id} selesai`, ...l]);
                        }}
                      >
                        <span className="flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Selesai
                        </span>
                      </button>
                    )}
                    <button 
                      className="text-red-600 hover:text-red-800"
                      onClick={() => {
                        if (confirm("Batalkan pesanan?")) {
                          setOrders(orders => orders.filter(o => o.id !== order.id));
                          setLogList(l => [`[${new Date().toLocaleString()}] Admin membatalkan pesanan #${order.id}`, ...l]);
                        }
                      }}
                    >
                      <span className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Hapus
                      </span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {orderPageCount > 1 && (
        <div className="flex justify-center mt-6 gap-1">
          {Array.from({ length: orderPageCount }, (_, i) => (
            <button key={i} className={`px-3 py-1 rounded ${orderPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
              onClick={() => setOrderPage(i + 1)}>{i + 1}</button>
          ))}
        </div>
      )}
    </div>
  );

  const renderFinance = () => (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center gap-4 mb-6">
        <h2 className="font-bold text-xl">Rekap Keuangan Penjual</h2>
        <select
          className="border rounded px-3 py-2"
          value={selectedFinanceSeller}
          onChange={e => setSelectedFinanceSeller(e.target.value === "all" ? "all" : Number(e.target.value))}
        >
          {penjualOptions.map(p => (
            <option key={p.id} value={p.id}>{p.nama}</option>
          ))}
        </select>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Menu</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah Terjual</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga Satuan</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {getFinanceData(selectedFinanceSeller).sales.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-gray-400 text-center">Belum ada penjualan.</td>
              </tr>
            ) : (
              getFinanceData(selectedFinanceSeller).sales.map((s, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{s.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{s.qty}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatRupiah(s.price)}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{formatRupiah(s.total)}</td>
                </tr>
              ))
            )}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50">
              <td className="px-6 py-4 font-bold text-right" colSpan={3}>Total Pendapatan</td>
              <td className="px-6 py-4 font-bold">{formatRupiah(getFinanceData(selectedFinanceSeller).total)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );

  const renderActivity = () => (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center mb-6">
        <h2 className="font-bold text-xl">Log Aktivitas</h2>
      </div>
      
      <div className="max-h-[600px] overflow-y-auto text-sm font-mono bg-gray-50 rounded-lg p-4 border border-gray-200">
        {logList.length === 0 ? (
          <div className="text-gray-400 text-center py-4">Belum ada aktivitas.</div>
        ) : (
          <ul className="space-y-1">
            {logList.map((log, idx) => (
              <li key={idx} className="border-b border-gray-100 py-1 last:border-b-0">{log}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );

  // --- RENDER --- //
  if (!user) return null;
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* SIDEBAR */}
        <div className={`bg-white shadow-md h-screen transition-all duration-300 ${sidebarOpen ? "w-64" : "w-20"}`}>
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className={`p-4 flex items-center ${sidebarOpen ? "justify-between" : "justify-center"} border-b`}>
              <div className="flex items-center gap-3">
                <Image src="/Frame 7.png" alt="Logo" width={32} height={32} />
                {sidebarOpen && <div className="font-bold text-lg">Tuang</div>}
              </div>
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-gray-500 hover:text-gray-700"
              >
                {sidebarOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            </div>
            
                        {/* User */}
            <div className={`p-4 ${sidebarOpen ? "" : "flex justify-center"} border-b`}>
              <div className={`${sidebarOpen ? "" : "text-center"}`}>
                <div className={`w-12 h-12 bg-blue-500 rounded-full mx-auto flex items-center justify-center text-white font-bold text-xl`}>
                  {user.nama.charAt(0).toUpperCase()}
                </div>
                {sidebarOpen && (
                  <div className="mt-2">
                    <div className="font-medium">{user.nama}</div>
                    <div className="text-xs text-gray-500">{user.nip} · {user.role}</div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Menu */}
            <nav className="p-2 flex-grow overflow-y-auto">
              <ul className="space-y-1">
                <MenuItem 
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  } 
                  text={sidebarOpen ? "Dashboard" : ""}
                  active={activeSection === "dashboard"} 
                  onClick={() => setActiveSection("dashboard")} 
                />
                
                <MenuItem 
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  } 
                  text={sidebarOpen ? "Akun Penjual" : ""}
                  active={activeSection === "sellers"} 
                  onClick={() => setActiveSection("sellers")} 
                />
                
                <MenuItem 
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  } 
                  text={sidebarOpen ? "Kategori Menu" : ""}
                  active={activeSection === "categories"} 
                  onClick={() => setActiveSection("categories")} 
                />
                
                <MenuItem 
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  } 
                  text={sidebarOpen ? "Daftar Menu" : ""}
                  active={activeSection === "menus"} 
                  onClick={() => setActiveSection("menus")} 
                  count={stokWarning.length > 0 ? stokWarning.length : undefined}
                />
                
                <MenuItem 
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  } 
                  text={sidebarOpen ? "Pesanan" : ""}
                  active={activeSection === "orders"} 
                  onClick={() => setActiveSection("orders")} 
                  count={newOrdersCount > 0 ? newOrdersCount : undefined}
                />
                
                <MenuItem 
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  } 
                  text={sidebarOpen ? "Keuangan" : ""}
                  active={activeSection === "finance"} 
                  onClick={() => setActiveSection("finance")} 
                />
                
                <MenuItem 
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  } 
                  text={sidebarOpen ? "Aktivitas" : ""}
                  active={activeSection === "activity"} 
                  onClick={() => setActiveSection("activity")} 
                />
              </ul>
            </nav>
            
            {/* Logout */}
            <div className="p-4 border-t">
              <button 
                className={`flex items-center gap-3 text-red-500 hover:text-red-600 ${sidebarOpen ? "" : "justify-center"}`}
                onClick={() => {
                  if (confirm("Yakin ingin keluar?")) {
                    localStorage.removeItem("user");
                    router.replace("/login");
                  }
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                {sidebarOpen && <span>Logout</span>}
              </button>
            </div>
          </div>
        </div>
        
        {/* MAIN CONTENT */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {renderSection()}
          </div>
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
      <form className="bg-white rounded-lg p-6 w-full max-w-md space-y-4" onSubmit={handleSubmit}>
        <div className="font-bold text-xl mb-2">{mode==="add"?`Tambah ${role.charAt(0).toUpperCase()+role.slice(1)}`:`Edit ${role.charAt(0).toUpperCase()+role.slice(1)}`}</div>
        {error && <div className="text-red-600 bg-red-50 p-2 rounded">{error}</div>}
        <div>
          <label className="block mb-1 font-medium">Nama</label>
          <input className="w-full border rounded-lg px-3 py-2" value={nama} onChange={e=>setNama(e.target.value)} />
        </div>
        <div>
          <label className="block mb-1 font-medium">NIP</label>
          <input className="w-full border rounded-lg px-3 py-2" value={nip} onChange={e=>setNip(e.target.value)} />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300" onClick={onClose}>Batal</button>
          <button type="submit" className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white">{mode==="add"?"Tambah":"Simpan"}</button>
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
      image: imageFile ? imagePreview : imagePreview || "/Mie-ayam.jpg",
      sellerId: sellerId,
      stok
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <form className="bg-white rounded-lg p-6 w-full max-w-md space-y-4" onSubmit={handleSubmit}>
        <div className="font-bold text-xl mb-2">{mode === "add" ? "Tambah Menu" : "Edit Menu"}</div>
        {error && <div className="text-red-600 bg-red-50 p-2 rounded">{error}</div>}
        <div>
          <label className="block mb-1 font-medium">Nama Menu</label>
          <input className="w-full border rounded-lg px-3 py-2" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div>
          <label className="block mb-1 font-medium">Kategori</label>
          <select className="w-full border rounded-lg px-3 py-2" value={category} onChange={e => setCategory(e.target.value)}>
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
            className="w-full border rounded-lg px-3 py-2"
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
            className="w-full border rounded-lg px-3 py-2"
            value={stok}
            onChange={handleStokChange}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Penjual</label>
          <select
            className="w-full border rounded-lg px-3 py-2"
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
          <div className="flex items-center gap-4">
            {imagePreview && (
              <div className="flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imagePreview} alt="Preview Gambar" width={100} height={64} className="rounded-lg object-cover" />
              </div>
            )}
            <div className="flex-grow">
              <label className="block w-full bg-blue-500 text-white text-center px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition-all">
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
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300" onClick={onClose}>Batal</button>
          <button type="submit" className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white">{mode === "add" ? "Tambah" : "Simpan"}</button>
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
      <form className="bg-white rounded-lg p-6 w-full max-w-md space-y-4" onSubmit={handleSubmit}>
        <div className="font-bold text-xl mb-2">{mode === "add" ? "Tambah Kategori" : "Edit Kategori"}</div>
        {error && <div className="text-red-600 bg-red-50 p-2 rounded">{error}</div>}
        <div>
          <label className="block mb-1 font-medium">Label</label>
          <input className="w-full border rounded-lg px-3 py-2" value={label} onChange={e => setLabel(e.target.value)} />
        </div>
        <div>
          <label className="block mb-1 font-medium">Value</label>
          <input className="w-full border rounded-lg px-3 py-2" value={value} onChange={e => setValue(e.target.value)} disabled={mode === "edit"} />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300" onClick={onClose}>Batal</button>
          <button type="submit" className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white">{mode === "add" ? "Tambah" : "Simpan"}</button>
        </div>
      </form>
    </div>
  );
}

// --- MODAL: ORDER DETAIL --- //
function OrderModal({ data, onClose }: { data: Order, onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <div className="font-bold text-xl">Detail Pesanan #{data.id}</div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <div className="text-sm text-gray-500">Meja</div>
            <div className="font-medium text-xl">{data.table}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Status</div>
            <div>
              <span className={`px-3 py-1 inline-block rounded-full text-sm ${
                data.status === "baru" ? "bg-yellow-100 text-yellow-800" :
                data.status === "diproses" ? "bg-blue-100 text-blue-800" :
                "bg-green-100 text-green-800"
              }`}>
                {data.status}
              </span>
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Dibuat</div>
            <div className="font-medium">{new Date(data.createdAt).toLocaleString()}</div>
          </div>
          {data.updatedAt && (
            <div>
              <div className="text-sm text-gray-500">Diperbarui</div>
              <div className="font-medium">{new Date(data.updatedAt).toLocaleString()} oleh {data.updatedBy}</div>
            </div>
          )}
        </div>
        
        <div className="mb-6">
          <div className="font-medium text-lg mb-3">Daftar Item</div>
          <div className="bg-gray-50 rounded-lg p-4">
            {data.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center py-2 border-b last:border-0">
                <div>
                  <div className="font-medium">{item.name}</div>
                  {item.note && <div className="text-sm text-yellow-600">Note: {item.note}</div>}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 text-sm">x{item.qty}</span>
                  <span className="font-medium">{formatRupiah(item.price)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between items-center font-bold text-xl">
          <span>Total</span>
          <span>{formatRupiah(data.items.reduce((t, i) => t + i.price * i.qty, 0))}</span>
        </div>
        
        <div className="flex justify-end mt-6">
          <button className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300" onClick={onClose}>Tutup</button>
        </div>
      </div>
    </div>
  );
}
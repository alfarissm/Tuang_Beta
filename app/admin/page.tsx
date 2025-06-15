"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  User, 
  Menu, 
  Order, 
  Category, 
  UserPP 
} from "@/app/admin/types/index";
import { 
  initialUsers, 
  initialMenus, 
  initialOrders, 
  initialCategories 
} from "@/app/admin/data/mockData";
import { useDebouncedValue } from "@/app/admin/hooks/useDebouncedValue";
import { usePagination } from "@/app/admin/hooks/usePagination";
import { downloadCSV } from "@/app/admin/utils/export";
import { HamburgerIcon, CloseIcon } from "@/app/admin/components/icons/Icons"; // Updated import path
import { Sidebar } from "@/app/admin/components/Sidebar";
// Rest of imports remain the same
import { Dashboard } from "./components/Dashboard";
import { UserManagement } from "./components/UserManagement";
import { CategoryManagement } from "./components/CategoryManagement";
import { MenuManagement } from "./components/MenuManagement";
import { OrderManagement } from "./components/OrderManagement";
import { FinanceReport } from "./components/FinanceReport";
import { ActivityLogs } from "./components/ActivityLogs";

// Constants
const MENU_PAGE_SIZE = 25;
const ORDER_PAGE_SIZE = 25;

export default function AdminPage() {
  const router = useRouter();
  
  // User auth state
  const [user, setUser] = useState<User | null>(null);
  
  // Data states
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [menus, setMenus] = useState<Menu[]>(initialMenus);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  
  // UI states
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Filtered lists
  const penjualList = users.filter(u => u.role === "penjual");
  
  // Filtering and search states
  const [selectedSeller, setSelectedSeller] = useState<number | "all">(penjualList.length ? penjualList[0].id : "all");
  const [selectedCategory, setSelectedCategory] = useState<string | "all">("all");
  const [searchMenu, setSearchMenu] = useState("");
  const debouncedSearchMenu = useDebouncedValue(searchMenu, 300);
  
  // Modal states
  const [userModal, setUserModal] = useState<null | { mode: "add" | "edit", role: "pembeli" | "penjual", data?: UserPP }>(null);
  const [menuModal, setMenuModal] = useState<null | { mode: "add" | "edit", data?: Menu }>(null);
  const [categoryModal, setCategoryModal] = useState<null | { mode: "add" | "edit", data?: Category }>(null);
  const [orderModal, setOrderModal] = useState<null | Order>(null);
  
  // Order filter states
  const [orderFilter, setOrderFilter] = useState<string>("all");
  const [searchOrder, setSearchOrder] = useState("");
  
  // Activity log
  const [logList, setLogList] = useState<string[]>([]);
  
  // Finance report state
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedFinanceSeller, setSelectedFinanceSeller] = useState<number | "all">("all");

  // Add log helper function
  const addLog = (message: string) => {
    setLogList(l => [`[${new Date().toLocaleString()}] ${message}`, ...l]);
  };
  
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

  // --- FILTERED MENUS --- //
  const filteredMenus = useMemo(() =>
    menus.filter(m =>
      (selectedSeller === "all" || m.sellerId === selectedSeller) &&
      (selectedCategory === "all" || m.category === selectedCategory) &&
      m.name.toLowerCase().includes(debouncedSearchMenu.toLowerCase())
    ),
    [menus, selectedSeller, selectedCategory, debouncedSearchMenu]
  );
  
  // --- MENU PAGINATION --- //
  const { 
    page: menuPage, 
    setPage: setMenuPage, 
    pageCount: menuPageCount, 
    pagedData: pagedMenus 
  } = usePagination(filteredMenus, MENU_PAGE_SIZE);

  // --- FILTERED ORDERS --- //
  const filteredOrders = useMemo(() =>
    orders
      .filter(order => orderFilter === "all" || order.status === orderFilter)
      .filter(order =>
        searchOrder.trim() === "" ||
        `${order.id}`.includes(searchOrder) ||
        order.table.toLowerCase().includes(searchOrder.toLowerCase()) ||
        order.items.some(i => i.name.toLowerCase().includes(searchOrder.toLowerCase())) ||
        order.createdAt.toLowerCase().includes(searchOrder.toLowerCase())
      ),
    [orders, orderFilter, searchOrder]
  );
  
  // --- ORDER PAGINATION --- //
  const {
    page: orderPage,
    setPage: setOrderPage,
    pageCount: orderPageCount,
    pagedData: pagedOrders
  } = usePagination(filteredOrders, ORDER_PAGE_SIZE);

  // --- USER MANAGEMENT --- //
  const handleDeleteUser = (id: number) => {
    const userToDelete = users.find(u => u.id === id);
    if (!userToDelete) return;
    
    if (confirm("Hapus akun ini?")) {
      setUsers(users => users.filter(u => u.id !== id));
      setMenus(menus => menus.filter(m => m.sellerId !== id));
      addLog(`Admin menghapus user id=${id} (${userToDelete.nama})`);
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
      addLog(`Admin menambah user '${u.nama}'`);
      if (u.role === "penjual" && selectedSeller === "all") setSelectedSeller(newId);
    } else if (userModal?.mode === "edit") {
      setUsers(users => users.map(us => us.id === u.id ? { ...us, ...u } : us));
      addLog(`Admin mengedit user '${u.nama}'`);
    }
    setUserModal(null);
  };

  // --- CATEGORY MANAGEMENT --- //
  const handleAddCategory = () => setCategoryModal({ mode: "add" });
  
  const handleEditCategory = (cat: Category) => setCategoryModal({ mode: "edit", data: cat });
  
  const handleSaveCategory = (c: Category) => {
    if (categoryModal?.mode === "add") {
      setCategories(cats => [...cats, c]);
      addLog(`Admin menambah kategori '${c.label}'`);
    } else if (categoryModal?.mode === "edit") {
      setCategories(cats => cats.map(cat => cat.value === categoryModal.data?.value ? c : cat));
      addLog(`Admin mengedit kategori '${c.label}'`);
    }
    setCategoryModal(null);
  };
  
  const handleDeleteCategory = (value: string) => {
    if (confirm("Hapus kategori ini?")) {
      setCategories(cats => cats.filter(cat => cat.value !== value));
      addLog(`Admin menghapus kategori '${value}'`);
    }
  };

  // --- MENU MANAGEMENT --- //
  const handleAddMenu = () => setMenuModal({ mode: "add" });
  
  const handleEditMenu = (menu: Menu) => setMenuModal({ mode: "edit", data: menu });
  
  const handleDeleteMenu = (id: number) => {
    if (confirm("Hapus menu ini?")) {
      setMenus(menus => menus.filter(m => m.id !== id));
      addLog(`Admin menghapus menu id=${id}`);
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
      addLog(`Admin menambah menu '${m.name}'`);
    } else if (menuModal?.mode === "edit") {
      setMenus(menus => menus.map(menu =>
        menu.id === m.id
          ? { ...m, sellerId, updatedBy: user!.nama, updatedAt: new Date().toISOString() }
          : menu
      ));
      addLog(`Admin mengedit menu '${m.name}'`);
    }
    setMenuModal(null);
  };
  
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
    addLog(`Admin menduplikasi menu '${menu.name}' ke penjual id=${idNum}`);
  };

  // --- ORDER MANAGEMENT --- //
  const handleCompleteOrder = (order: Order) => {
    setOrders(orders => orders.map(o =>
      o.id === order.id
        ? { ...o, status: "selesai", updatedBy: user!.nama, updatedAt: new Date().toISOString() }
        : o
    ));
    addLog(`Admin menandai pesanan #${order.id} selesai`);
  };
  
  const handleDeleteOrder = (order: Order) => {
    if (confirm("Batalkan pesanan?")) {
      setOrders(orders => orders.filter(o => o.id !== order.id));
      addLog(`Admin membatalkan pesanan #${order.id}`);
    }
  };

  // --- EXPORTS --- //
  const handleExportMenus = () => {
    const rows = [
      ["ID", "Nama", "Penjual", "Kategori", "Harga", "Stok", "Update Terakhir"],
      ...menus.map(m => [
        `${m.id ?? ""}`,
        m.name,
        penjualList.find(p => p.id === m.sellerId)?.nama || "-",
        categories.find(c => c.value === m.category)?.label || m.category,
        `${m.price}`,
        `${m.stok}`,
        m.updatedAt ? new Date(m.updatedAt).toLocaleString() : "-"
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
        `${o.items.reduce((t, i) => t + i.price * i.qty, 0)}`,
        o.items.map(i => `${i.name ?? ""} x${i.qty ?? ""}`).join(", ")
      ])
    ];
    downloadCSV("orders.csv", rows);
  };

  // --- LOGOUT --- //
  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  // --- RENDER --- //
  if (!user) return null;

  return (
    <div className="min-h-screen bg-green-400 flex">
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-blue-500 p-2 rounded-md shadow-md"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <CloseIcon /> : <HamburgerIcon />}
      </button>

      {/* Sidebar */}
      <Sidebar 
        user={user}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        <div className="p-6">
          {/* Header */}
          <div className="mb-8 lg:ml-0 ml-12">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold">
                  {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
                </h1>
                <p className="text-gray-700">
                  Selamat datang, <b>{user.nama}</b> ({user.nip})
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          {activeSection === "dashboard" && (
            <Dashboard
              orders={orders}
              menus={menus}
              filteredMenus={filteredMenus}
            />
          )}

          {activeSection === "users" && (
            <UserManagement
              penjualList={penjualList}
              userModal={userModal}
              onOpenAddUser={handleOpenAddUser}
              onOpenEditUser={handleOpenEditUser}
              onDeleteUser={handleDeleteUser}
              onCloseModal={() => setUserModal(null)}
              onSaveUser={handleSaveUser}
            />
          )}

          {activeSection === "categories" && (
            <CategoryManagement
              categories={categories}
              categoryModal={categoryModal}
              onAddCategory={handleAddCategory}
              onEditCategory={handleEditCategory}
              onDeleteCategory={handleDeleteCategory}
              onCloseModal={() => setCategoryModal(null)}
              onSaveCategory={handleSaveCategory}
            />
          )}

          {activeSection === "menus" && (
            <MenuManagement
              menus={menus}
              penjualList={penjualList}
              categories={categories}
              selectedSeller={selectedSeller}
              selectedCategory={selectedCategory}
              searchMenu={searchMenu}
              menuModal={menuModal}
              pagedMenus={pagedMenus}
              menuPage={menuPage}
              menuPageCount={menuPageCount}
              onSellerChange={(value) => setSelectedSeller(value === "all" ? "all" : Number(value))}
              onCategoryChange={(value) => setSelectedCategory(value)}
              onSearchChange={(value) => setSearchMenu(value)}
              onAddMenu={handleAddMenu}
              onEditMenu={handleEditMenu}
              onDeleteMenu={handleDeleteMenu}
              onDuplicateMenu={handleDuplicateMenu}
              onExportMenus={handleExportMenus}
              onPageChange={(page) => setMenuPage(page)}
              onCloseModal={() => setMenuModal(null)}
              onSaveMenu={handleSaveMenu}
            />
          )}

          {activeSection === "orders" && (
            <OrderManagement
              orders={orders}
              pagedOrders={pagedOrders}
              orderPage={orderPage}
              orderPageCount={orderPageCount}
              orderFilter={orderFilter}
              searchOrder={searchOrder}
              orderModal={orderModal}
              user={user}
              onFilterChange={(filter) => setOrderFilter(filter)}
              onSearchChange={(search) => setSearchOrder(search)}
              onViewOrderDetail={(order) => setOrderModal(order)}
              onCompleteOrder={handleCompleteOrder}
              onDeleteOrder={handleDeleteOrder}
              onExportOrders={handleExportOrders}
              onPageChange={(page) => setOrderPage(page)}
              onCloseModal={() => setOrderModal(null)}
            />
          )}
          {activeSection === "finance" && (
            <FinanceReport
              orders={orders}
              dateFilter={{ start: '', end: '' }}
              financeData={[]}
              onDateFilterChange={(field, value) => {
                console.log(`Date filter changed: ${field} = ${value}`);
              }}
              onGenerateReport={() => {
                console.log("Generate report clicked");
              }}
              onExportFinanceCSV={() => {
                console.log("Export CSV clicked");
              }}
              bestSellerData={[]}
            />
          )}

          {activeSection === "logs" && (
            <ActivityLogs
              logList={logList}
            />
          )}
        </div>
      </div>
    </div>
  );
}
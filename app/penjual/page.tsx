"use client";

import Image from "next/image";

// Import components
import StatisticsCards from "./components/StatisticsCards";
import OrdersList from "./components/OrdersList";
import MenuTable from "./components/MenuTable";
import DashboardCharts from "./components/DashboardCharts";
import MenuModal from "./components/MenuModal";

// Import hooks
import useSellerAuth from "./hooks/useSellerAuth";
import useOrders from "./hooks/useOrders";
import useMenus from "./hooks/useMenus";
import useBestSellerData from "./hooks/useBestSellerData";

export default function SellerPage() {
  // Authentication hook
  const { user, loading } = useSellerAuth();
  
  // Menus management hook
  const { 
    menus, 
    myMenus, 
    handleAddMenu, 
    handleEditMenu, 
    handleDeleteMenu, 
    handleSaveMenu,
    menuModal,
    setMenuModal 
  } = useMenus(user?.id);
  
  // Orders management hook
  const { 
    myOrders, 
    filteredOrders,
    totalOrder, 
    totalIncome,
    orderFilter, 
    setOrderFilter, 
    updateOrderStatus 
  } = useOrders(user?.id, menus);

  // Best seller data
  const bestSellerData = useBestSellerData(myMenus, myOrders);
  
  // Low stock menus (stok <= 3)
  const lowStockMenus = myMenus.filter(m => m.stok <= 3);
  
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }
  
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray py-6">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Image src="/Frame 7.png" alt="Logo" width={40} height={40} />
          <div>
            <h1 className="text-3xl font-bold">Dashboard Penjual</h1>
            <p className="text-gray-700">Selamat datang, <b>{user.nama}</b> ({user.nip})</p>
          </div>
        </div>
        
        {/* Statistics Cards */}
        <StatisticsCards 
          totalOrder={totalOrder} 
          totalCompleted={myOrders.filter(o => o.status === "selesai").length} 
          totalIncome={totalIncome} 
        />
        
        {/* Data Visualization Components */}
        <DashboardCharts 
          bestSellerMenu={bestSellerData.menu} 
          bestSellerMenuQty={bestSellerData.quantity} 
          lowStockMenus={lowStockMenus} 
          myOrders={myOrders} 
        />
        
        {/* Orders Section */}
        <OrdersList 
          orders={filteredOrders} 
          orderFilter={orderFilter}
          setOrderFilter={setOrderFilter}
          updateOrderStatus={updateOrderStatus} 
        />
        
        {/* Menu Management */}
        <MenuTable 
          menus={myMenus} 
          onAddMenu={handleAddMenu} 
          onEditMenu={handleEditMenu} 
          onDeleteMenu={handleDeleteMenu} 
        />
        
        {/* Modal for adding/editing menu */}
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
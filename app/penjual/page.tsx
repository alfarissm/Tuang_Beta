"use client";

import { useState } from "react";
import Image from "next/image";

// Import components
import SideNavigation from "./components/SideNavigation";
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
  // Active section state
  const [activeSection, setActiveSection] = useState<string>("dashboard");
  
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
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="rounded-full bg-gray-200 h-16 w-16 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-24 mb-2.5"></div>
          <div className="h-3 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    );
  }
  
  if (!user) return null;

  return (
    <div className="min-h-screen bg-green-400">
      {/* Side Navigation */}
      <SideNavigation 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        user={user}
      />
      
      {/* Main Content */}
      <div className="md:ml-64 pt-0 md:pt-5 pb-10 min-h-screen">
        <div className="container mx-auto px-4">
          {/* Dashboard Section */}
          {activeSection === "dashboard" && (
            <>
              <div className="hidden md:block mb-6">
                <h1 className="text-3xl font-bold">Dashboard Penjual</h1>
                <p className="text-gray-600">Selamat datang, <b>{user.nama}</b></p>
              </div>
              
              <StatisticsCards 
                totalOrder={totalOrder} 
                totalCompleted={myOrders.filter(o => o.status === "selesai").length} 
                totalIncome={totalIncome} 
              />
              
              <DashboardCharts 
                bestSellerMenu={bestSellerData.menu} 
                bestSellerMenuQty={bestSellerData.quantity} 
                lowStockMenus={lowStockMenus} 
                myOrders={myOrders} 
              />
              
            </>
          )}

          {/* Orders Section */}
          {activeSection === "orders" && (
            <div className="py-4">
              <OrdersList 
                orders={filteredOrders} 
                orderFilter={orderFilter}
                setOrderFilter={setOrderFilter}
                updateOrderStatus={updateOrderStatus} 
              />
            </div>
          )}

          {/* Menu Section */}
          {activeSection === "menu" && (
            <div className="py-4">
              <MenuTable 
                menus={myMenus} 
                onAddMenu={handleAddMenu} 
                onEditMenu={handleEditMenu} 
                onDeleteMenu={handleDeleteMenu} 
              />
            </div>
          )}
        </div>
      </div>
      
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
  );
}
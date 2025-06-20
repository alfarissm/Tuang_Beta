"use client";

import { useState } from "react";
import { useEffect } from "react";
// import Image from "next/image";

// Import components
import SideNavigation from "./components/SideNavigation";
import StatisticsCards from "./components/StatisticsCards";
import OrdersList from "./components/OrdersList";
import MenuTable from "./components/MenuTable";
import DashboardCharts from "./components/DashboarSeller";
import MenuModal from "./components/MenuModal";

// Import hooks
import useSellerAuth from "./hooks/useSellerAuth";
import useOrders from "./hooks/useOrders";
import useMenus from "./hooks/useMenus";
import useBestSellerData from "./hooks/useBestSellerData";

// import dropdown


export default function SellerPage() {
  // Active section state
  const [activeSection, setActiveSection] = useState<string>("dashboard");

  // Scrolling position control for mobile
  const [scrollPosition, setScrollPosition] = useState(0);
  
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
  
  // Handler for scroll event
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-green-400">
        <div className="animate-pulse flex flex-col items-center">
          <div className="rounded-full bg-gray-200 h-12 w-12 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
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
      
      {/* Main Content - Dengan padding bottom untuk menghindari tombol navigasi */}
      <div className="md:ml-64 pt-0 md:pt-5 pb-20 md:pb-6 min-h-screen">
        <div className="container mx-auto px-3 sm:px-4">
          {/* Section Title - Show when scrolled down on mobile */}
          <div className={`md:hidden sticky top-0 pt-2 pb-2 bg-green-400 z-20 transition-opacity duration-200 
            ${scrollPosition > 10 ? 'opacity-100 shadow-sm' : 'opacity-0'}`}>
            
          </div>
          
          {/* Dashboard Section */}
          {activeSection === "dashboard" && (
            <>
              <div className="md:block mb-4 mt-2">
                <h1 className="text-xl md:text-3xl font-bold">Dashboard Penjual</h1>
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

          {/* Orders Section - More compact spacing */}
          {activeSection === "orders" && (
            <div className="py-2 md:py-4">
              <OrdersList 
                orders={filteredOrders} 
                orderFilter={orderFilter}
                setOrderFilter={setOrderFilter}
                updateOrderStatus={updateOrderStatus} 
              />
            </div>
          )}

          {/* Menu Section - More compact spacing */}
          {activeSection === "menu" && (
            <div className="py-2 md:py-4">
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
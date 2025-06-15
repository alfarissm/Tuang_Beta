import React from 'react';
import Image from 'next/image';
import { User } from '@/app/admin//types/index';
import * as Icons from '@/app/admin/components/icons/Icons'; 

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SidebarProps {
  user: User;
  activeSection: string;
  setActiveSection: (section: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  user,
  activeSection,
  setActiveSection,
  sidebarOpen,
  setSidebarOpen,
  onLogout
}) => {
  // Define sidebar items using the Icons namespace
  const sidebarItems: SidebarItem[] = [
    { id: "dashboard", label: "Dashboard", icon: Icons.DashboardIcon },
    { id: "users", label: "Akun Penjual", icon: Icons.UsersIcon },
    { id: "categories", label: "Kategori", icon: Icons.CategoryIcon },
    { id: "menus", label: "Daftar Menu", icon: Icons.MenuIcon },
    { id: "orders", label: "Pesanan", icon: Icons.OrderIcon },
    { id: "finance", label: "Keuangan", icon: Icons.FinanceIcon },
    { id: "logs", label: "Log Aktivitas", icon: Icons.LogIcon },
  ];

  return (
    <>
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center gap-3 p-6 border-b">
          <Image src="/Frame 7.png" alt="Logo" width={32} height={32} />
          <div>
            <h1 className="text-lg font-bold">Admin Panel</h1>
            <p className="text-sm text-gray-600">{user.nama}</p>
          </div>
        </div>

        <nav className="mt-6">
          {sidebarItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setSidebarOpen(false); 
                }}
                className={`w-full flex items-center gap-3 px-6 py-3 text-left hover:bg-gray-50 transition-colors ${
                  activeSection === item.id ? 'bg-blue-50 border-r-4 border-blue-500 text-blue-700' : 'text-gray-700'
                }`}
              >
                <IconComponent className={`w-5 h-5 ${activeSection === item.id ? 'text-blue-700' : 'text-gray-500'}`} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            <Icons.LogoutIcon className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-blur bg-opacity-0 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </>
  );
};
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

type NavItem = {
  id: string;
  title: string;
  icon: React.ReactNode;
  active?: boolean;
};

type SideNavigationProps = {
  activeSection: string;
  onSectionChange: (section: string) => void;
  user: { nama: string; nip: string };
};

export default function SideNavigation({ activeSection, onSectionChange, user }: SideNavigationProps) {
  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>,
      active: activeSection === 'dashboard'
    },
    {
      id: 'orders',
      title: 'Pesanan',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5m14 0l-4-4m4 4l-4 4"></path></svg>,
      active: activeSection === 'orders'
    },
    {
      id: 'menu',
      title: 'Menu',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18M3 6h18M3 18h18"></path></svg>,
      active: activeSection === 'menu'
    }
  ];

  return (
    <>
      {/* Mobile Navigation */}
      <div className="block md:hidden bg-white shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-2">
            <Image src="/Frame 7.png" alt="Logo" width={32} height={32} />
            <span className="font-semibold">Tuang</span>
          </div>
          <div className="text-xs text-gray-600">
            <p>{user.nama} ({user.nip})</p>
          </div>
        </div>
        <div className="flex border-t">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`flex-1 py-3 flex flex-col items-center ${
                item.active ? 'text-blue-500 border-t-2 border-blue-500' : 'text-gray-500'
              }`}
              onClick={() => onSectionChange(item.id)}
            >
              <div className="w-5 h-5">{item.icon}</div>
              <span className="text-xs mt-1">{item.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block bg-white shadow-md w-64 h-screen fixed left-0 top-0">
        <div className="p-4 flex items-center border-b">
          <Image src="/Frame 7.png" alt="Logo" width={40} height={40} />
          <div className="ml-3">
            <h1 className="font-bold text-xl">Tuang</h1>
            <p className="text-xs text-gray-500">Penjual Dashboard</p>
          </div>
        </div>
        
        <div className="p-4 border-b">
          <p className="text-sm font-medium">{user.nama}</p>
          <p className="text-xs text-gray-500">NIP: {user.nip}</p>
        </div>
        
        <nav className="p-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`w-full flex items-center gap-3 p-3 rounded-lg text-left mb-1 ${
                item.active 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => onSectionChange(item.id)}
            >
              <span className="w-5 h-5">{item.icon}</span>
              <span>{item.title}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}
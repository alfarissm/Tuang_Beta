import React, { useState } from 'react';
import Image from 'next/image';

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
  // State untuk mobile menu (dropdown)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  // Handle navigation change on mobile
  const handleNavChange = (id: string) => {
    onSectionChange(id);
    setMobileMenuOpen(false); // Close mobile menu after selection
  };

  return (
    <>
      {/* Mobile Navigation */}
      <div className="block md:hidden bg-white shadow-sm sticky top-0 z-30">
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-2">
            <Image src="/Frame 7.png" alt="Logo" width={32} height={32} />
            <span className="font-semibold">Tuang</span>
          </div>
          
          {/* Mobile dropdown button */}
          <button 
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border text-sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="font-medium">{navItems.find(item => item.id === activeSection)?.title}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        
        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-lg z-40 border-t animate-fadeIn">
            <div className="p-3 border-b">
              <p className="text-sm font-medium">{user.nama}</p>
              <p className="text-xs text-gray-500">{user.nip}</p>
            </div>
            
            <div className="p-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left mb-1 ${
                    item.active 
                      ? 'bg-green-100 text-green-600' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => handleNavChange(item.id)}
                >
                  <span className="w-5 h-5">{item.icon}</span>
                  <span>{item.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="flex border-t fixed bottom-0 left-0 right-0 bg-white shadow-lg z-30">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`flex-1 py-3 flex flex-col items-center ${
                item.active ? 'text-green-500 border-t-2 border-green-500' : 'text-gray-500'
              }`}
              onClick={() => onSectionChange(item.id)}
            >
              <div className="w-5 h-5">{item.icon}</div>
              <span className="text-xs mt-1">{item.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Sidebar - Keep original */}
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
                  ? 'bg-green-50 text-green-600' 
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
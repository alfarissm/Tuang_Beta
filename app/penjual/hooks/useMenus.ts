import { useState } from 'react';
import { MenuData } from '../types';
import { initialMenus } from '../utils/constants';

export default function useMenus(sellerId: number | undefined) {
  const [menus, setMenus] = useState<MenuData[]>(initialMenus);
  const [menuModal, setMenuModal] = useState<null | { mode: "add" | "edit"; data?: MenuData }>(null);
  
  // Only return menus for the current seller
  const myMenus = menus.filter(menu => menu.sellerId === sellerId);
  
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
          sellerId
        }
      ]);
    } else if (menuModal?.mode === "edit") {
      setMenus(menus.map(menu =>
        menu.id === m.id ? { ...m, sellerId } : menu
      ));
    }
    setMenuModal(null);
  };
  
  return {
    menus,
    myMenus,
    menuModal,
    setMenuModal,
    handleAddMenu,
    handleEditMenu,
    handleDeleteMenu,
    handleSaveMenu
  };
}
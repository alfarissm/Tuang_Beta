import { MenuData, Order, BestSellerData } from '../types';

export default function useBestSellerData(menus: MenuData[], orders: Order[]): BestSellerData {
  // Calculate menu sales
  const menuSales: Record<number, number> = {};
  
  orders.forEach(order => {
    order.items.forEach(item => {
      menuSales[item.menuId] = (menuSales[item.menuId] || 0) + item.qty;
    });
  });
  
  // Find best seller
  if (Object.keys(menuSales).length === 0) {
    return { menu: undefined, quantity: 0 };
  }
  
  // Sort by quantity sold
  const bestMenuId = Object.keys(menuSales)
    .sort((a, b) => menuSales[Number(b)] - menuSales[Number(a)])[0];
  
  const bestSellerMenu = menus.find(m => m.id === Number(bestMenuId));
  const bestSellerMenuQty = bestMenuId ? menuSales[Number(bestMenuId)] : 0;
  
  return {
    menu: bestSellerMenu,
    quantity: bestSellerMenuQty
  };
}
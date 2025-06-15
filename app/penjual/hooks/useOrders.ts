import { useState } from 'react';
import { Order, OrderFilter, MenuData } from '../types';
import { initialOrders } from '../utils/constants';
import { isOrderFilter } from '../utils/formatters';

export default function useOrders(sellerId: number | undefined, menus: MenuData[]) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [orderFilter, setOrderFilter] = useState<OrderFilter>("all");

  // Filter orders for the current seller only and add menu images
  const myOrders = orders
    .map(order => ({
      ...order,
      items: order.items
        .map(item => {
          // Add menu image to item
          const menu = menus.find(m => m.id === item.menuId);
          return menu ? { ...item, image: menu.image } : item;
        })
        .filter(item => item.sellerId === sellerId)
    }))
    .filter(order => order.items.length > 0);

  // Filter by status
  const filteredOrders = orderFilter === "all"
    ? myOrders
    : myOrders.filter(o => o.status === orderFilter);

  // Update order status
  const updateOrderStatus = (id: number, nextStatus: string) => {
    setOrders(orders =>
      orders.map(order =>
        order.id === id ? { ...order, status: nextStatus } : order
      )
    );
  };

  // Calculate statistics
  const totalOrder = myOrders.length;
  const totalIncome = myOrders
    .filter(o => o.status === "selesai")
    .reduce((sum, order) =>
      sum + order.items.reduce((t, i) => t + i.qty * i.price, 0), 0
    );

  // Handle filter change
  const handleFilterChange = (value: string) => {
    if (isOrderFilter(value)) {
      setOrderFilter(value);
    }
  };

  return {
    orders,
    myOrders,
    filteredOrders,
    orderFilter,
    setOrderFilter: handleFilterChange,
    updateOrderStatus,
    totalOrder,
    totalIncome
  };
}
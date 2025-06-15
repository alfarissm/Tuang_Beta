import React, { useMemo } from 'react';
import { Menu, Order } from '@/app/admin/types/index';
import { formatRupiah } from '@/app/admin/utils/formatting';
import { WeeklyFinanceChart } from '@/app/admin/components/charts/WeeklyFinanceChart';

interface DashboardProps {
  orders: Order[];
  menus: Menu[];
  filteredMenus: Menu[];
}

export const Dashboard: React.FC<DashboardProps> = ({ orders, menus, filteredMenus }) => {
  // Calculate statistics
  const totalOrder = orders.length;
  const totalIncome = useMemo(() =>
    orders.filter(o => o.status === "selesai")
      .reduce((sum, order) =>
        sum + order.items.reduce((t, i) => t + i.qty * i.price, 0), 0), [orders]);

  const bestMenu = useMemo(() => {
    const counts: Record<number, number> = {};
    orders.forEach(o => o.items.forEach(i => counts[i.menuId] = (counts[i.menuId] || 0) + i.qty));
    let max = 0, id = 0;
    Object.entries(counts).forEach(([mid, cnt]) => { if (cnt > max) { max = cnt; id = Number(mid); } });
    return menus.find(m => m.id === id);
  }, [orders, menus]);

  // Items with low stock for warnings
  const stokWarning = useMemo(() => filteredMenus.filter(m => m.stok < 3), [filteredMenus]);

  return (
    <>
      {/* Weekly Finance Chart */}
      <WeeklyFinanceChart orders={orders} />
      
      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4 mb-8 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white p-4 rounded shadow">
          <div className="text-gray-500 text-sm">Total Pesanan</div>
          <div className="text-2xl font-bold">{totalOrder}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-gray-500 text-sm">Pesanan Selesai</div>
          <div className="text-2xl font-bold">
            {orders.filter((o) => o.status === "selesai").length}
          </div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-gray-500 text-sm">Pendapatan</div>
          <div className="text-2xl font-bold">{formatRupiah(totalIncome)}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-gray-500 text-sm">Menu Terlaris</div>
          <div className="text-lg font-bold">{bestMenu ? bestMenu.name : "-"}</div>
        </div>
      </div>

      {/* Low stock warning */}
      {stokWarning.length > 0 && (
        <div className="bg-yellow-100 text-yellow-900 border border-yellow-200 rounded px-4 py-2 mb-4">
          <b>Perhatian!</b> Menu berikut stoknya menipis:{" "}
          {stokWarning.map(m => m.name).join(", ")}
        </div>
      )}
    </>
  );
};
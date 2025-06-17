import Image from 'next/image';
import { IconFire, IconWarning,  } from "../utils/icons";
import { getLast7Days } from "../utils/date-utils";
import { DashboardChartsProps } from "../types";
import IncomeSummaryChart from "./IncomeSummaryCharts";

export default function DashboardCharts({ 
  bestSellerMenu, 
  bestSellerMenuQty, 
  lowStockMenus,
  myOrders
}: DashboardChartsProps) {
  // Calculate daily income for 7 days
  const last7days = getLast7Days();
  
  const dailyIncome = last7days.map(day => {
    const dayStr = day.toISOString().slice(0, 10);
    return myOrders
      .filter(o =>
        o.status === "selesai" &&
        o.createdAt.slice(0, 10) === dayStr
      )
      .reduce((sum, o) =>
        sum + o.items.reduce((t, i) => t + i.qty * i.price, 0), 0
      );
  });

  // Calculate max income for chart scaling
  const maxIncome = Math.max(...dailyIncome, 1);
  
  // Calculate total income and growth
  const totalWeekIncome = dailyIncome.reduce((a, b) => a + b, 0);
  const prevDaysIncome = dailyIncome.slice(0, 3).reduce((a, b) => a + b, 0);
  const recentDaysIncome = dailyIncome.slice(-3).reduce((a, b) => a + b, 0);
  const weekGrowth = prevDaysIncome > 0 
    ? ((recentDaysIncome - prevDaysIncome) / prevDaysIncome * 100) 
    : 0;

  // Format dates for x-axis
  const dateLabels = last7days.map(day => ({
    day: day.getDate(),
    month: day.toLocaleDateString("id-ID", { month: 'short' })
  }));

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 gap-3 mb-4">
      {/* Menu Terlaris */}
      <div className="bg-white p-3 rounded-lg shadow">
        <div className="flex items-center gap-2 mb-2">
          <IconFire />
          <div className="text-gray-600 text-xs sm:text-sm font-medium">Menu Terlaris</div>
        </div>
        {bestSellerMenu ? (
          <div className="flex items-center gap-2">
            <Image 
              src={bestSellerMenu.image} 
              alt={bestSellerMenu.name} 
              width={36} 
              height={24} 
              className="rounded object-cover border" 
            />
            <div>
              <div className="font-semibold text-xs sm:text-sm truncate max-w-[80px] sm:max-w-full">
                {bestSellerMenu.name}
              </div>
              <span className="bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded text-xs font-bold">
                {bestSellerMenuQty} terjual
              </span>
            </div>
          </div>
        ) : <div className="text-gray-400 text-xs">Belum ada penjualan.</div>}
      </div>
      
      {/* Stok Hampir Habis */}
      <div className="bg-white p-3 rounded-lg shadow">
        <div className="flex items-center gap-2 mb-2">
          <IconWarning />
          <span className="text-red-600 font-semibold text-xs sm:text-sm">Stok Hampir Habis</span>
        </div>
        {lowStockMenus.length === 0 ? (
          <div className="text-gray-400 text-xs">Semua menu cukup stok.</div>
        ) : (
          <ul className="space-y-1 max-h-[80px] overflow-y-auto">
            {lowStockMenus.slice(0, 3).map(menu => (
              <li key={menu.id} className="flex items-center gap-1 text-xs sm:text-sm">
                <Image 
                  src={menu.image} 
                  alt={menu.name} 
                  width={24} 
                  height={18} 
                  className="rounded object-cover border" 
                />
                <span className="truncate max-w-[80px] sm:max-w-full">{menu.name}</span>
                <span className="bg-red-100 text-red-700 px-1.5 py-0.5 rounded text-xs font-bold ml-auto">
                  Sisa {menu.stok}
                </span>
              </li>
            ))}
            {lowStockMenus.length > 3 && (
              <li className="text-xs text-gray-500 text-center pt-1">
                +{lowStockMenus.length - 3} item lainnya
              </li>
            )}
          </ul>
        )}
      </div>
      
      {/* Income Summary Chart - Now using Recharts component */}
      <IncomeSummaryChart 
        dailyIncome={dailyIncome}
        dateLabels={dateLabels}
        maxIncome={maxIncome}
        totalWeekIncome={totalWeekIncome}
        weekGrowth={weekGrowth}
      />
    </div>
  );
}
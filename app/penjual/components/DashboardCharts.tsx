import Image from 'next/image';
import { IconFire, IconWarning } from "../utils/icons";
import { getLast7Days } from "../utils/date-utils";
import { formatRupiah } from "../utils/formatters";
import { DashboardChartsProps } from "../types";

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {/* Menu Terlaris */}
      <div className="bg-white p-4 rounded-xl shadow flex items-center gap-4">
        <IconFire />
        <div>
          <div className="text-gray-600 text-sm font-medium mb-1">Menu Terlaris</div>
          {bestSellerMenu ? (
            <div className="flex items-center gap-2">
              <Image 
                src={bestSellerMenu.image} 
                alt={bestSellerMenu.name} 
                width={40} 
                height={28} 
                className="rounded object-cover border" 
              />
              <span className="font-semibold">{bestSellerMenu.name}</span>
              <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded text-xs font-bold">
                {bestSellerMenuQty} terjual
              </span>
            </div>
          ) : <div className="text-gray-400 text-sm">Belum ada penjualan.</div>}
        </div>
      </div>
      
      {/* Stok Hampir Habis */}
      <div className="bg-white p-4 rounded-xl shadow">
        <div className="flex items-center gap-2 mb-1">
          <IconWarning />
          <span className="text-red-600 font-semibold text-sm">Stok Hampir Habis</span>
        </div>
        {lowStockMenus.length === 0 ? (
          <div className="text-gray-400 text-sm">Semua menu cukup stok.</div>
        ) : (
          <ul className="mt-1 space-y-1">
            {lowStockMenus.map(menu => (
              <li key={menu.id} className="flex items-center gap-2">
                <Image 
                  src={menu.image} 
                  alt={menu.name} 
                  width={28} 
                  height={20} 
                  className="rounded object-cover border" 
                />
                <span>{menu.name}</span>
                <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-bold">
                  Sisa {menu.stok}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {/* Grafik Pendapatan 7 Hari */}
      <div className="bg-white p-4 rounded-xl shadow">
        <div className="text-gray-600 text-sm font-medium mb-2">Pendapatan 7 Hari Terakhir</div>
        <div className="flex items-end gap-1 h-28 w-full">
          {dailyIncome.map((income, idx) => {
            // Find max for normalizing bar height
            const max = Math.max(...dailyIncome, 1);
            return (
              <div key={idx} className="flex flex-col items-center justify-end w-full">
                <div
                  className="bg-green-400 rounded-t"
                  style={{
                    height: `${Math.max(10, (income / max) * 80)}px`,
                    width: "16px",
                    transition: "height 0.3s"
                  }}
                  title={formatRupiah(income)}
                />
                <div className="text-[10px] text-gray-400 mt-0.5">
                  {last7days[idx].getDate()}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          {last7days.map((d, idx) => (
            <span key={idx} className="w-6 text-center">
              {d.toLocaleDateString("id-ID", { weekday: "short" })}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
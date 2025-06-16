import Image from 'next/image';
import { IconFire, IconWarning, IconTrend } from "../utils/icons";
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
      
      {/* Enhanced Income Chart - Full Width */}
      <div className="bg-white p-3 rounded-lg shadow col-span-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <IconTrend />
            <div className="text-gray-700 font-medium text-sm">
              Pendapatan Minggu Ini
            </div>
          </div>
          <div className="flex items-center">
            <div className="font-bold text-sm mr-2">{formatRupiah(totalWeekIncome)}</div>
            {weekGrowth !== 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full flex items-center ${weekGrowth >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                <span className={`mr-0.5 ${weekGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {weekGrowth >= 0 ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                      <path fillRule="evenodd" d="M10 17a.75.75 0 0 1-.75-.75V5.612L5.29 9.77a.75.75 0 0 1-1.08-1.04l5.25-5.5a.75.75 0 0 1 1.08 0l5.25 5.5a.75.75 0 1 1-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0 1 10 17Z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                      <path fillRule="evenodd" d="M10 3a.75.75 0 0 1 .75.75v10.638l3.96-4.158a.75.75 0 1 1 1.08 1.04l-5.25 5.5a.75.75 0 0 1-1.08 0l-5.25-5.5a.75.75 0 1 1 1.08-1.04l3.96 4.158V3.75A.75.75 0 0 1 10 3Z" clipRule="evenodd" />
                    </svg>
                  )}
                </span>
                {Math.abs(weekGrowth).toFixed(1)}%
              </span>
            )}
          </div>
        </div>
        
        {/* Chart Area */}
        <div className="relative h-[150px] w-full mt-2">
          {/* Grid Background */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {[0, 1, 2, 3, 4].map((_, i) => (
              <div key={i} className="border-t border-gray-100 w-full flex">
                <span className="text-[9px] text-gray-400 pr-1 w-8">
                  {Math.round((maxIncome / 4) * (4 - i) / 1000)}K
                </span>
                <div className="flex-1"></div>
              </div>
            ))}
          </div>
          
          {/* Gradient Background for Line Chart */}
          <div className="absolute bottom-0 left-8 right-0 h-full">
            <svg width="100%" height="100%" preserveAspectRatio="none">
              {/* Area under the line with gradient */}
              <defs>
                <linearGradient id="incomeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#4ade80" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#4ade80" stopOpacity="0.05" />
                </linearGradient>
              </defs>
              
              <path
                d={`
                  M0 ${100 - (dailyIncome[0] / maxIncome * 90)}
                  ${dailyIncome.map((income, idx) => 
                    `L ${(idx * 100) / (dailyIncome.length - 1)} ${100 - (income / maxIncome * 90)}`
                  ).join(' ')}
                  L 100 100 L 0 100 Z
                `}
                fill="url(#incomeGradient)"
              />
              
              {/* Smoothed line chart */}
              <polyline
                points={dailyIncome.map((income, idx) => {
                  const x = (idx * 100) / (dailyIncome.length - 1);
                  const y = 100 - (income / maxIncome * 90);
                  return `${x} ${y}`;
                }).join(' ')}
                fill="none"
                stroke="#4ade80"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              {/* Data points */}
              {dailyIncome.map((income, idx) => {
                const x = (idx * 100) / (dailyIncome.length - 1);
                const y = 100 - (income / maxIncome * 90);
                
                return (
                  <g key={idx}>
                    <circle
                      cx={`${x}`}
                      cy={`${y}`}
                      r="4"
                      fill="#4ade80"
                      stroke="white"
                      strokeWidth="1.5"
                    />
                  </g>
                );
              })}
            </svg>
          </div>
          
          {/* X-axis labels (dates) - Now with improved formatting */}
          <div className="absolute bottom-[-22px] left-8 right-0 flex justify-between">
            {dateLabels.map((label, idx) => (
              <div key={idx} className="flex flex-col items-center" style={{width: `${100/7}%`}}>
                <div className="text-[10px] text-gray-600 font-medium">
                  {label.day}
                </div>
                <div className="text-[8px] text-gray-400">
                  {label.month}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Add some padding at the bottom for the x-axis labels */}
        <div className="h-5"></div>
      </div>
    </div>
  );
}
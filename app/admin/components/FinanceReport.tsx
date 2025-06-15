import React, { useState, useEffect } from 'react';
import { Order } from '../types';
import { formatRupiah } from '../utils/formatting';
import { WeeklyFinanceChart } from '../components/charts/WeeklyFinanceChart';
import { initialOrders, initialMenus, initialUsers } from '../data/mockData';

interface FinanceReportProps {
  orders: Order[];
  dateFilter: { start: string; end: string };
  financeData: { date: string; total: number; items: number }[];
  onDateFilterChange: (field: 'start' | 'end', value: string) => void;
  onGenerateReport: () => void;
  onExportFinanceCSV: () => void;
  bestSellerData: { id: number; name: string; qty: number; total: number }[];
}

// Interface for seller finance data
interface SellerFinanceData {
  sellerId: number;
  sellerName: string;
  total: number;
  items: number;
  transactions: number;
  percentage: number;
}

export const FinanceReport: React.FC<FinanceReportProps> = ({
  orders: propOrders = [], // Original props with defaults
  dateFilter = { start: '', end: '' },
  financeData = [],
  onDateFilterChange = () => {},
  onGenerateReport = () => {},
  onExportFinanceCSV = () => {},
  bestSellerData = []
}) => {
  // Always use our dummy data in addition to any real data
  const [dummyFinanceData, setDummyFinanceData] = useState<{ date: string; total: number; items: number }[]>([]);
  const [dummyBestSellerData, setDummyBestSellerData] = useState<{ id: number; name: string; qty: number; total: number }[]>([]);
  const [sellerFinanceData, setSellerFinanceData] = useState<SellerFinanceData[]>([]);
  const [dummyDateFilter, setDummyDateFilter] = useState({
    start: '2025-05-16', 
    end: '2025-06-15' // today
  });
  
  // Initialize with existing orders + dummy ones for more data
  const orders = propOrders.length > 0 ? propOrders : initialOrders;
  
  // Use real data if provided, otherwise use dummy data
  const displayFinanceData = financeData.length > 0 ? financeData : dummyFinanceData;
  const displayBestSellerData = bestSellerData.length > 0 ? bestSellerData : dummyBestSellerData;
  const displayDateFilter = React.useMemo(() => ({
  start: dateFilter.start || dummyDateFilter.start,
  end: dateFilter.end || dummyDateFilter.end,
}), [dateFilter.start, dateFilter.end, dummyDateFilter.start, dummyDateFilter.end]);
  
  // Generate finance data and seller breakdown based on orders and date filter
  useEffect(() => {
    // Parse dates for filtering
    const startDate = new Date(displayDateFilter.start);
    const endDate = new Date(displayDateFilter.end);
    endDate.setHours(23, 59, 59); // Include the full end day
    
    // Filter the orders based on the date range and completed status
    const filteredOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= startDate && 
             orderDate <= endDate && 
             order.status === "selesai";
    });
    
    // 1. Generate daily finance data
    const dailyData: Record<string, { total: number; items: number }> = {};
    
    // 2. Track seller data for breakdown
    const sellerData: Record<number, { 
      sellerName: string;
      total: number; 
      items: number;
      transactions: number;
    }> = {};
    
    // Initialize seller data
    initialUsers.forEach(user => {
      if (user.role === "penjual") {
        sellerData[user.id] = {
          sellerName: user.nama,
          total: 0,
          items: 0,
          transactions: 0
        };
      }
    });
    
    // Process orders
    filteredOrders.forEach(order => {
      // Get the date key for daily data
      const orderDate = new Date(order.createdAt);
      const dateKey = orderDate.toISOString().split('T')[0];
      
      // Initialize daily data if needed
      if (!dailyData[dateKey]) {
        dailyData[dateKey] = { total: 0, items: 0 };
      }
      
      // Track sellers in this order
      const sellersInOrder = new Set<number>();
      
      // Process each item in the order
      order.items.forEach(item => {
        // Calculate item total
        const itemTotal = item.price * item.qty;
        
        // Add to daily totals
        dailyData[dateKey].total += itemTotal;
        dailyData[dateKey].items += item.qty;
        
        // Add to seller totals
        if (sellerData[item.sellerId]) {
          sellerData[item.sellerId].total += itemTotal;
          sellerData[item.sellerId].items += item.qty;
          sellersInOrder.add(item.sellerId);
        }
      });
      
      // Increment transaction count for each seller in this order
      sellersInOrder.forEach(sellerId => {
        if (sellerData[sellerId]) {
          sellerData[sellerId].transactions += 1;
        }
      });
    });
    
    // Convert daily data to array and sort by date
    const financeDataArray = Object.entries(dailyData)
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => a.date.localeCompare(b.date));
    
    setDummyFinanceData(financeDataArray);
    
    // Calculate grand total for percentage calculations
    const grandTotal = Object.values(sellerData).reduce(
      (sum, seller) => sum + seller.total, 0
    );
    
    // Convert seller data to array with percentages
    const sellerFinanceArray = Object.entries(sellerData)
      .map(([sellerIdStr, data]) => ({
        sellerId: parseInt(sellerIdStr),
        sellerName: data.sellerName,
        total: data.total,
        items: data.items,
        transactions: data.transactions,
        percentage: grandTotal > 0 ? (data.total / grandTotal * 100) : 0
      }))
      .sort((a, b) => b.total - a.total); // Sort by total, highest first
    
    setSellerFinanceData(sellerFinanceArray);
    
    // 3. Generate best seller data
    const menuCounts: Record<number, { name: string; qty: number; total: number }> = {};
    
    // Process each order to find best selling items
    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        if (!menuCounts[item.menuId]) {
          menuCounts[item.menuId] = { 
            name: item.name, 
            qty: 0, 
            total: 0 
          };
        }
        
        menuCounts[item.menuId].qty += item.qty;
        menuCounts[item.menuId].total += item.price * item.qty;
      });
    });
    
    // Convert to array, sort by quantity, and take top 5
    const bestSellersArray = Object.entries(menuCounts)
      .map(([menuId, data]) => ({
        id: parseInt(menuId),
        ...data
      }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);
    
    setDummyBestSellerData(bestSellersArray);
    
  }, [displayDateFilter, orders]);
  
  // Handle date filter change
  const handleDateChange = (field: 'start' | 'end', value: string) => {
    // Update our internal state
    setDummyDateFilter(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Call the parent handler if provided
    if (onDateFilterChange) {
      onDateFilterChange(field, value);
    }
  };
  
  // Calculate totals
  const grandTotal = React.useMemo(() => {
    return displayFinanceData?.reduce((sum, d) => sum + (d?.total || 0), 0) || 0;
  }, [displayFinanceData]);
  
  const totalItems = React.useMemo(() => {
    return displayFinanceData?.reduce((sum, d) => sum + (d?.items || 0), 0) || 0;
  }, [displayFinanceData]);
  
  const averagePerTransaction = React.useMemo(() => {
    const transactions = displayFinanceData?.length || 0;
    return transactions > 0 ? grandTotal / transactions : 0;
  }, [displayFinanceData, grandTotal]);
  
  // Generate QRIS distribution report button
  const handleGenerateQrisDistributionReport = () => {
    alert("Laporan distribusi QRIS akan diunduh sebagai file Excel");
    // Actual implementation would generate and download a report file
  };
  
  return (
    <div className="space-y-6">
      {/* Weekly Finance Chart */}
      {orders && orders.length > 0 && (
        <div className="bg-white rounded shadow overflow-hidden">
          <WeeklyFinanceChart orders={orders} />
        </div>
      )}

      {/* Finance Report Card */}
      <div className="bg-white p-3 md:p-4 rounded shadow">
        <h2 className="font-bold text-lg mb-4">Laporan Keuangan</h2>
        
        {/* Date Filters - Stacked on mobile */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
          <div className="grid grid-cols-2 gap-2 w-full sm:w-auto">
            <div className="flex flex-col w-full">
              <label className="text-sm text-gray-500 mb-1">Dari:</label>
              <input
                type="date"
                className="border rounded px-2 py-1 text-sm"
                value={displayDateFilter?.start || ''}
                onChange={e => handleDateChange('start', e.target.value)}
              />
            </div>
            <div className="flex flex-col w-full">
              <label className="text-sm text-gray-500 mb-1">Sampai:</label>
              <input
                type="date"
                className="border rounded px-2 py-1 text-sm"
                value={displayDateFilter?.end || ''}
                onChange={e => handleDateChange('end', e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              className="bg-blue-500 text-white px-3 py-1 text-sm rounded hover:bg-blue-600 flex-grow"
              onClick={() => propOrders.length > 0 ? onGenerateReport() : handleDateChange('start', displayDateFilter.start)}
            >
              Generate Report
            </button>
            <button
              className="bg-green-500 text-white px-3 py-1 text-sm rounded hover:bg-green-600 flex-grow"
              onClick={() => propOrders.length > 0 ? onExportFinanceCSV() : handleGenerateQrisDistributionReport()}
            >
              Export CSV
            </button>
          </div>
        </div>
        
        {/* Summary Cards - 2 columns on mobile, 4 on larger screens */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
            <div className="text-blue-700 text-sm font-medium">Total Transaksi</div>
            <div className="text-xl font-bold">{displayFinanceData?.length || 0}</div>
          </div>
          
          <div className="bg-green-50 p-3 rounded-lg border border-green-100">
            <div className="text-green-700 text-sm font-medium">Total Pendapatan</div>
            <div className="text-xl font-bold">{formatRupiah(grandTotal)}</div>
          </div>
          
          <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
            <div className="text-purple-700 text-sm font-medium">Total Item</div>
            <div className="text-xl font-bold">{totalItems}</div>
          </div>
          
          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
            <div className="text-yellow-700 text-sm font-medium">Rata-rata/Transaksi</div>
            <div className="text-xl font-bold">
              {formatRupiah(averagePerTransaction)}
            </div>
          </div>
        </div>

        {/* NEW: QRIS Distribution Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-md text-gray-700">Distribusi Pendapatan Penjual</h3>
            <button
              className="bg-purple-500 text-white px-3 py-1 text-sm rounded hover:bg-purple-600"
              onClick={handleGenerateQrisDistributionReport}
            >
              Download Laporan QRIS
            </button>
          </div>
          
          {/* Mobile card view for seller distribution (visible on small screens only) */}
          <div className="md:hidden space-y-3">
            {sellerFinanceData.length > 0 ? sellerFinanceData.map((seller, i) => (
              <div key={seller.sellerId} className="p-3 bg-gray-50 border rounded">
                <div className="flex justify-between items-center">
                  <div className="font-medium text-gray-800">{seller.sellerName}</div>
                  <div className="text-sm bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                    {seller.percentage.toFixed(1)}%
                  </div>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Total:</span><br/>
                    <span className="font-medium">{formatRupiah(seller.total)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Transaksi:</span><br/>
                    <span>{seller.transactions} transaksi</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Item Terjual:</span><br/>
                    <span>{seller.items} item</span>
                  </div>
                </div>
              </div>
            )) : (
              <div className="p-3 text-center text-gray-500 bg-gray-50 border rounded">
                Tidak ada data penjual untuk periode ini
              </div>
            )}
          </div>
          
          {/* Desktop table for seller distribution (hidden on small screens) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full border">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="py-2 px-3 border">Penjual</th>
                  <th className="py-2 px-3 border">Total Pendapatan</th>
                  <th className="py-2 px-3 border">Total Transaksi</th>
                  <th className="py-2 px-3 border">Item Terjual</th>
                  <th className="py-2 px-3 border">Persentase</th>
                </tr>
              </thead>
              <tbody>
                {sellerFinanceData.length > 0 ? sellerFinanceData.map((seller) => (
                  <tr key={seller.sellerId} className="border-t hover:bg-gray-50">
                    <td className="py-2 px-3 border font-medium">{seller.sellerName}</td>
                    <td className="py-2 px-3 border">{formatRupiah(seller.total)}</td>
                    <td className="py-2 px-3 border">{seller.transactions}</td>
                    <td className="py-2 px-3 border">{seller.items}</td>
                    <td className="py-2 px-3 border">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full" 
                            style={{ width: `${seller.percentage}%` }}
                          ></div>
                        </div>
                        <span>{seller.percentage.toFixed(1)}%</span>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="py-6 text-gray-400 text-center">
                      Tidak ada data penjual untuk ditampilkan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Best Seller Section */}
        {Array.isArray(displayBestSellerData) && (
          <div className="mb-6">
            <h3 className="font-medium text-md mb-2 text-gray-700">Best Seller Items</h3>
            
            {/* Mobile card view for best seller (visible on small screens only) */}
            <div className="md:hidden space-y-3">
              {displayBestSellerData.length > 0 ? displayBestSellerData.map((item, i) => (
                <div key={item?.id || i} className="p-3 bg-gray-50 border rounded">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-800">#{i+1} {item?.name || 'Unnamed Item'}</span>
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                      {item?.qty || 0} terjual
                    </span>
                  </div>
                  <div className="text-gray-600 mt-1">{formatRupiah(item?.total || 0)}</div>
                </div>
              )) : (
                <div className="p-3 text-center text-gray-500 bg-gray-50 border rounded">
                  Tidak ada data best seller
                </div>
              )}
            </div>
            
            {/* Desktop table for best seller (hidden on small screens) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full border">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="py-2 px-3 border">Rank</th>
                    <th className="py-2 px-3 border">Menu</th>
                    <th className="py-2 px-3 border">Qty Terjual</th>
                    <th className="py-2 px-3 border">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {displayBestSellerData.length > 0 ? displayBestSellerData.map((item, i) => (
                    <tr key={item?.id || i} className="border-t hover:bg-gray-50">
                      <td className="py-2 px-3 border">#{i+1}</td>
                      <td className="py-2 px-3 border">{item?.name || 'Unnamed Item'}</td>
                      <td className="py-2 px-3 border">{item?.qty || 0}</td>
                      <td className="py-2 px-3 border">{formatRupiah(item?.total || 0)}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="py-6 text-gray-400 text-center">
                        Tidak ada data best seller untuk ditampilkan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Daily Finance Report */}
        <div>
          <h3 className="font-medium text-md mb-2 text-gray-700">Detail Report Harian</h3>
          
          {/* Mobile card view for finance data (visible on small screens only) */}
          <div className="md:hidden space-y-3">
            {Array.isArray(displayFinanceData) && displayFinanceData.length > 0 ? (
              displayFinanceData.map((data, index) => {
                // Safely handle date formatting
                let formattedDate = "Invalid Date";
                try {
                  formattedDate = new Date(data?.date || "").toLocaleDateString('id-ID', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  });
                  if (formattedDate === "Invalid Date") {
                    formattedDate = data?.date || `Data #${index + 1}`;
                  }
                } catch (e) {
                  formattedDate = data?.date || `Data #${index + 1}`;
                }
                
                return (
                  <div key={data?.date || index} className="p-3 bg-gray-50 border rounded">
                    <div className="font-medium">{formattedDate}</div>
                    <div className="flex justify-between mt-1">
                      <div className="text-sm text-gray-600">
                        {data?.items || 0} item terjual
                      </div>
                      <div className="font-medium text-green-700">
                        {formatRupiah(data?.total || 0)}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-4 text-gray-500 bg-gray-50 border rounded">
                Tidak ada data untuk ditampilkan. Silakan pilih rentang tanggal dan klik Generate Report.
              </div>
            )}
          </div>
          
          {/* Desktop table for finance data (hidden on small screens) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full border">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="py-2 px-3 border">Tanggal</th>
                  <th className="py-2 px-3 border">Total Item</th>
                  <th className="py-2 px-3 border">Total Penjualan</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(displayFinanceData) && displayFinanceData.length > 0 ? (
                  displayFinanceData.map((data, index) => {
                    // Safely handle date formatting
                    let formattedDate = "Invalid Date";
                    try {
                      formattedDate = new Date(data?.date || "").toLocaleDateString('id-ID', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      });
                      if (formattedDate === "Invalid Date") {
                        formattedDate = data?.date || `Data #${index + 1}`;
                      }
                    } catch (e) {
                      formattedDate = data?.date || `Data #${index + 1}`;
                    }
                    
                    return (
                      <tr key={data?.date || index} className="border-t hover:bg-gray-50">
                        <td className="py-2 px-3 border">{formattedDate}</td>
                        <td className="py-2 px-3 border">{data?.items || 0}</td>
                        <td className="py-2 px-3 border font-medium">
                          {formatRupiah(data?.total || 0)}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={3} className="py-6 text-gray-400 text-center">
                      Tidak ada data untuk ditampilkan. Silakan pilih rentang tanggal dan klik Generate Report.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
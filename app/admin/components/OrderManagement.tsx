import React from 'react';
import { Order, User } from '@/app/admin/types/index';
import { formatRupiah } from '@/app/admin/utils/formatting';
import { OrderModal } from './modals/OrderModal';

interface OrderManagementProps {
  orders: Order[];
  pagedOrders: Order[];
  orderPage: number;
  orderPageCount: number;
  orderFilter: string;
  searchOrder: string;
  orderModal: Order | null;
  user: User;
  onFilterChange: (filter: string) => void;
  onSearchChange: (search: string) => void;
  onViewOrderDetail: (order: Order) => void;
  onCompleteOrder: (order: Order) => void;
  onDeleteOrder: (order: Order) => void;
  onExportOrders: () => void;
  onPageChange: (page: number) => void;
  onCloseModal: () => void;
}

export const OrderManagement: React.FC<OrderManagementProps> = ({
  orders,
  pagedOrders,
  orderPage,
  orderPageCount,
  orderFilter,
  searchOrder,
  orderModal,
  user,
  onFilterChange,
  onSearchChange,
  onViewOrderDetail,
  onCompleteOrder,
  onDeleteOrder,
  onExportOrders,
  onPageChange,
  onCloseModal
}) => {
  // Helper function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "baru": return "bg-blue-100 text-blue-800";
      case "diproses": return "bg-yellow-100 text-yellow-800";
      case "selesai": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white p-3 md:p-4 rounded shadow">
      {/* Filters - Responsive design with stacked filters on mobile */}
      <div className="flex flex-col sm:flex-row flex-wrap justify-between items-start sm:items-center gap-3 mb-4">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <h2 className="font-bold text-lg">Pesanan Masuk</h2>
          <div className="flex items-center gap-1">
            <span className="text-gray-400 text-sm">Status:</span>
            <select
              className="border rounded px-2 py-1 text-sm"
              value={orderFilter}
              onChange={e => onFilterChange(e.target.value)}
            >
              <option value="all">Semua</option>
              <option value="baru">Baru</option>
              <option value="diproses">Diproses</option>
              <option value="selesai">Selesai</option>
            </select>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <input
            className="border px-2 py-1 rounded text-sm flex-grow"
            placeholder="Cari pesanan (ID, meja)"
            value={searchOrder}
            onChange={e => onSearchChange(e.target.value)}
          />
          <button 
            className="bg-blue-500 text-white px-3 py-1 text-sm rounded hover:bg-blue-600"
            onClick={onExportOrders}
          >
            Export Pesanan CSV
          </button>
        </div>
      </div>
      
      {/* Responsive table for mobile - Card-based view on small screens */}
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        {/* Mobile card view (visible on small screens only) */}
        <div className="md:hidden px-4">
          {pagedOrders.length === 0 ? (
            <div className="py-6 text-gray-400 text-center">Tidak ada pesanan.</div>
          ) : (
            <div className="space-y-3">
              {pagedOrders.map(order => (
                <div key={order.id} className="border rounded p-3 shadow-sm bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="text-sm text-gray-500">ID Pesanan:</div>
                      <div className="font-medium">{order.id}</div>
                    </div>
                    <div className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 text-sm mb-3">
                    <div>
                      <span className="text-gray-500">Meja:</span><br />
                      <span className="font-medium">{order.table}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Waktu:</span><br />
                      <span>{new Date(order.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="text-gray-500 text-sm">Total:</div>
                    <div className="font-bold text-lg">
                      {formatRupiah(order.items.reduce((t, i) => t + i.price * i.qty, 0))}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 pt-2 border-t">
                    <button 
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm hover:bg-blue-200" 
                      onClick={() => onViewOrderDetail(order)}
                    >
                      Detail
                    </button>
                    {order.status !== "selesai" && (
                      <button 
                        className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm hover:bg-green-200"
                        onClick={() => onCompleteOrder(order)}
                      >
                        Tandai Selesai
                      </button>
                    )}
                    <button 
                      className="bg-red-100 text-red-800 px-3 py-1 rounded text-sm hover:bg-red-200"
                      onClick={() => onDeleteOrder(order)}
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Desktop table view (hidden on small screens) */}
        <div className="hidden md:block">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="py-2 px-3 border">NIP/NIM</th>
                <th className="py-2 px-3 border">Meja</th>
                <th className="py-2 px-3 border">Status</th>
                <th className="py-2 px-3 border">Waktu</th>
                <th className="py-2 px-3 border">Total</th>
                <th className="py-2 px-3 border">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pagedOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-gray-400 text-center">Tidak ada pesanan.</td>
                </tr>
              )}
              {pagedOrders.map(order => (
                <tr key={order.id} className="border-t hover:bg-gray-50">
                  <td className="py-2 px-3 border">{order.id}</td>
                  <td className="py-2 px-3 border">{order.table}</td>
                  <td className="py-2 px-3 border">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-2 px-3 border">{new Date(order.createdAt).toLocaleString()}</td>
                  <td className="py-2 px-3 border">
                    {formatRupiah(order.items.reduce((t, i) => t + i.price * i.qty, 0))}
                  </td>
                  <td className="py-2 px-3 border">
                    <button 
                      className="text-blue-600 hover:underline mr-2" 
                      onClick={() => onViewOrderDetail(order)}
                    >
                      Detail
                    </button>
                    {order.status !== "selesai" && (
                      <button 
                        className="text-green-600 hover:underline mr-2"
                        onClick={() => onCompleteOrder(order)}
                      >
                        Tandai Selesai
                      </button>
                    )}
                    <button 
                      className="text-red-600 hover:underline"
                      onClick={() => onDeleteOrder(order)}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Pagination - Improved for mobile */}
      {orderPageCount > 1 && (
        <div className="flex justify-center mt-4 gap-1 flex-wrap">
          {Array.from({ length: orderPageCount }, (_, i) => (
            <button 
              key={i} 
              className={`px-2 py-1 rounded text-sm ${orderPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
              onClick={() => onPageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
      
      {/* Modal remains unchanged */}
      {orderModal && (
        <OrderModal
          data={orderModal}
          onClose={onCloseModal}
        />
      )}
    </div>
  );
};
import Image from 'next/image';
import { useState } from 'react';
import { Order, OrderFilter } from '../types';
import { formatRupiah } from '../utils/formatters';
import { formatTime } from '../utils/date-utils';

type OrdersListProps = {
  orders: Order[];
  orderFilter: OrderFilter;
  setOrderFilter: (filter: string) => void;
  updateOrderStatus: (id: number, status: string) => void;
};

export default function OrdersList({ 
  orders, 
  orderFilter, 
  setOrderFilter, 
  updateOrderStatus 
}: OrdersListProps) {
  // Add state for notification
  const [notification, setNotification] = useState<{message: string, type: string} | null>(null);
  
  // Handle status update with animation and notification
  const handleStatusUpdate = (id: number, status: string) => {
    updateOrderStatus(id, status);
    
    // Show notification
    setNotification({
      message: `Status pesanan #${id} diubah menjadi ${status}`,
      type: status === 'selesai' ? 'success' : 'info'
    });
    
    // Auto dismiss after 3 seconds
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  }
  
  // Filter orders based on selected filter
  // Count orders by status
  const newOrdersCount = orders.filter(o => o.status === "baru").length;
  const processingOrdersCount = orders.filter(o => o.status === "diproses").length;
  const completedOrdersCount = orders.filter(o => o.status === "selesai").length;
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Notification */}
      {notification && (
        <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-up
          ${notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'}`}>
          {notification.message}
        </div>
      )}
      
      {/* Header */}
      <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="font-bold text-lg">Pesanan Masuk</h2>
        
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          <button
            className={`px-4 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 whitespace-nowrap ${
              orderFilter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'
            }`}
            onClick={() => setOrderFilter('all')}
          >
            Semua
            <span className="inline-flex items-center justify-center bg-white/20 text-xs rounded-full w-5 h-5">
              {orders.length}
            </span>
          </button>
          
          <button
            className={`px-4 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 whitespace-nowrap ${
              orderFilter === 'baru' ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-800'
            }`}
            onClick={() => setOrderFilter('baru')}
          >
            Baru
            <span className="inline-flex items-center justify-center bg-white/20 text-xs rounded-full w-5 h-5">
              {newOrdersCount}
            </span>
          </button>
          
          <button
            className={`px-4 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 whitespace-nowrap ${
              orderFilter === 'diproses' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'
            }`}
            onClick={() => setOrderFilter('diproses')}
          >
            Diproses
            <span className="inline-flex items-center justify-center bg-white/20 text-xs rounded-full w-5 h-5">
              {processingOrdersCount}
            </span>
          </button>
          
          <button
            className={`px-4 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 whitespace-nowrap ${
              orderFilter === 'selesai' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-800'
            }`}
            onClick={() => setOrderFilter('selesai')}
          >
            Selesai
            <span className="inline-flex items-center justify-center bg-white/20 text-xs rounded-full w-5 h-5">
              {completedOrdersCount}
            </span>
          </button>
        </div>
      </div>
      
      {/* Order List */}
      <div className="divide-y">
        {orders.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <svg className="w-16 h-16 mx-auto mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <p>Belum ada pesanan {orderFilter !== 'all' ? `dengan status "${orderFilter}"` : ''}</p>
          </div>
        ) : (
          orders.map(order => (
            <div 
              key={order.id} 
              className="p-4 hover:bg-gray-50 transition"
            >
              {/* Order Header */}
              <div className="flex flex-wrap items-center justify-between mb-3 gap-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-gray-100 px-3 py-1 rounded-md text-sm font-semibold">
                    Meja #{order.table}
                  </span>
                  <span className={`px-3 py-1 rounded-md text-sm font-semibold
                    ${order.status === "baru" ? "bg-yellow-100 text-yellow-800" : ""}
                    ${order.status === "diproses" ? "bg-blue-100 text-blue-800" : ""}
                    ${order.status === "selesai" ? "bg-green-100 text-green-800" : ""}
                  `}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <span className="text-gray-400 text-sm">
                    {formatTime(order.createdAt)}
                  </span>
                  <span className="text-gray-500 text-sm font-mono">ID: #{order.id}</span>
                </div>
                
                <div className="flex gap-2">
                  {order.status === "baru" && (
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm font-medium flex items-center gap-1"
                      onClick={() => handleStatusUpdate(order.id, "diproses")}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                      </svg>
                      Proses
                    </button>
                  )}
                  {order.status === "diproses" && (
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-md text-sm font-medium flex items-center gap-1"
                      onClick={() => handleStatusUpdate(order.id, "selesai")}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                      Selesai
                    </button>
                  )}
                </div>
              </div>
              
              {/* Order Items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 my-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-gray-50 rounded-lg p-2">
                    {item.image && (
                      <div className="w-16 h-16 relative flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="64px"
                          style={{ objectFit: 'cover' }}
                          className="rounded-md"
                        />
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="font-medium text-sm truncate">{item.name}</div>
                      <div className="text-xs text-gray-500">
                        {item.qty} x {formatRupiah(item.price)}
                      </div>
                      {item.note && (
                        <div className="text-xs text-yellow-600 italic bg-yellow-50 px-2 py-1 rounded mt-1 line-clamp-2">
                          {item.note}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Order Total */}
              <div className="mt-2 pt-2 border-t flex justify-between items-center">
                <div>
                  <span className="text-sm text-gray-500">Total:</span>
                  <span className="ml-1 font-bold text-lg">
                    {formatRupiah(order.items.reduce((t, i) => t + i.qty * i.price, 0))}
                  </span>
                </div>
                
                {order.status === "selesai" && (
                  <span className="text-green-600 font-medium text-sm bg-green-50 px-3 py-1 rounded-md flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    Pesanan Selesai
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
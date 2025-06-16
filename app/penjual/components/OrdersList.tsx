import Image from 'next/image';
import { useState, useEffect } from 'react';
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
  // Add state for active order (expanded view on mobile)
  const [activeOrderId, setActiveOrderId] = useState<number | null>(null);
  // Add state for confirmation modal
  const [confirmModal, setConfirmModal] = useState<{id: number, status: string} | null>(null);
  
  // Tambahkan state untuk jumlah pesanan per kategori (agar tidak berubah saat filter diubah)
  const [orderCounts, setOrderCounts] = useState({
    all: 0,
    baru: 0,
    diproses: 0,
    selesai: 0
  });
  
  // Hitung jumlah pesanan per kategori ketika orders (dari props) berubah
  useEffect(() => {
    // Simpan data original (unfiltered)
    const originalOrders = orders;
    
    // Jika orderFilter bukan 'all', artinya orders sudah difilter
    // Jadi kita perlu mendapatkan data asli dari parent component
    if (orderFilter !== 'all') {
      // Karena kita tidak bisa mengakses myOrders dari parent,
      // kita bisa menggunakan nilai terakhir dari orderCounts
      setOrderCounts(prev => ({
        ...prev,
        // Update hanya untuk filter yang aktif
        [orderFilter]: originalOrders.length
      }));
    } else {
      // Jika filter = 'all', hitung jumlah pesanan per kategori
      setOrderCounts({
        all: originalOrders.length,
        baru: originalOrders.filter(o => o.status === "baru").length,
        diproses: originalOrders.filter(o => o.status === "diproses").length,
        selesai: originalOrders.filter(o => o.status === "selesai").length
      });
    }
  }, [orders, orderFilter]);
  
  // Handle status update with animation and notification
  const handleStatusUpdate = (id: number, status: string) => {
    updateOrderStatus(id, status);
    
    // Show notification
    setNotification({
      message: `Status pesanan #${id} diubah menjadi ${status}`,
      type: status === 'selesai' ? 'success' : 'info'
    });
    
    // Close confirmation modal if open
    setConfirmModal(null);
    
    // Auto dismiss after 3 seconds
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  }
  
  // Toggle order details visibility (for mobile)
  const toggleOrderDetails = (id: number) => {
    setActiveOrderId(activeOrderId === id ? null : id);
  }
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Notification - moved to top */}
      {notification && (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-up
          ${notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-green-400 text-white'}`}>
          {notification.message}
        </div>
      )}
      
      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-5 max-w-xs w-full">
            <h3 className="text-lg font-medium mb-3">Konfirmasi</h3>
            <p>Ubah status pesanan #{confirmModal.id} menjadi <b>{confirmModal.status}</b>?</p>
            
            <div className="flex gap-3 mt-5">
              <button 
                className="flex-1 bg-gray-200 py-2 rounded-lg font-medium"
                onClick={() => setConfirmModal(null)}
              >
                Batal
              </button>
              <button 
                className="flex-1 bg-green-500 text-white py-2 rounded-lg font-medium"
                onClick={() => handleStatusUpdate(confirmModal.id, confirmModal.status)}
              >
                Ya, Ubah
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Filter Tabs - Improved for mobile */}
      <div className="p-4 border-b flex flex-col gap-3">
        <div className="scrollbar-hide overflow-x-auto -mx-4 px-4">
          <div className="flex items-center gap-2 min-w-max">
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1.5 whitespace-nowrap ${
                orderFilter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'
              }`}
              onClick={() => setOrderFilter('all')}
            >
              Semua
              <span className="inline-flex items-center justify-center bg-white/20 text-xs rounded-full w-5 h-5">
                {orderCounts.all}
              </span>
            </button>
            
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1.5 whitespace-nowrap ${
                orderFilter === 'baru' ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-800'
              }`}
              onClick={() => setOrderFilter('baru')}
            >
              Baru
              <span className={`inline-flex items-center justify-center text-xs rounded-full w-5 h-5 
                ${orderCounts.baru > 0 && orderFilter !== 'baru' ? 'bg-red-500 text-white' : 'bg-white/20'}`}>
                {orderCounts.baru}
              </span>
            </button>
            
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1.5 whitespace-nowrap ${
                orderFilter === 'diproses' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'
              }`}
              onClick={() => setOrderFilter('diproses')}
            >
              Diproses
              <span className="inline-flex items-center justify-center bg-white/20 text-xs rounded-full w-5 h-5">
                {orderCounts.diproses}
              </span>
            </button>
            
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1.5 whitespace-nowrap ${
                orderFilter === 'selesai' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-800'
              }`}
              onClick={() => setOrderFilter('selesai')}
            >
              Selesai
              <span className="inline-flex items-center justify-center bg-white/20 text-xs rounded-full w-5 h-5">
                {orderCounts.selesai}
              </span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Order List */}
      <div className="divide-y">
        {orders.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <svg className="w-16 h-16 mx-auto mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a[...]"/>
            </svg>
            <p>Belum ada pesanan {orderFilter !== 'all' ? `dengan status "${orderFilter}"` : ''}</p>
          </div>
        ) : (
          orders.map(order => (
            <div 
              key={order.id} 
              className={`${order.status === "baru" ? "border-l-4 border-yellow-400" : ""} 
                 hover:bg-gray-50 transition`}
            >
              {/* Mobile-optimized Order Card */}
              <div 
                className="p-4"
                onClick={() => toggleOrderDetails(order.id)}
              >
                {/* Order Header - Redesigned for Mobile */}
                <div className="flex justify-between items-center mb-2">
                  <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">
                    Meja #{order.table}
                  </span>
                  
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${order.status === "baru" ? "bg-yellow-100 text-yellow-800" : ""}
                    ${order.status === "diproses" ? "bg-blue-100 text-blue-800" : ""}
                    ${order.status === "selesai" ? "bg-green-100 text-green-800" : ""}
                  `}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    {order.status === "baru" && (
                      <span className="ml-1 inline-block bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                        New
                      </span>
                    )}
                  </span>
                </div>
                
                {/* Order Info & Action */}
                <div className="flex justify-between items-center mb-3">
                  <div className="text-gray-500 text-xs">
                    <div className="flex items-center gap-1 mb-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {formatTime(order.createdAt)}
                    </div>
                    <div className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                      </svg>
                      #{order.id}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {order.status === "baru" && (
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmModal({id: order.id, status: "diproses"});
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                        Proses
                      </button>
                    )}
                    {order.status === "diproses" && (
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmModal({id: order.id, status: "selesai"});
                        }}
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
                
                {/* Order Summary */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-gray-500 text-sm">
                      {order.items.length} item | {order.items.reduce((total, item) => total + item.qty, 0)} pcs
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" 
                      className={`ml-1 h-4 w-4 text-gray-400 transition-transform ${activeOrderId === order.id ? 'rotate-180' : ''}`} 
                      viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-sm text-gray-500">Total:</span>
                    <span className="ml-1 font-bold text-lg">
                      {formatRupiah(order.items.reduce((t, i) => t + i.qty * i.price, 0))}
                    </span>
                  </div>
                </div>
                
                {/* Order Items - Collapsible on mobile */}
                {activeOrderId === order.id && (
                  <div className="mt-4 grid grid-cols-1 gap-2 border-t pt-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-gray-50 rounded-lg p-2">
                        {item.image && (
                          <div className="w-14 h-14 relative flex-shrink-0">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="56px"
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
                    
                    {order.status === "selesai" && (
                      <div className="mt-2 text-center">
                        <span className="text-green-600 font-medium text-sm bg-green-50 px-3 py-1 rounded-full inline-flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                          </svg>
                          Pesanan Selesai
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
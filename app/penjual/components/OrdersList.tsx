import Image from 'next/image';
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
  return (
    <>
      {/* Filter Pesanan */}
      <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
        <h2 className="font-bold text-lg">Pesanan Masuk</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Filter:</span>
          <select
            className="border px-2 py-1 rounded text-sm"
            value={orderFilter}
            onChange={e => setOrderFilter(e.target.value)}
          >
            <option value="all">Semua</option>
            <option value="baru">Baru</option>
            <option value="diproses">Diproses</option>
            <option value="selesai">Selesai</option>
          </select>
        </div>
      </div>
      
      {/* Daftar Pesanan */}
      <div className="bg-white p-4 rounded shadow mb-8">
        {orders.length === 0 && (
          <div className="text-gray-400 text-center py-8">Belum ada pesanan.</div>
        )}
        <div className="space-y-4">
          {orders.map(order => (
            <div 
              key={order.id} 
              className="border rounded-lg px-4 py-2 flex flex-col md:flex-row md:items-center md:justify-between"
            >
              <div>
                <div className="flex gap-4 items-center mb-1">
                  <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-semibold">
                    Meja #{order.table}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${order.status === "baru" ? "bg-yellow-100 text-yellow-800" : ""}
                    ${order.status === "diproses" ? "bg-blue-100 text-blue-800" : ""}
                    ${order.status === "selesai" ? "bg-green-100 text-green-800" : ""}
                  `}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <span className="text-gray-400 text-xs">
                    {formatTime(order.createdAt)}
                  </span>
                  <span className="text-gray-500 text-xs font-mono">#{order.id}</span>
                </div>
                
                <ul className="flex flex-wrap gap-4 mb-1">
                  {order.items.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 bg-gray-50 rounded px-2 py-1 min-w-[180px]">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={40}
                          height={28}
                          className="rounded object-cover border"
                        />
                      )}
                      <div className="flex flex-col items-start gap-1">
                        <div className="font-medium text-sm">{item.name}</div>
                        <div className="text-xs text-gray-500">
                          {item.qty} x {formatRupiah(item.price)}
                        </div>
                        {item.note && (
                          <div className="text-xs text-yellow-600 italic break-words max-w-[150px]">
                            Note: {item.note}
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-2 text-sm text-gray-600">
                  <span className="font-semibold">Total:</span> {formatRupiah(
                    order.items.reduce((t, i) => t + i.qty * i.price, 0)
                  )}
                </div>
              </div>
              
              <div className="flex flex-col md:items-end gap-2 mt-2 md:mt-0">
                {order.status === "baru" && (
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium"
                    onClick={() => updateOrderStatus(order.id, "diproses")}
                  >
                    Tandai Diproses
                  </button>
                )}
                {order.status === "diproses" && (
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-full text-sm font-medium"
                    onClick={() => updateOrderStatus(order.id, "selesai")}
                  >
                    Tandai Selesai
                  </button>
                )}
                {order.status === "selesai" && (
                  <span className="text-green-600 font-semibold text-sm">Selesai</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
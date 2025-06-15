// import Image from "next/image";
// import { useState } from "react";
// import { formatRupiah } from "../utils/formatters";

// type DashboardHomeProps = {
//   user: { nama: string; nip: string };
//   stats: {
//     totalOrder: number;
//     totalCompleted: number;
//     totalIncome: number;
//     newOrders: number;
//   };
//   onNavigate: (section: string) => void;
//   latestOrders: any[];
//   lowStockItems: any[];
// };

// export default function DashboardHome({ 
//   user, 
//   stats, 
//   onNavigate,
//   latestOrders,
//   lowStockItems
// }: DashboardHomeProps) {
//   return (
//     <div className="space-y-6">
//       {/* Welcome Section with CTA */}
//       <div className="bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl overflow-hidden shadow-lg">
//         <div className="md:flex items-center">
//           <div className="p-6 md:p-8 md:w-2/3">
//             <h1 className="text-white text-2xl md:text-3xl font-bold mb-2">Selamat Datang, {user.nama}!</h1>
//             <p className="text-green-50 mb-6 text-lg">Anda memiliki {stats.newOrders} pesanan baru yang perlu diproses</p>
            
//             <div className="flex flex-wrap gap-3">
//               <button 
//                 onClick={() => onNavigate('orders')}
//                 className="bg-white text-green-600 hover:bg-green-50 px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-all transform hover:scale-105"
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                   <path d="M19 12H5m14 0l-4-4m4 4l-4 4"></path>
//                 </svg>
//                 Lihat Pesanan
//               </button>
              
//               <button 
//                 onClick={() => onNavigate('menu')}
//                 className="bg-green-700 hover:bg-green-800 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-all transform hover:scale-105"
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                   <path d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
//                 </svg>
//                 Tambah Menu
//               </button>
//             </div>
//           </div>
          
//           <div className="hidden md:block md:w-1/3 h-full p-6">
//             <Image 
//               src="/assets/chef-illustration.svg" 
//               alt="Chef Illustration" 
//               width={240} 
//               height={240}
//               className="w-full h-auto"
//             />
//           </div>
//         </div>
//       </div>
      
//       {/* Quick Status Cards */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
//           <div className="flex justify-between">
//             <div>
//               <p className="text-sm text-gray-500 mb-1">Total Pesanan</p>
//               <h3 className="text-2xl font-bold">{stats.totalOrder}</h3>
//             </div>
//             <div className="rounded-full bg-blue-100 p-2 flex items-center justify-center h-10 w-10">
//               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
//                 <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
//                 <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
//               </svg>
//             </div>
//           </div>
//         </div>
        
//         <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
//           <div className="flex justify-between">
//             <div>
//               <p className="text-sm text-gray-500 mb-1">Selesai</p>
//               <h3 className="text-2xl font-bold">{stats.totalCompleted}</h3>
//             </div>
//             <div className="rounded-full bg-green-100 p-2 flex items-center justify-center h-10 w-10">
//               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
//                 <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
//                 <polyline points="22 4 12 14.01 9 11.01"></polyline>
//               </svg>
//             </div>
//           </div>
//         </div>
        
//         <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
//           <div className="flex justify-between">
//             <div>
//               <p className="text-sm text-gray-500 mb-1">Pendapatan</p>
//               <h3 className="text-xl font-bold">{formatRupiah(stats.totalIncome)}</h3>
//             </div>
//             <div className="rounded-full bg-yellow-100 p-2 flex items-center justify-center h-10 w-10">
//               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-600">
//                 <line x1="12" y1="1" x2="12" y2="23"></line>
//                 <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
//               </svg>
//             </div>
//           </div>
//         </div>
        
//         <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
//           <div className="flex justify-between">
//             <div>
//               <p className="text-sm text-gray-500 mb-1">Menu</p>
//               <h3 className="text-2xl font-bold">{lowStockItems.length}</h3>
//               <p className="text-xs text-red-500">Stok menipis</p>
//             </div>
//             <div className="rounded-full bg-red-100 p-2 flex items-center justify-center h-10 w-10">
//               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
//                 <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
//               </svg>
//             </div>
//           </div>
//         </div>
//       </div>
      
//       {/* Quick Access Section */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {/* Latest Orders Card */}
//         <div className="md:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
//           <div className="p-4 border-b flex justify-between items-center">
//             <h3 className="font-bold">Pesanan Terbaru</h3>
//             <button 
//               onClick={() => onNavigate('orders')}
//               className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
//             >
//               Lihat Semua
//               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                 <line x1="5" y1="12" x2="19" y2="12"></line>
//                 <polyline points="12 5 19 12 12 19"></polyline>
//               </svg>
//             </button>
//           </div>
          
//           <div className="divide-y">
//             {latestOrders.length === 0 ? (
//               <div className="text-center py-6 text-gray-400">Belum ada pesanan terbaru</div>
//             ) : (
//               latestOrders.slice(0, 3).map((order, idx) => (
//                 <div key={idx} className="p-4 hover:bg-gray-50">
//                   <div className="flex justify-between items-start mb-2">
//                     <div className="flex items-center gap-3">
//                       <div className="bg-blue-100 rounded-full p-2">
//                         <span className="text-blue-600 font-bold">{order.table}</span>
//                       </div>
//                       <div>
//                         <p className="font-medium">Meja #{order.table}</p>
//                         <p className="text-xs text-gray-500">{order.createdAt}</p>
//                       </div>
//                     </div>
//                     <span className={`px-2 py-1 rounded-full text-xs font-medium
//                       ${order.status === 'baru' ? 'bg-yellow-100 text-yellow-800' : ''}
//                       ${order.status === 'diproses' ? 'bg-blue-100 text-blue-800' : ''}
//                       ${order.status === 'selesai' ? 'bg-green-100 text-green-800' : ''}
//                     `}>
//                       {order.status}
//                     </span>
//                   </div>
                  
//                   <div>
//                     <p className="text-sm text-gray-600">{order.items.length} item · {formatRupiah(order.total)}</p>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
        
//         {/* Low Stock Items */}
//         <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
//           <div className="p-4 border-b">
//             <h3 className="font-bold">Stok Menipis</h3>
//           </div>
          
//           <div className="divide-y">
//             {lowStockItems.length === 0 ? (
//               <div className="text-center py-6 text-gray-400">Semua menu memiliki stok yang cukup</div>
//             ) : (
//               lowStockItems.map((item, idx) => (
//                 <div key={idx} className="p-3 flex items-center gap-3">
//                   <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-gray-100">
//                     <Image
//                       src={item.image}
//                       alt={item.name}
//                       fill
//                       sizes="48px"
//                       className="object-cover"
//                     />
//                   </div>
//                   <div className="min-w-0 flex-1">
//                     <p className="font-medium truncate">{item.name}</p>
//                     <div className="flex items-center gap-1">
//                       <span className="text-xs text-red-600 font-medium">Stok: {item.stok}</span>
//                       <div className="bg-red-100 h-1.5 rounded-full flex-1">
//                         <div 
//                           className="bg-red-500 h-full rounded-full" 
//                           style={{ width: `${Math.min(item.stok * 25, 100)}%` }}
//                         ></div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
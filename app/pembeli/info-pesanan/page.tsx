"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import OrderLayout from "../components/OrderLayout";
import { PesananStatus } from "../types/order";

export default function InfoPesananPage() {
  const [status, setStatus] = useState<PesananStatus>("pending");
  const [nama, setNama] = useState("");
  const [, setNim] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [estimatedTime, setEstimatedTime] = useState(10);
  const [orderNumber, setOrderNumber] = useState("");

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const checkout = localStorage.getItem("checkoutData");
      if (checkout) {
        const { nama, nim } = JSON.parse(checkout);
        setNama(nama);
        setNim(nim);
      }
      setTableNumber(localStorage.getItem("tableNumber") ?? "");
      
      // Generate random order number
      setOrderNumber(`A${Math.floor(Math.random() * 100)}`);
    }

    const timeout = setTimeout(() => {
      setStatus("diproses");
      setEstimatedTime(7);
    }, 2000);
    
    const doneTimeout = setTimeout(() => {
      setStatus("selesai");
      setEstimatedTime(0);
    }, 8000);
    
    return () => {
      clearTimeout(timeout);
      clearTimeout(doneTimeout);
    };
  }, []);

  return (
    <OrderLayout title="Status Pesanan">
      <div className="mb-4">
        <StatusIndicator status={status} />
      </div>
      
      <div className="bg-gray-50 rounded-lg p-3 mb-4">
        <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-sm">
          <div className="text-gray-500">No. Pesanan:</div>
          <div className="font-medium text-right">{orderNumber}</div>
          
          <div className="text-gray-500">Meja:</div>
          <div className="font-medium text-right">{tableNumber}</div>
          
          <div className="text-gray-500">Pemesan:</div>
          <div className="font-medium text-right truncate">{nama}</div>
        </div>
      </div>
      
      <div className="space-y-3">
        {status === "selesai" ? (
          <div className="flex items-center p-3 bg-green-50 rounded-lg">
            <div className="w-10 h-10 flex-shrink-0 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <i className="fas fa-check text-green-600"></i>
            </div>
            <div>
              <div className="font-medium">Pesanan siap!</div>
              <div className="text-xs text-green-600">Selamat Makan! 🍽️ </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center p-3 bg-blue-50 rounded-lg">
            <div className="w-10 h-10 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <i className={`fas ${status === "pending" ? "fa-clock" : "fa-cog fa-spin"} text-blue-600`}></i>
            </div>
            <div>
              <div className="font-medium">Estimasi waktu</div>
              <div className="text-xs"><span className="text-blue-600 font-medium">{estimatedTime} menit</span> lagi</div>
            </div>
          </div>
        )}

        <button
          className="w-full px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-medium flex items-center justify-center"
          onClick={() => router.replace("/pembeli")}
        >
          <i className="fas fa-shopping-cart mr-2"></i>
          Pesan Lagi
        </button>
      </div>
    </OrderLayout>
  );
}

function StatusIndicator({ status }: { status: PesananStatus }) {
  return (
    <div className="relative pb-3">
      {/* Progress bar */}
      <div className="h-1.5 bg-gray-200 absolute top-6 left-0 right-0 z-0">
        <div 
          className={`h-full bg-green-600 transition-all duration-500`} 
          style={{ 
            width: status === "pending" ? "0%" : 
                  status === "diproses" ? "50%" : "100%" 
          }}
        />
      </div>

      {/* Status circles */}
      <div className="flex justify-between relative z-10">
        <div className="flex flex-col items-center">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
            status !== "pending" ? "bg-green-600 border-green-600 text-white" : "bg-white border-gray-300 text-gray-500"
          }`}>
            <i className="fas fa-receipt text-lg"></i>
          </div>
          <span className={`text-sm mt-1 ${
            status !== "pending" ? "text-green-600 font-medium" : "text-gray-500"
          }`}>Diterima</span>
        </div>

        <div className="flex flex-col items-center">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
            status === "diproses" || status === "selesai" ? "bg-green-600 border-green-600 text-white" : "bg-white border-gray-300 text-gray-500"
          }`}>
            <i className="fas fa-utensils text-lg"></i>
          </div>
          <span className={`text-sm mt-1 ${
            status === "diproses" || status === "selesai" ? "text-green-600 font-medium" : "text-gray-500"
          }`}>Diproses</span>
        </div>

        <div className="flex flex-col items-center">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
            status === "selesai" ? "bg-green-600 border-green-600 text-white" : "bg-white border-gray-300 text-gray-500"
          }`}>
            <i className="fas fa-check text-lg"></i>
          </div>
          <span className={`text-sm mt-1 ${
            status === "selesai" ? "text-green-600 font-medium" : "text-gray-500"
          }`}>Selesai</span>
        </div>
      </div>

      {/* Status text bubble */}
      {status === "selesai" && (
        <div className="mt-4 text-center">
          <div className="inline-block bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-medium">
            Pesanan selesai!
          </div>
        </div>
      )}
    </div>
  );
}
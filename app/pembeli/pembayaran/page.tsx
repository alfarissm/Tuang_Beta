"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import OrderLayout from "../components/OrderLayout";
import { CartItem, formatRupiah } from "../types/order";

export default function PembayaranPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [nama, setNama] = useState("");
  const [nim, setNim] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [isPaid, setIsPaid] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCart(JSON.parse(localStorage.getItem("cart") ?? "[]"));
      setTableNumber(localStorage.getItem("tableNumber") ?? "");
      const checkoutData = localStorage.getItem("checkoutData");
      if (checkoutData) {
        const { nama, nim } = JSON.parse(checkoutData);
        setNama(nama);
        setNim(nim);
      }
    }
  }, []);

  const subtotal = cart.reduce((t, i) => t + i.price * i.quantity, 0);

  const handleBayar = () => {
    setIsPaid(true);
    setTimeout(() => router.push("/pembeli/info-pesanan"), 1200);
  };

  return (
    <OrderLayout title="Pembayaran" compact>
      <div className="space-y-3">
        {/* Customer Info - Compact Version */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-700">Info Pembeli</h3>
            <span className="text-xs text-gray-500">Meja #{tableNumber || "-"}</span>
          </div>
          <div className="flex justify-between text-sm">
            <div className="text-gray-600 w-1/2">
              <div className="truncate">{nama || "-"}</div>
              <div className="truncate text-xs text-gray-500">{nim || "-"}</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-green-600">{formatRupiah(subtotal)}</div>
              <div className="text-xs text-gray-500">Total Pembayaran</div>
            </div>
          </div>
        </div>

        {/* Order Details - Compact & Scrollable */}
        <div className="bg-gray-50 rounded-lg p-3">
          <h3 className="text-sm font-medium text-gray-700 mb-2 flex justify-between">
            <span>Detail Pesanan</span>
            <span className="text-xs text-gray-500">{cart.length} item</span>
          </h3>
          <div className="max-h-28 overflow-y-auto pr-1 space-y-1.5">
            {cart.map((item) => (
              <div key={item.id + (item.note ?? "")} className="flex justify-between text-sm border-b border-gray-100 pb-1.5 last:border-0">
                <div className="flex-1 pr-2">
                  <div className="flex">
                    <span className="font-medium mr-1.5">{item.quantity}x</span>
                    <span className="truncate">{item.name}</span>
                  </div>
                  {item.note && <div className="text-xs text-gray-500 italic truncate">Note: {item.note}</div>}
                </div>
                <span className="text-right whitespace-nowrap">{formatRupiah(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods - Compact Horizontal Version */}
        <div className="bg-gray-50 rounded-lg p-3">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Metode Pembayaran</h3>
          <div className="flex justify-between">
            <div className="flex-1 flex items-center bg-white rounded-lg p-2 mr-2 border border-gray-200">
              <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center mr-2 text-green-600">
                <i className="fas fa-qrcode"></i>
              </div>
              <div className="text-sm">QRIS</div>
            </div>
            <div className="flex-1 flex items-center bg-white rounded-lg p-2 border border-gray-200">
              <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center mr-2 text-green-600">
                <i className="fas fa-money-bill"></i>
              </div>
              <div className="text-sm">Cash</div>
            </div>
          </div>
        </div>

        {/* Payment Button or Success State */}
        {!isPaid ? (
          <button
            className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-medium flex items-center justify-center"
            onClick={handleBayar}
          >
            <i className="fas fa-check-circle mr-2"></i>
            Konfirmasi Pembayaran
          </button>
        ) : (
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <div className="inline-block h-10 w-10 rounded-full bg-green-100 p-2 mb-2">
              <svg className="h-full w-full text-green-600 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <p className="text-green-600 font-medium text-sm animate-pulse">
              Pembayaran berhasil!
            </p>
            <p className="text-xs text-green-500">
              Mengarahkan ke info pesanan...
            </p>
          </div>
        )}
      </div>
    </OrderLayout>
  );
}
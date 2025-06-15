"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import OrderLayout from "../components/OrderLayout";
import { CartItem, formatRupiah, getCart, getTableNumber } from "../types/order";

export default function CheckoutPage() {
  const router = useRouter();
  const [nama, setNama] = useState("");
  const [nim, setNim] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const cart = getCart();
  const subtotal = cart.reduce(
    (t: number, i: CartItem) => t + i.price * i.quantity,
    0
  );
  const tableNumber = getTableNumber();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama || !nim) return;
    localStorage.setItem("checkoutData", JSON.stringify({ nama, nim }));
    setSubmitted(true);
    setTimeout(() => router.push("/pembeli/pembayaran"), 750);
  };

  return (
    <OrderLayout title="Data Diri">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition text-sm"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Masukkan nama lengkap"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">NIM/NIP</label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition text-sm"
              value={nim}
              onChange={(e) => setNim(e.target.value)}
              placeholder="Masukkan NIM/NIP"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Meja</label>
            <input
              className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 cursor-not-allowed text-gray-600 text-sm"
              value={tableNumber}
              disabled
            />
          </div>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg mt-3">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-700">Ringkasan Pesanan</h3>
            <span className="text-xs text-gray-500">{cart.length} item</span>
          </div>
          
          <div className="max-h-36 overflow-y-auto space-y-1.5 mb-3">
            {cart.map((item: CartItem) => (
              <div
                key={item.id + (item.note ?? "")}
                className="flex justify-between py-1.5 border-b border-gray-100 last:border-0"
              >
                <div className="flex-1 pr-2">
                  <div className="flex text-sm">
                    <span className="font-medium mr-1">{item.quantity}x</span>
                    <span className="truncate">{item.name}</span>
                  </div>
                  {item.note && <div className="text-xs text-gray-500 italic truncate">Note: {item.note}</div>}
                </div>
                <span className="text-sm text-gray-700 whitespace-nowrap">{formatRupiah(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between items-center pt-2 border-t border-gray-200">
            <span className="font-medium text-gray-700 text-sm">Total</span>
            <span className="font-bold text-green-600">{formatRupiah(subtotal)}</span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-3 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-medium flex items-center justify-center text-sm"
          disabled={submitted}
        >
          {submitted ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Menyimpan data...</span>
            </>
          ) : (
            <>
              <i className="fas fa-arrow-right mr-2"></i>
              Lanjut ke Pembayaran
            </>
          )}
        </button>

        {submitted && (
          <div className="text-green-600 text-center mt-2 animate-pulse text-sm">
            Data tersimpan, mengarahkan ke pembayaran...
          </div>
        )}
      </form>
    </OrderLayout>
  );
}
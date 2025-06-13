"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  note?: string;
}

function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("cart") ?? "[]");
  } catch {
    return [];
  }
}

function getTableNumber() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("tableNumber") ?? "";
}

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
    <div className="min-h-screen flex items-center justify-center bg-green-400 px-4">
      <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-lg text-center">
        <h2 className="font-bold text-2xl mb-4">Data Diri</h2>
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-sm font-medium mb-1">Nama</label>
            <input
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">NIM/NIP</label>
            <input
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
              value={nim}
              onChange={(e) => setNim(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Nomor Meja</label>
            <input
              className="w-full px-3 py-2 border rounded bg-gray-100 cursor-not-allowed"
              value={tableNumber}
              disabled
            />
          </div>
          <button
            type="submit"
            className="w-full px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition"
          >
            Lanjut ke Pembayaran
          </button>
        </form>

        {submitted && (
          <div className="text-green-600 mt-4">
            Data diri tersimpan, redirect ke pembayaran...
          </div>
        )}

        <div className="mt-6 text-left">
          <h3 className="font-bold mb-2">Ringkasan Pesanan</h3>
          {cart.map((item: CartItem) => (
            <div
              key={item.id + (item.note ?? "")}
              className="flex justify-between mb-1"
            >
              <span>
                {item.quantity}x {item.name}
              </span>
              <span>Rp {item.price * item.quantity}</span>
            </div>
          ))}
          <div className="font-bold text-right">Total: Rp {subtotal}</div>
        </div>
      </div>
    </div>
  );
}
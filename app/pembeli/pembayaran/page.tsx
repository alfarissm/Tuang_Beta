"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function formatRupiah(angka: number) {
  return angka.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export default function PembayaranPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any[]>([]);
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
    <div className="min-h-screen flex items-center justify-center bg-green-400 px-4">
      <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-lg text-center">
        <h2 className="font-bold text-2xl mb-4">Pembayaran</h2>

        <div className="text-left space-y-1 mb-4">
          <div>Nama: <b>{nama}</b></div>
          <div>NIM: <b>{nim}</b></div>
          <div>Meja: <b>{tableNumber}</b></div>
        </div>

        <div className="text-left mb-4">
          <h3 className="font-semibold mb-2">Ringkasan Pesanan:</h3>
          <ul>
            {cart.map((item) => (
              <li key={item.id + (item.note ?? "")} className="mb-1">
                {item.quantity}x {item.name} - {formatRupiah(item.price * item.quantity)}
                {item.note && (
                  <div className="text-xs italic text-gray-500 ml-4">Note: {item.note}</div>
                )}
              </li>
            ))}
          </ul>
          <div className="font-bold mt-3 text-right">Total: {formatRupiah(subtotal)}</div>
        </div>

        <div className="text-left mb-5">
          <span className="font-semibold">Metode Pembayaran:</span>{" "}
          <span className="text-green-600">Transfer QRIS / Cash</span>
        </div>

        {!isPaid ? (
          <button
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded transition"
            onClick={handleBayar}
          >
            Konfirmasi Pembayaran
          </button>
        ) : (
          <div className="text-green-600 font-semibold mt-4 animate-pulse">
            Pembayaran berhasil! Mengarahkan ke info pesanan...
          </div>
        )}
      </div>
    </div>
  );
}

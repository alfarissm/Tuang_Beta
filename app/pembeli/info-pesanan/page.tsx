"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type PesananStatus = "pending" | "diproses" | "selesai" | "gagal";

export default function InfoPesananPage() {
  const [status, setStatus] = useState<PesananStatus>("pending");
  const [nama, setNama] = useState("");
  const [nim, setNim] = useState("");
  const [tableNumber, setTableNumber] = useState("");

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
    }

    const timeout = setTimeout(() => setStatus("diproses"), 2000);
    const doneTimeout = setTimeout(() => setStatus("selesai"), 8000);
    return () => {
      clearTimeout(timeout);
      clearTimeout(doneTimeout);
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-400 px-4">
      <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-lg text-center">
        <h2 className="font-bold text-2xl mb-4">Info & Status Pesanan</h2>

        <div className="text-left space-y-1 mb-4">
          <div>Nama: <b>{nama}</b></div>
          <div>NIM: <b>{nim}</b></div>
          <div>Meja: <b>{tableNumber}</b></div>
        </div>

        <div className="my-6">
          <StatusBadge status={status} />
        </div>

        <div className="text-sm text-gray-500 mb-6">
          Status pesanan akan diperbarui secara otomatis.
        </div>

        <button
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded transition"
          onClick={() => router.replace("/pembeli")}
        >
          Pesan Lagi
        </button>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: PesananStatus }) {
  let className = "";
  let text = "";
  let animation = "";

  switch (status) {
    case "pending":
      className = "bg-yellow-100 text-yellow-700";
      text = "Menunggu konfirmasi...";
      animation = "animate-pulse";
      break;
    case "diproses":
      className = "bg-blue-100 text-blue-700";
      text = "Pesanan sedang diproses";
      animation = "animate-pulse";
      break;
    case "selesai":
      className = "bg-green-100 text-green-700";
      text = "Pesanan selesai! Silakan ambil/makan 😊";
      break;
    case "gagal":
      className = "bg-red-100 text-red-700";
      text = "Pesanan gagal";
      break;
  }

  return (
    <div className={`px-4 py-2 rounded font-semibold ${className} ${animation}`}>
      {text}
    </div>
  );
}

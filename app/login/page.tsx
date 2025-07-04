"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Tipe data user terdaftar
type User = {
  id: number;
  nama: string;
  nip: string;
  password: string;
  role: "penjual" | "admin";
};

// Dummy data user terdaftar (hanya penjual dan admin)
const users: User[] = [
  { id: 2, nama: "Wowo", nip: "456", password: "penjual", role: "penjual" },
  { id: 3, nama: "Luhut", nip: "789", password: "penjual", role: "penjual" },
  { id: 4, nama: "Admin", nip: "000", password: "admin", role: "admin" },
];

export default function LoginPage() {
  const [nama, setNama] = useState("");
  const [nip, setNip] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState<1 | 2>(1);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  // Step 1: Nama & NIP
  const handleNamaNip = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (!nama.trim() || !nip.trim()) {
      setError("Nama dan NIP wajib diisi!");
      return;
    }
    const user = users.find(
      u =>
        u.nama.toLowerCase() === nama.trim().toLowerCase() &&
        u.nip === nip.trim()
    );
    if (!user) {
      setError("Nama/NIP tidak terdaftar!");
      return;
    }
    // Penjual/Admin lanjut step konfirmasi password
    setCurrentUser(user);
    setStep(2);
    setPassword("");
  };

  // Step 2: Password
  const handlePassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (!password) {
      setError("Password wajib diisi!");
      return;
    }
    if (!currentUser || password !== currentUser.password) {
      setError("Password salah!");
      return;
    }
    localStorage.setItem("user", JSON.stringify(currentUser));
    if (currentUser.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/penjual");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-400">
      <form
        className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-4"
        onSubmit={step === 1 ? handleNamaNip : handlePassword}
      >
        <div className="flex justify-center mb-2">
          <Image src="/Frame 7.png" alt="Logo" width={80} height={80} />
        </div>
        <h2 className="text-2xl font-bold text-center mb-2">Login</h2>
        {error && <div className="text-red-600 text-center">{error}</div>}

        {step === 1 && (
          <>
            <div>
              <label className="block mb-1 font-medium">Nama</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={nama}
                onChange={e => setNama(e.target.value)}
                placeholder="Nama lengkap"
                autoFocus
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">NIP</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={nip}
                onChange={e => setNip(e.target.value)}
                placeholder="NIP"
              />
            </div>
          </>
        )}

        {step === 2 && currentUser && (
          <>
            <div>
              <label className="block mb-1 font-medium">Nama</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2 bg-gray-100"
                value={currentUser.nama}
                disabled
                readOnly
                tabIndex={-1}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">NIP</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2 bg-gray-100"
                value={currentUser.nip}
                disabled
                readOnly
                tabIndex={-1}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Password</label>
              <input
                type="password"
                className="w-full border rounded px-3 py-2"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
                autoFocus
              />
            </div>
            <div className="flex justify-between pt-2">
              <button
                type="button"
                className="text-sm text-gray-500 hover:underline"
                onClick={() => {
                  setStep(1);
                  setError("");
                  setPassword("");
                }}
              >
                &larr; Kembali
              </button>
            </div>
          </>
        )}

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded font-bold mt-4 hover:bg-green-600"
        >
          {step === 1 ? "Login" : "Konfirmasi"}
        </button>
        <div className="text-xs text-gray-400 pt-2">
          <b>Demo Data:</b> <br />
          Penjual: Wowo / 456 / penjual<br />
          Penjual: Luhut / 789 / penjual<br />
          Admin: Admin / 000 / admin
        </div>
      </form>
    </div>
  );
}
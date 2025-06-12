HEAD
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Head from "next/head";
import Image from "next/image";
import SellerDropdown from "@/components/SellerDropdown";

// Dummy data penjual
const sellers = [
  { id: 1, nama: "Wowo" },
  { id: 2, nama: "Luhut" },
];

// Dummy menu per penjual
const foodItems = [
  { id: 101, sellerId: 1, name: "Mie Ayam", price: 15000, category: "mains", image: "/Mie-ayam.jpg" },
  { id: 102, sellerId: 1, name: "Ayam Bakar", price: 15000, category: "mains", image: "/Ayam bakar.jpg" },
  { id: 201, sellerId: 1, name: "Matcha", price: 25000, category: "drinks", image: "/matcha.webp" },
  { id: 202, sellerId: 1, name: "Jus Alpukat", price: 25000, category: "drinks", image: "/jus.jpg" },
  { id: 301, sellerId: 2, name: "Martabak", price: 10000, category: "sides", image: "/martabak.jpg" },
  { id: 302, sellerId: 2, name: "Nasi Goreng", price: 10000, category: "mains", image: "/nasigoreng.jpg" },
  { id: 303, sellerId: 2, name: "Teh", price: 10000, category: "drinks", image: "/tehhangat.jpeg" },
  { id: 304, sellerId: 2, name: "Iphone 16", price: 16999999, category: "others", image: "/iphone.webp" },
];

type FoodItem = typeof foodItems[number];
type CartItem = FoodItem & { quantity: number; note?: string };

function formatRupiah(angka: number) {
  return angka.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export default function PageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<{ nama: string; nim: string; role: string } | null>(null);

  // Nomor meja dari URL/manual
  const mejaFromUrl = searchParams.get("meja");
  const [currentTable, setCurrentTable] = useState<string | null>(mejaFromUrl || null);

  // Modal meja
  const [manualModalVisible, setManualModalVisible] = useState(!mejaFromUrl);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      router.replace("/login");
      return;
    }
    const u = JSON.parse(userStr);
    if (!u || u.role !== "pembeli") {
      router.replace("/login");
      return;
    }
    setUser(u);
  }, [router]);

  // Filter kategori dan penjual
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSeller, setSelectedSeller] = useState("all");

  // Cart
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  // Modal note
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [noteValue, setNoteValue] = useState("");
  const [selectedFoodForNote, setSelectedFoodForNote] = useState<FoodItem | null>(null);

  const [search, setSearch] = useState("");
  const [tableNumber, setTableNumber] = useState("");

  // Ambil semua kategori unik
  const categories = Array.from(new Set(foodItems.map(f => f.category)));

  // Ambil semua penjual unik
  const sellerOptions = [{ id: "all", nama: "Semua Penjual" }, ...sellers];

  // Filter menu
  const filteredItems = foodItems.filter(item => {
    const catOk = selectedCategory === "all" || item.category === selectedCategory;
    const sellerOk = selectedSeller === "all" || item.sellerId === Number(selectedSeller);
    const searchOk = item.name.toLowerCase().includes(search.toLowerCase());
    return catOk && sellerOk && searchOk;
  });

  // Handler add to cart, validasi hanya boleh 1 penjual
  const handleAddToCart = (item: FoodItem) => {
    if (cart.length > 0 && cart[0].sellerId !== item.sellerId) {
      alert("Cart hanya bisa berisi menu dari satu penjual saja. Selesaikan pesanan atau kosongkan cart terlebih dahulu.");
      return;
    }
    setSelectedFoodForNote(item);
    setNoteValue("");
    setNoteModalVisible(true);
  };

  const handleSubmitNote = () => {
    if (selectedFoodForNote) {
      setCart((c) => {
        const exist = c.find((i) => i.id === selectedFoodForNote.id && i.note === noteValue.trim());
        if (exist) {
          return c.map((i) =>
            i.id === selectedFoodForNote.id && i.note === noteValue.trim()
              ? { ...i, quantity: i.quantity + 1 }
              : i
          );
        }
        return [...c, { ...selectedFoodForNote, quantity: 1, note: noteValue.trim() }];
      });
      setNoteModalVisible(false);
      setSelectedFoodForNote(null);
      setNoteValue("");
    }
  };

  const handleIncrease = (id: number, note?: string) =>
    setCart(c => c.map(i => i.id === id && i.note === note ? { ...i, quantity: i.quantity + 1 } : i));
  const handleDecrease = (id: number, note?: string) =>
    setCart(c => c.map(i => i.id === id && i.note === note ? { ...i, quantity: i.quantity > 1 ? i.quantity - 1 : 1 } : i));
  const handleRemove = (id: number, note?: string) =>
    setCart(c => c.filter(i => !(i.id === id && i.note === note)));

  const toggleCartDrawer = () => setCartDrawerOpen(v => !v);

  const handleConfirmTable = () => {
    if (tableNumber) {
      setCurrentTable(tableNumber);
      setManualModalVisible(false);
      router.replace(`?meja=${tableNumber}`);
    }
  };

  // Checkout sekarang: simpan cart, seller, dan meja ke localStorage, lalu redirect ke /pembeli/checkout
  const handleCheckout = () => {
    if (cart.length === 0) return;
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("selectedSeller", JSON.stringify(cart[0]?.sellerId));
    localStorage.setItem("tableNumber", currentTable || "");
    router.push("/pembeli/checkout");
  };

  const subtotal = cart.reduce((t, i) => t + i.price * i.quantity, 0);

  // WRAPPER untuk memastikan setSelectedSeller menerima string
  const handleSetSelectedSeller = (id: string | number) => setSelectedSeller(String(id));

  if (!user) return null;
=======
import { Suspense } from "react";
import PageClient from "./PageClient";
5155689 (v3)

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageClient />
    </Suspense>
  );
}

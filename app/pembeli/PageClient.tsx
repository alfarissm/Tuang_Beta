"use client";

import { useState } from "react";
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

  // Nomor meja dari URL/manual
  const mejaFromUrl = searchParams.get("meja");
  const [currentTable, setCurrentTable] = useState<string | null>(mejaFromUrl || null);

  // Modal meja
  const [manualModalVisible, setManualModalVisible] = useState(!mejaFromUrl);

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
  const sellerOptions = [{ id: "all", nama: "Semua Toko" }, ...sellers];

  // Filter menu
  const filteredItems = foodItems.filter(item => {
    const catOk = selectedCategory === "all" || item.category === selectedCategory;
    const sellerOk = selectedSeller === "all" || item.sellerId === Number(selectedSeller);
    const searchOk = item.name.toLowerCase().includes(search.toLowerCase());
    return catOk && sellerOk && searchOk;
  });
  
  // Handler add to cart, kini tanpa validasi penjual
  const handleAddToCart = (item: FoodItem) => {
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

  // Checkout sekarang: simpan seluruh cart dan meja ke localStorage, lalu redirect ke /pembeli/checkout
  const handleCheckout = () => {
    if (cart.length === 0) return;
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("tableNumber", currentTable || "");
    router.push("/pembeli/checkout");
  };

  const subtotal = cart.reduce((t, i) => t + i.price * i.quantity, 0);

  // WRAPPER untuk memastikan setSelectedSeller menerima string
  const handleSetSelectedSeller = (id: string | number) => setSelectedSeller(String(id));

  return (
    <>
      <Head>
        <title>Menu Makanan</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        {/* Responsive extra styles */}
        <style>{`
          /* Badge Styling */
          .cart-badge {
            position: absolute;
            top: -6px;
            right: -6px;
            background: #53B175;
            color: white;
            border-radius: 50%;
            font-size: 0.75rem;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
          }
          
          /* Drawer Animation */
          .drawer.closed {
            display: none !important;
          }
          .drawer.open {
            display: block !important;
            animation: slideInDrawer 0.2s;
          }
          @keyframes slideInDrawer {
            from { right: -100vw; }
            to   { right: 0; }
          }
          
          /* Food Card Styling */
          .food-card {
            transition: transform 0.2s, box-shadow 0.2s;
          }
          .food-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          }
          
          /* Category Button Styling */
          .category-btn {
            transition: all 0.2s;
          }
          .category-btn:hover:not(.active) {
            background-color: #f3f4f6;
          }
          
          /* Responsive Adaptations */
          @media (max-width: 768px) {
            .drawer {
              width: 100vw !important;
              max-width: 100vw !important;
              min-width: 0 !important;
            }
            .cart-item {
              flex-direction: column;
              align-items: flex-start;
              gap: 8px;
            }
            .category-btn {
              font-size: 0.85rem;
              padding: 0.25rem 0.75rem;
            }
            /* Maintain height proportion on small screens */
            .food-img {
              height: 140px !important;
            }
            .food-card-content {
              padding: 0.75rem !important;
            }
          }
          
          @media (max-width: 500px) {
            .drawer {
              padding: 0 !important;
            }
            .cart-item {
              flex-direction: column;
              align-items: flex-start;
              gap: 8px;
            }
            .category-btn {
              font-size: 0.80rem;
              padding: 0.2rem 0.5rem;
            }
            /* Make food cards more compact on very small screens */
            .food-img {
              height: 120px !important;
            }
            .food-name {
              font-size: 0.95rem !important;
            }
            .food-price {
              font-size: 0.9rem !important;
            }
            .food-card-content {
              padding: 0.6rem !important;
            }
          }
        `}</style>
      </Head>
      
      {/* Header Section */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-2 sm:px-4 py-3 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Image src="/Frame 7.png" alt="Logo" className="h-10 w-auto mr-1" width={50} height={50} />
            <h1 className="text-lg font-bold text-gray-800">Tuang</h1>
          </div>
          
          {/* Search bar & Cart Icon */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="relative w-28 sm:w-48 md:w-64 lg:w-80 transition-all duration-300">
              <input
                type="text"
                placeholder="Cari menu"
                className="w-full border border-gray-300 rounded-full pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <i className="fas fa-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            </div>
            
            <div className="relative">
              <button 
                className="relative p-2 text-gray-700 hover:text-green-500 transition-colors" 
                onClick={toggleCartDrawer}
              >
                <i className="fas fa-shopping-cart text-xl"></i>
                {cart.length > 0 && (
                  <span className="cart-badge">{cart.reduce((a, c) => a + c.quantity, 0)}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-1 sm:px-4 py-4 sm:py-6">
        {/* Table Number Modal */}
        {manualModalVisible && (
          <div className="fixed inset-0 bg-green-400 bg-opacity-80 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md text-center">
              <h3 className="text-lg font-bold mb-4">Masukkan Nomor Meja</h3>
              
              <input
                type="text"
                placeholder="Nomor meja"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:border-green-500"
                value={tableNumber}
                onChange={e => setTableNumber(e.target.value)}
              />

              <button
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors"
                onClick={handleConfirmTable}
              >
                Konfirmasi
              </button>
            </div>
          </div>
        )}

        {currentTable && (
          <>
            {/* Filter Section */}
            <div className="flex flex-wrap gap-2 mb-6 items-center bg-white p-3 rounded-lg shadow-sm">
              <SellerDropdown
                sellerOptions={sellerOptions}
                selectedSeller={selectedSeller}
                setSelectedSeller={handleSetSelectedSeller}
              />
              <div className="flex flex-wrap gap-1 sm:gap-2">
                <button
                  key="all"
                  className={`category-btn px-4 py-1 rounded-full border ${selectedCategory === "all" ? "active bg-[#53B175] text-white border-[#53B175]" : "border-gray-300 hover:bg-gray-50"}`}
                  onClick={() => setSelectedCategory("all")}
                >
                  Semua Kategori
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`category-btn px-4 py-1 rounded-full border ${selectedCategory === cat ? "active bg-[#53B175] text-white border-[#53B175]" : "border-gray-200 hover:bg-gray-50"}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Menu Grid - Updated to show 2x2 grid on mobile */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {filteredItems.length === 0 ? (
                <p className="text-gray-500 col-span-2 sm:col-span-2 md:col-span-2 lg:col-span-3 text-center py-8 bg-white rounded-lg shadow-sm">Tidak ada menu.</p>
              ) : (
                filteredItems.map((item) => (
                  <div key={item.id} className="food-card bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 flex flex-col"
                    >
                      <div className="relative">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={400}
                          height={192}
                          className="w-full h-32 sm:h-40 object-cover food-img"
                        />
                        <div className="absolute bottom-0 right-0 bg-white px-2 py-1 m-2 rounded-md text-xs font-medium text-gray-600">
                          {item.category}
                        </div>
                      </div>
                    
                    <div className="p-3 flex flex-col flex-1 food-card-content">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg text-gray-800 food-name">{item.name}</h3>
                        <span className="text-green-500 font-bold food-price">{formatRupiah(item.price)}</span>
                      </div>
                      
                      <div className="text-sm text-gray-500 mb-3">
                        <i className="fas fa-store text-xs mr-1"></i>
                        {sellers.find(s => s.id === item.sellerId)?.nama}
                      </div>
                      
                      <button
                        className="add-to-cart w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium mt-auto transition-colors flex items-center justify-center gap-2"
                        onClick={() => handleAddToCart(item)}
                      >
                        <i className="fas fa-plus text-xs"></i>
                        <span className="sm:inline hidden">Tambah ke Keranjang</span>
                        <span className="inline sm:hidden">Tambah</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </main>

      {/* Note Modal */}
      {noteModalVisible && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white backdrop-blur-md rounded-lg p-6 w-full max-w-xs shadow-xl">
            <h4 className="font-bold mb-2">Pesan/Catatan untuk {selectedFoodForNote?.name}</h4>
            <textarea
              className="w-full border rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Contoh: Tanpa bawang, level 2, dsb (opsional)"
              rows={3}
              value={noteValue}
              onChange={e => setNoteValue(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-1 rounded bg-gray-200 hover:bg-gray-300 transition-colors"
                onClick={() => setNoteModalVisible(false)}
              >
                Batal
              </button>
              <button
                className="px-4 py-1 rounded bg-green-500 text-white hover:bg-green-600 transition-colors"
                onClick={handleSubmitNote}
              >
                Tambah
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      <div
        className={`drawer fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-lg z-20 overflow-y-auto ${cartDrawerOpen ? "open" : "closed"}`}
        style={{ display: cartDrawerOpen ? "block" : "none" }}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h3 className="text-xl font-bold text-gray-800">Pesanan Anda</h3>
            <button className="text-gray-500 hover:text-gray-700 p-1" onClick={toggleCartDrawer}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <div className="mb-4 overflow-y-auto" style={{ maxHeight: "calc(100vh - 200px)" }}>
            {cart.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <i className="fas fa-shopping-cart text-4xl mb-3 opacity-50"></i>
                <p>Keranjang kosong</p>
              </div>
            ) : (
              cart.map((item) => (
                <div 
                  key={item.id + (item.note ?? "")} 
                  className="cart-item flex justify-between items-center p-3 mb-3 rounded-lg border border-gray-100 bg-white shadow-sm"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{item.name}</h4>
                    <p className="text-gray-500 text-sm">{formatRupiah(item.price)} / porsi</p>
                    {item.note && <div className="text-xs text-gray-500 italic mt-1">Note: {item.note}</div>}
                    <div className="text-xs text-gray-400 mt-1">
                      <i className="fas fa-store mr-1"></i>
                      {sellers.find(s => s.id === item.sellerId)?.nama}
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="flex items-center border border-gray-200 rounded-md">
                      <button
                        className="decrease-quantity px-2 py-1 text-gray-500 hover:text-green-500 hover:bg-gray-50"
                        onClick={() => handleDecrease(item.id, item.note)}
                      >
                        <i className="fas fa-minus text-xs"></i>
                      </button>
                      <span className="mx-2 w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        className="increase-quantity px-2 py-1 text-gray-500 hover:text-green-500 hover:bg-gray-50"
                        onClick={() => handleIncrease(item.id, item.note)}
                      >
                        <i className="fas fa-plus text-xs"></i>
                      </button>
                    </div>
                    <button
                      className="remove-item ml-3 p-1 text-red-500 hover:text-red-700"
                      onClick={() => handleRemove(item.id, item.note)}
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="border-t border-gray-200 pt-4 mt-auto">
            <div className="flex justify-between text-lg font-bold mb-4">
              <span>Total:</span>
              <span className="text-green-600">{formatRupiah(subtotal)}</span>
            </div>
            <button
              className={`w-full py-3 rounded-lg mt-2 font-medium flex items-center justify-center gap-2 ${
                cart.length === 0 
                  ? "bg-gray-300 cursor-not-allowed text-gray-500" 
                  : "bg-green-500 hover:bg-green-600 text-white"
              }`}
              onClick={handleCheckout}
              disabled={cart.length === 0}
            >
              <i className="fas fa-shopping-bag"></i>
              Checkout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
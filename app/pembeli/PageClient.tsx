"use client";

import Head from "next/head";
import { sellers } from "./data";
import { useCart } from "./hooks/useCart";
import { useMenu } from "./hooks/useMenu";
import { useModals } from "./hooks/useModals";

// Components
import Header from "./components/Header";
import TableInputModal from "./components/TableInputModal";
import CategoryFilter from "./components/CategoryFilter";
import MenuSection from "./components/MenuSection";
import NoteModal from "./components/NoteModal";
import CartDrawer from "./components/CartDrawer";
import Styles from "./components/Styles";

export default function PageClient() {
  // Custom hooks
  const { 
    currentTable, 
    manualModalVisible, 
    tableNumber, 
    setTableNumber,
    handleConfirmTable 
  } = useModals();

  const {
    selectedCategory,
    selectedSeller,
    search,
    categories,
    filteredItems,
    setSelectedCategory,
    setSearch,
    handleSetSelectedSeller
  } = useMenu();

  const {
    cart,
    cartDrawerOpen,
    selectedFoodForNote,
    noteModalVisible,
    noteValue,
    subtotal,
    handleAddToCart,
    handleSubmitNote,
    handleIncrease,
    handleDecrease,
    handleRemove,
    toggleCartDrawer,
    handleCheckout,
    setNoteValue,
    setNoteModalVisible
  } = useCart(currentTable);

  // Ambil semua penjual unik
  const sellerOptions = [{ id: "all", nama: "Semua Toko" }, ...sellers];

  return (
    <>
      <Head>
        <title>Menu Makanan</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <Styles />
      </Head>
      
      {/* Header Section */}
      <Header 
        search={search}
        cart={cart}
        setSearch={setSearch}
        toggleCartDrawer={toggleCartDrawer}
      />

      <main className="container mx-auto px-1 sm:px-4 py-4 sm:py-6">
        {/* Table Number Modal */}
        {manualModalVisible && (
          <TableInputModal
            tableNumber={tableNumber}
            setTableNumber={setTableNumber}
            handleConfirmTable={handleConfirmTable}
          />
        )}

        {currentTable && (
          <>
            {/* Filter Section */}
            <CategoryFilter
              sellerOptions={sellerOptions}
              selectedSeller={selectedSeller}
              selectedCategory={selectedCategory}
              categories={categories}
              handleSetSelectedSeller={handleSetSelectedSeller}
              setSelectedCategory={setSelectedCategory}
            />
            
            {/* Menu Grid */}
            <MenuSection 
              filteredItems={filteredItems} 
              handleAddToCart={handleAddToCart} 
            />
          </>
        )}
      </main>

      {/* Note Modal */}
      {noteModalVisible && (
        <NoteModal
          selectedFoodForNote={selectedFoodForNote}
          noteValue={noteValue}
          setNoteValue={setNoteValue}
          setNoteModalVisible={setNoteModalVisible}
          handleSubmitNote={handleSubmitNote}
        />
      )}

      {/* Cart Drawer */}
      <CartDrawer
        cartDrawerOpen={cartDrawerOpen}
        cart={cart}
        subtotal={subtotal}
        toggleCartDrawer={toggleCartDrawer}
        handleIncrease={handleIncrease}
        handleDecrease={handleDecrease}
        handleRemove={handleRemove}
        handleCheckout={handleCheckout}
      />
    </>
  );
}
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CartItem, FoodItem } from "../types";

export const useCart = (currentTable: string | null) => {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [selectedFoodForNote, setSelectedFoodForNote] = useState<FoodItem | null>(null);
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [noteValue, setNoteValue] = useState("");

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

  const handleCheckout = () => {
    if (cart.length === 0) return;
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("tableNumber", currentTable || "");
    router.push("/pembeli/checkout");
  };

  const subtotal = cart.reduce((t, i) => t + i.price * i.quantity, 0);

  return {
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
  };
};
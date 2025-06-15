import { CartItem } from "../types";
import { sellers, formatRupiah } from "../data";

type CartDrawerProps = {
  cartDrawerOpen: boolean;
  cart: CartItem[];
  subtotal: number;
  toggleCartDrawer: () => void;
  handleIncrease: (id: number, note?: string) => void;
  handleDecrease: (id: number, note?: string) => void;
  handleRemove: (id: number, note?: string) => void;
  handleCheckout: () => void;
};

export default function CartDrawer({
  cartDrawerOpen,
  cart,
  subtotal,
  toggleCartDrawer,
  handleIncrease,
  handleDecrease,
  handleRemove,
  handleCheckout
}: CartDrawerProps) {
  return (
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
  );
}
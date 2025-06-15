type TableInputModalProps = {
  tableNumber: string;
  setTableNumber: (value: string) => void;
  handleConfirmTable: () => void;
};

export default function TableInputModal({ 
  tableNumber, 
  setTableNumber, 
  handleConfirmTable 
}: TableInputModalProps) {
  return (
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
  );
}
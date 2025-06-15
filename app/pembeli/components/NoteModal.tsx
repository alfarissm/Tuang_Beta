import { FoodItem } from "../types";

type NoteModalProps = {
  selectedFoodForNote: FoodItem | null;
  noteValue: string;
  setNoteValue: (value: string) => void;
  setNoteModalVisible: (visible: boolean) => void;
  handleSubmitNote: () => void;
};

export default function NoteModal({
  selectedFoodForNote,
  noteValue,
  setNoteValue,
  setNoteModalVisible,
  handleSubmitNote
}: NoteModalProps) {
  return (
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
  );
}
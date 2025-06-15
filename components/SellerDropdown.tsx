import { useState, useRef, useEffect } from "react";

type SellerOption = { id: string | number; nama: string };

interface SellerDropdownProps {
  sellerOptions: SellerOption[];
  selectedSeller: string | number;
  setSelectedSeller: (id: string | number) => void;
}

export default function SellerDropdown({
  sellerOptions,
  selectedSeller,
  setSelectedSeller,
}: SellerDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        className={`flex items-center justify-between gap-2 w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-400 focus:border-green-400 transition text-base font-medium`}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          <i className="fas fa-store text-green-500"></i>
          {sellerOptions.find((s) => s.id === selectedSeller)?.nama}
        </span>
        <i
          className={`fas fa-chevron-down text-xs transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        ></i>
      </button>
      {open && (
        <div className="absolute left-0 w-full mt-1 z-30 bg-white border border-gray-200 rounded-lg shadow-lg animate-fadein max-h-60 overflow-auto">
          {sellerOptions.map((s) => (
            <button
              key={s.id}
              className={`flex items-center w-full px-4 py-2 text-left text-base ${
                selectedSeller === s.id
                  ? "bg-green-50 text-green-700 font-semibold"
                  : "hover:bg-green-100"
              }`}
              onClick={() => {
                setSelectedSeller(s.id);
                setOpen(false);
              }}
              type="button"
              aria-pressed={selectedSeller === s.id}
              tabIndex={0}
            >
              {s.nama}
              {selectedSeller === s.id && (
                <i className="fas fa-check text-green-500 ml-auto"></i>
              )}
            </button>
          ))}
        </div>
      )}
      <style jsx>{`
        .animate-fadein {
          animation: fadeIn 0.13s;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        @media (max-width: 520px) {
          button, .animate-fadein {
            font-size: 0.97rem;
          }
        }
      `}</style>
    </div>
  );
}
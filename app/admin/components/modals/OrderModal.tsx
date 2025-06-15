import React from 'react';
import { OrderModalProps } from '@/app/admin/types/index';
import { formatRupiah } from '@/app/admin/utils/formatting';

export const OrderModal: React.FC<OrderModalProps> = ({ data, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded p-6 w-full max-w-md">
        <div className="font-bold text-lg mb-2">Detail Pesanan</div>
        <div className="mb-2 text-sm">NIP/NIM: <b>{data.id}</b></div>
        <div className="mb-2 text-sm">Meja: <b>{data.table}</b></div>
        <div className="mb-2 text-sm">Status: <b>{data.status}</b></div>
        <div className="mb-2 text-sm">Dibuat: {new Date(data.createdAt).toLocaleString()}</div>
        {data.updatedAt && <div className="mb-2 text-sm">Update: {new Date(data.updatedAt).toLocaleString()} oleh {data.updatedBy}</div>}
        <div className="font-semibold mt-4 mb-2">Item:</div>
        <ul className="mb-2">
          {data.items.map((i, idx) => (
            <li key={idx} className="mb-1">
              {i.name} <b>x{i.qty}</b> ({formatRupiah(i.price)}) {i.note && <span className="text-xs text-yellow-800">Note: {i.note}</span>}
            </li>
          ))}
        </ul>
        <div className="font-bold mt-4">Total: {formatRupiah(data.items.reduce((t, i) => t + i.price * i.qty, 0))}</div>
        <div className="flex justify-end gap-2 pt-4">
          <button className="px-4 py-1 rounded bg-gray-200" onClick={onClose}>Tutup</button>
        </div>
      </div>
    </div>
  );
};
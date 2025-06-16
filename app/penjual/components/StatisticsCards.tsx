import { formatRupiah } from "../utils/formatters";

type StatisticsCardsProps = {
  totalOrder: number;
  totalCompleted: number;
  totalIncome: number;
};

export default function StatisticsCards({ 
  totalOrder, 
  totalCompleted, 
  totalIncome 
}: StatisticsCardsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
      <div className="bg-white p-3 rounded-lg shadow">
        <div className="text-xs sm:text-sm text-gray-500">Total Pesanan</div>
        <div className="text-lg sm:text-xl font-bold mt-1">{totalOrder}</div>
        <div className="text-xs text-green-600 mt-1">
          {totalCompleted} selesai
        </div>
      </div>
      
      <div className="bg-white p-3 rounded-lg shadow">
        <div className="text-xs sm:text-sm text-gray-500">Total Pendapatan</div>
        <div className="text-lg sm:text-xl font-bold mt-1">
          {formatRupiah(totalIncome)}
        </div>
        <div className="text-xs text-gray-400 mt-1">
          Bulan ini
        </div>
      </div>

      <div className="bg-white p-3 rounded-lg shadow col-span-2 sm:col-span-1">
        <div className="text-xs sm:text-sm text-gray-500">Rata-rata/Pesanan</div>
        <div className="text-lg sm:text-xl font-bold mt-1">
          {totalOrder > 0 ? formatRupiah(totalIncome/totalOrder) : formatRupiah(0)}
        </div>
        <div className="text-xs text-gray-400 mt-1">
          Bulan ini
        </div>
      </div>
    </div>
  );
}
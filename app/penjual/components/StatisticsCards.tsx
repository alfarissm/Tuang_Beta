import { IconClipboard, IconCheckCircle, IconMoney } from "../utils/icons";
import { formatRupiah } from "../utils/formatters";

type StatisticsCardsProps = {
  totalOrder: number;
  totalCompleted: number;
  totalIncome: number;
};

export default function StatisticsCards({ totalOrder, totalCompleted, totalIncome }: StatisticsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4">
        <div className="bg-blue-100 rounded-full p-3">
          <IconClipboard />
        </div>
        <div>
          <div className="text-gray-500 text-sm">Total Pesanan</div>
          <div className="text-2xl font-bold">{totalOrder}</div>
        </div>
      </div>
      <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4">
        <div className="bg-green-100 rounded-full p-3">
          <IconCheckCircle />
        </div>
        <div>
          <div className="text-gray-500 text-sm">Pesanan Selesai</div>
          <div className="text-2xl font-bold">{totalCompleted}</div>
        </div>
      </div>
      <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4">
        <div className="bg-yellow-100 rounded-full p-3">
          <IconMoney />
        </div>
        <div>
          <div className="text-gray-500 text-sm">Pendapatan</div>
          <div className="text-2xl font-bold">{formatRupiah(totalIncome)}</div>
        </div>
      </div>
    </div>
  );
}
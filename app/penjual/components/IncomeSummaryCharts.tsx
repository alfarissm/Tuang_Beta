import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot
} from "recharts";
import { formatRupiah } from "../utils/formatters";

// Define types for component props
interface DateLabel {
  day: number | string;
  month: string;
}

interface IncomeSummaryChartProps {
  dailyIncome: number[];
  dateLabels: DateLabel[];
  maxIncome: number;
  totalWeekIncome: number;
  weekGrowth: number;
}

// Define chart data type
interface ChartData {
  income: number;
  date: number | string;
  month: string;
  fullLabel: string;
  index: number; // Add index for proper XAxis placement
}

export default function IncomeSummaryChart({ 
  dailyIncome, 
  dateLabels, 
  maxIncome,
  totalWeekIncome,
  weekGrowth
}: IncomeSummaryChartProps): React.ReactElement {
  
  // Prepare data for Recharts with typed array and index
  const data: ChartData[] = dailyIncome.map((income, index) => ({
    income,
    date: dateLabels[index].day,
    month: dateLabels[index].month,
    fullLabel: `${dateLabels[index].day} ${dateLabels[index].month}`,
    index // Add the index to ensure proper spacing
  }));

  return (
    <div className="bg-white p-3 rounded-lg shadow col-span-2">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
          </svg>
          <div className="text-gray-700 font-medium text-sm">
            Pendapatan Minggu Ini
          </div>
        </div>
        <div className="flex items-center">
          <div className="font-bold text-sm mr-2">{formatRupiah(totalWeekIncome)}</div>
          {weekGrowth !== 0 && (
            <span className={`text-xs px-1.5 py-0.5 rounded-full flex items-center ${weekGrowth >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              <span className={`mr-0.5 ${weekGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {weekGrowth >= 0 ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                    <path fillRule="evenodd" d="M10 17a.75.75 0 0 1-.75-.75V5.612L5.29 9.77a.75.75 0 0 1-1.08-1.04l5.25-5.5a.75.75 0 0 1 1.08 0l5.25 5.5a.75.75 0 1 1-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0 1 10 17z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                    <path fillRule="evenodd" d="M10 3a.75.75 0 0 1 .75.75v10.638l3.96-4.158a.75.75 0 1 1 1.08 1.04l-5.25 5.5a.75.75 0 0 1-1.08 0l-5.25-5.5a.75.75 0 1 1 1.08-1.04l3.96 4.158V3.75A.75.75 0 0 1 10 3z" clipRule="evenodd" />
                  </svg>
                )}
              </span>
              {Math.abs(weekGrowth).toFixed(1)}%
            </span>
          )}
        </div>
      </div>
      
      {/* Chart Area with Recharts */}
      <div className="h-[150px] w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 5,
              right: 0,
              left: 10,
              bottom: 25, // Increased bottom margin to make room for date labels
            }}
          >
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#4ade80" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            
            {/* Custom XAxis that displays the dates evenly spaced */}
            <XAxis
              dataKey="index"
              type="number"
              domain={[0, data.length - 1]}
              tickCount={7}
              tickFormatter={(value: number) => {
                // This ensures we only show actual data points
                const idx = Math.round(value);
                if (idx < 0 || idx >= data.length) return '';
                return '';  // Return empty string as we'll use custom ticks
              }}
              axisLine={false}
              tickLine={false}
              padding={{ left: 0, right: 0 }}
              height={40}
            />
            
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={(props) => {
                const { x, y, payload } = props;
                return (
                  <g transform={`translate(${x},${y})`}>
                    <text 
                      x={0} 
                      y={0} 
                      textAnchor="end" 
                      fill="#9CA3AF" 
                      fontSize={9}
                    >
                      {Math.round(payload.value / 1000)}K
                    </text>
                  </g>
                );
              }}
              width={30}
              domain={[0, maxIncome * 1.1]}
            />
            
            <Tooltip 
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                padding: '8px 12px',
                fontSize: '12px',
              }}
              formatter={(value: number) => [formatRupiah(value), 'Pendapatan']}
              labelFormatter={(idx: number) => {
                const dataPoint = data[idx];
                if (!dataPoint) return '';
                return `Tanggal: ${dataPoint.date} ${dataPoint.month}`;
              }}
            />
            
            <Area 
              type="monotone" 
              dataKey="income" 
              stroke="#4ade80" 
              strokeWidth={2} 
              fill="url(#incomeGradient)" 
              activeDot={{ 
                r: 6, 
                fill: "#4ade80", 
                stroke: "#fff",
                strokeWidth: 2
              }} 
            />
            
            {/* Render dots for each data point */}
            {data.map((entry, index) => (
              <ReferenceDot
                key={index}
                x={entry.index}
                y={entry.income}
                r={4}
                fill="#4ade80"
                stroke="#fff"
                strokeWidth={1.5}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Custom date labels with consistent spacing */}
      <div className="flex justify-between px-10 mt-1">
        {dateLabels.map((label, idx) => (
          <div key={idx} className="flex flex-col items-center" style={{ width: '14%' }}>
            <div className="text-[10px] text-gray-600 font-medium">
              {label.day}
            </div>
            <div className="text-[8px] text-gray-400">
              {label.month}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
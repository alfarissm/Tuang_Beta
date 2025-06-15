import React from 'react';
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Order } from '../../types';
import { formatRupiah } from '../../utils/formatting';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface WeeklyFinanceChartProps {
  orders: Order[];
}

interface WeekData {
  total: number;
  label: string;
}

interface WeeklyRevenueData {
  weeks: string[];
  revenue: number[];
}


export const WeeklyFinanceChart: React.FC<WeeklyFinanceChartProps> = ({ orders }) => {
  // Helper function to get week number
  const getWeekNumber = (d: Date): number => {
    try {
      // Copy date to avoid modifying the original
      const date = new Date(d.getTime());
      // Set to nearest Thursday: current date + 4 - current day number
      date.setDate(date.getDate() + 4 - (date.getDay() || 7));
      // Get first day of the year
      const yearStart = new Date(date.getFullYear(), 0, 1);
      // Calculate week number: Math.ceil(((date - yearStart) / 86400000 + 1) / 7)
      return Math.ceil(
        ((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
      );
    } catch (e) {
      console.error("Error calculating week number:", e);
      return 0;
    }
  };

  // Helper to get week dates range
  const getWeekDateRange = (weekNum: number, year: number): string => {
    try {
      // Simple implementation - could be more accurate
      const firstWeekDay = new Date(year, 0, 1 + (weekNum - 1) * 7);
      const lastWeekDay = new Date(year, 0, 1 + (weekNum - 1) * 7 + 6);
      
      // Format dates
      const firstDay = `${firstWeekDay.getDate()}/${firstWeekDay.getMonth() + 1}`;
      const lastDay = `${lastWeekDay.getDate()}/${lastWeekDay.getMonth() + 1}`;
      
      return `${firstDay} - ${lastDay}`;
    } catch (e) {
      console.error("Error calculating week date range:", e);
      return "Invalid date";
    }
  };

  // Calculate weekly revenue
  const calculateWeeklyRevenue = (): WeeklyRevenueData => {
    try {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      
      // Initialize data for the last 5 weeks
      const currentWeekNumber = getWeekNumber(currentDate);
      const weeklyData: Record<number, WeekData> = {};
      
      // Create entries for the last 5 weeks
      for (let i = 0; i < 5; i++) {
        const weekNum = currentWeekNumber - i;
        if (weekNum > 0) { // Ensure we don't go into negative week numbers
          weeklyData[weekNum] = { 
            total: 0, 
            label: getWeekDateRange(weekNum, currentYear)
          };
        }
      }
      
      // Calculate revenue for each order
      orders.forEach(order => {
        if (order.status === "selesai") {
          try {
            const orderDate = new Date(order.createdAt);
            const orderYear = orderDate.getFullYear();
            
            // Only include orders from the current year
            if (orderYear === currentYear) {
              const weekNum = getWeekNumber(orderDate);
              
              // If this order falls within our tracked weeks
              if (weeklyData[weekNum]) {
                const orderTotal = order.items.reduce(
                  (sum, item) => sum + ((item.price || 0) * (item.qty || 0)), 0
                );
                weeklyData[weekNum].total += orderTotal;
              }
            }
          } catch (e) {
            console.error("Error processing order for weekly revenue:", e);
          }
        }
      });
      
      // Convert to arrays for Chart.js
      const weeks: string[] = [];
      const revenue: number[] = [];
      
      // Sort by week number (ascending)
      Object.keys(weeklyData)
        .map(Number)
        .sort((a, b) => a - b)
        .forEach(week => {
          weeks.push(`Minggu ${week} (${weeklyData[week].label})`);
          revenue.push(weeklyData[week].total);
        });
      
      return { weeks, revenue };
    } catch (e) {
      console.error("Error calculating weekly revenue:", e);
      return { weeks: [], revenue: [] };
    }
  };
  
  const { weeks, revenue } = calculateWeeklyRevenue();
  
  const chartData: ChartData<'line'> = {
    labels: weeks,
    datasets: [
      {
        label: 'Pendapatan Mingguan',
        data: revenue,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        tension: 0.3,
      },
    ],
  };
  
  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Pendapatan Mingguan',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Pendapatan: ${formatRupiah(context.raw as number)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return formatRupiah(value as number);
          }
        }
      }
    }
  };
  
  return (
    <div className="bg-white p-4 rounded shadow mb-8">
      <h2 className="text-lg font-semibold mb-4">Trend Keuangan Mingguan</h2>
      <div style={{ height: '300px' }}>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};
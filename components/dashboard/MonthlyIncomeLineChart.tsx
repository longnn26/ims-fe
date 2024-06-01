import React from "react";
import { Chart } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
} from "chart.js";
import { Income } from "@models/statistics";

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController
);

interface Props {
  dataProfit: Income;
  dataRevenue: Income;
  selectedYear: number;
}

const MonthlyIncomeLineChart: React.FC<Props> = ({
  dataProfit,
  dataRevenue,
  selectedYear,
}) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth(); 
  
  const labels = [
    "T1",
    "T2",
    "T3",
    "T4",
    "T5",
    "T6",
    "T7",
    "T8",
    "T9",
    "T10",
    "T11",
    "T12",
  ];

  const displayLabels = selectedYear === currentYear ? labels.slice(0, currentMonth + 1) : labels;
  const displayProfitData = selectedYear === currentYear ? dataProfit?.monthlyIncome?.slice(0, currentMonth + 1) : dataProfit?.monthlyIncome;
  const displayRevenueData = selectedYear === currentYear ? dataRevenue?.monthlyIncome?.slice(0, currentMonth + 1) : dataRevenue?.monthlyIncome;

  const data = {
    labels: displayLabels,
    datasets: [
      {
        label: "Lợi nhuận từng tháng",
        data: displayProfitData,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        label: "Doanh thu từng tháng",
        data: displayRevenueData,
        fill: false,
        borderColor: "rgba(255, 99, 132, 0.6)",
        tension: 0.1,
      },
    ],
  };

  return <Chart type="line" data={data} />;
};

export default MonthlyIncomeLineChart;

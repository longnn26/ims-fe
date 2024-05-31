import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  dataAccount: number[];
}

const AccountPieChart: React.FC<Props> = ({ dataAccount }) => {
  const backgroundColors = ["#bfdbfe", "#ddd6fe", "rgb(153 246 228)"];

  const data = {
    labels: ["Khách hàng", "Tài xế", "Nhân viên"],
    datasets: [
      {
        label: "Số lượng",
        data: dataAccount,
        backgroundColor: backgroundColors,
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div className="w-80 h-80">
      <Doughnut data={data} />
    </div>
  );
};

export default AccountPieChart;

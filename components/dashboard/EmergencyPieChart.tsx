import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  dataEmergency: number[];
}

const EmergencyPieChart: React.FC<Props> = ({ dataEmergency }) => {
  const backgroundColors = ["rgb(254 215 170)", "#ddd6fe", "#bbf7d0"];

  const data = {
    labels: ["Đang chờ", "Đang xử lý", "Đã giải quyết"],
    datasets: [
      {
        label: "Số lượng",
        data: dataEmergency,
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

export default EmergencyPieChart;

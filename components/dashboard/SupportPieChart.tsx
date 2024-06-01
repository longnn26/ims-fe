import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  dataSupport: number[];
}

const SupportPieChart: React.FC<Props> = ({ dataSupport }) => {
  const backgroundColors = ["#fef08a", "#ddd6fe", "#bbf7d0", "#fecaca"];

  const data = {
    labels: ["Mới", "Đang xử lý", "Đã giải quyết", "Không thể giải quyết"],
    datasets: [
      {
        label: "Số lượng",
        data: dataSupport,
        backgroundColor: backgroundColors,
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div className="">
      <Doughnut data={data} />
    </div>
  );
};

export default SupportPieChart;

import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  dataTrip: number[];
}

const TripPieChart: React.FC<Props> = ({ dataTrip }) => {
  const backgroundColors = ["#fecaca", "#bbf7d0", "#e5e7eb"];

  const data = {
    labels: ["Hủy chuyến", "Hoàn thành", "Trạng thái khác"],
    datasets: [
      {
        label: "Tỉ lệ",
        data: dataTrip,
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

export default TripPieChart;

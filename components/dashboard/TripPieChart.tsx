import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  dataTrip: number[];
}

const TripPieChart: React.FC<Props> = ({ dataTrip }) => {
  const backgroundColors = ["#bbf7d0", "#fecaca", "#e5e7eb"];

  const data = {
    labels: ["Hoàn thành", "Huỷ chuyến", "Khác"],
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
    <div className="w-80 h-80">
      <Doughnut data={data} />
    </div>
  );
};

export default TripPieChart;

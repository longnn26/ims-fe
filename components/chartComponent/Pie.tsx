import { Tag } from "antd";
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";

interface Data {
  name: string;
  value: number;
  color: string;
}

interface Props {
  data: Data[];
  //   colors: string[];
}
const PieChartComponent: React.FC<Props> = (props) => {
  const { data } = props;
  const RADIAN = Math.PI / 180;

  // Bước 1: Tính tổng tỷ lệ
  const totalPercent = data.reduce((sum, rec) => sum + rec.value, 0);

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // Sử dụng hàm render riêng biệt
    const renderLabel = () => {
      if (percent !== 0) {
        return (
          <text
            x={x}
            y={y}
            fill="black"
            textAnchor={x > cx ? "start" : "end"}
            dominantBaseline="central"
          >
            {`${(percent * 100).toFixed(0)}%`}
          </text>
        );
      } else {
        return null; // Trả về null nếu percent là 0
      }
    };

    return renderLabel();
  };

  return (
    <>
      <div className="mt-10">
        {/* Bước 2: Kiểm tra và ẩn Tag nếu percent là 0 */}
        {data.map(
          (rec, index) =>
            rec.value !== 0 && (
              <Tag key={index} color={rec.color}>
                <span style={{ color: "black" }}>{rec.name}</span>
              </Tag>
            )
        )}
      </div>
      <PieChart width={400} height={400}>
        <Pie
          data={data}
          cx={200}
          cy={200}
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map(
            (entry, index) =>
              // Bước 2: Kiểm tra và ẩn Cell nếu percent là 0
              entry.value !== 0 && (
                <Cell key={`cell-${index}`} fill={data[index].color} />
              )
          )}
        </Pie>
      </PieChart>
    </>
  );
};

export default PieChartComponent;

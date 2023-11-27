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
  };
  return (
    <>
      <div className="mt-10">
        {data.map((rec, index) => {
          return (
            <Tag key={index} color={rec.color}>
              <span style={{ color: "black" }}>{rec.name}</span>
            </Tag>
          );
        })}
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
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={data[index].color} />
          ))}
        </Pie>
      </PieChart>
    </>
  );
};

export default PieChartComponent;

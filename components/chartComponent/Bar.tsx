import { Statistic, StatisticData } from "@models/statistic";
import { Tag } from "antd";
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { BarChart, Bar, Tooltip, Legend, XAxis, YAxis, CartesianGrid } from "recharts";

interface Props {
  barData: any;
}
const BarChartComponent: React.FC<Props> = (props) => {
  const { barData } = props;

  return (
    <>
      <BarChart width={420} height={450} data={barData} layout="vertical" barSize={4}>
        <CartesianGrid strokeDasharray="3" vertical={false} />
        <XAxis type="number" />
        <YAxis dataKey="name" type="category" width={100}/>
        <Tooltip />
        <Legend />
        <Bar dataKey="waiting" fill="#19bcf1" />
        <Bar dataKey="accepted" fill="#14a2b8" />
        <Bar dataKey="success" fill="#28a745" />
        <Bar dataKey="denied" fill="#ed1c24" />
        <Bar dataKey="failed" fill="#343a3f" />
        <Bar dataKey="resolved" fill="green" />
        <Bar dataKey="unresolved" fill="red" />
      </BarChart>
    </>
  );
};

export default BarChartComponent;

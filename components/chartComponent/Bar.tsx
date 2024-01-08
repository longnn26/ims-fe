import { Statistic, StatisticData } from "@models/statistic";
import { Tag } from "antd";
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { BarChart, Bar, Tooltip, Legend, XAxis, YAxis, CartesianGrid } from "recharts";

interface Props {
  data: any;
}
const BarChartComponent: React.FC<Props> = (props) => {
  const { data } = props;

  return (
    <>
      <BarChart width={1000} height={500} data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3" vertical={false} />
        <XAxis type="number"/>
        <YAxis width={130} dataKey="name" type="category" />
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

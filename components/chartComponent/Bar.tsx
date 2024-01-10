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
  const [finalData, setFinalData] = useState<any>(() => {
    const month = barData[0].month;
    const year = barData[0].year;
    const data = Object.keys(barData[0]).map(key => {
      if (typeof barData[0][key] === 'object') {
        return {
          name: key === "requestHosts" ? "IP Requests" :
            (key === "requestUpgrades" ? "Hardware Change Requests" :
                (key === "requestExpands" ? "Add Server Requests" : key.charAt(0).toUpperCase() + key.slice(1))),
          ...barData[0][key]
        };
      }
      return null;
    }).filter(entry => entry !== null);
  
    return { month, year, data };
  });

  console.log(finalData)

  return (
    <>
      <BarChart width={1000} height={500} data={finalData.data}>
        <CartesianGrid strokeDasharray="3" vertical={false} />
        <XAxis dataKey="name"/>
        <YAxis />
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

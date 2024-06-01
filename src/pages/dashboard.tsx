"use client";
import dynamic from "next/dynamic";
import React, { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import statisticsService from "@services/statistics";

import { Modal } from "antd";
import { Statistic } from "@models/statistics";
import { BiSupport, BiTrip } from "react-icons/bi";
import { RiAlarmWarningLine } from "react-icons/ri";
import AccountPieChart from "@components/dashboard/AccountPieChart";
import TripPieChart from "@components/dashboard/TripPieChart";
import SupportPieChart from "@components/dashboard/SupportPieChart";
import EmergencyPieChart from "@components/dashboard/EmergencyPieChart";
import MonthlyIncomeLineChart from "@components/dashboard/MonthlyIncomeLineChart";
import { Select } from "antd";

const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});

interface YearOption {
  value: number;
  label: string;
}

const Dashboard: React.FC = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const [dataStatistics, setDataStatistics] = useState<any>();
  const [dataProfitMonthlyIncome, setDataProfitMonthlyIncome] = useState<any>();
  const [dataRevenueMonthlyIncome, setDataRevenueMonthlyIncome] =
    useState<any>();

  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [dataYear, setDataYear] = useState<YearOption[]>([]);

  // mặc định sẽ là bắt đầu từ 2024
  // xét thời gian hiện hành thì sẽ thêm năm tương ứng
  const generateDataYear = useCallback(() => {
    const currentYear = new Date().getFullYear();
    // sửa lại thành 2024 sau
    const startYear = 2023;
    const years: YearOption[] = [];
    for (let year = startYear; year <= currentYear; year++) {
      years.push({ value: year, label: year.toString() });
    }
    setDataYear(years);
  }, []);

  const getAllStatisticsData = async () => {
    setLoading(true);
    await statisticsService
      .getOverviewStatistics(session?.user.access_token!)
      .then((res: Statistic) => {
        setDataStatistics(res);
      })
      .catch((errors) => {
        console.log("errors get statistic", errors);
      })
      .finally(() => {
        setLoading(false);
      });

    await statisticsService
      .getAdminProfitMonthlyIncome(session?.user.access_token!, selectedYear)
      .then((res: Statistic) => {
        setDataProfitMonthlyIncome(res);
      })
      .catch((errors) => {
        console.log("errors get profit monthly income", errors);
      })
      .finally(() => {
        setLoading(false);
      });

    await statisticsService
      .getAdminRevenueMonthlyIncome(session?.user.access_token!, selectedYear)
      .then((res: Statistic) => {
        setDataRevenueMonthlyIncome(res);
      })
      .catch((errors) => {
        console.log("errors get revenue monthly income", errors);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleYearChange = (value: number) => {
    setSelectedYear(value);
  };

  useEffect(() => {
    generateDataYear();
  }, [generateDataYear]);

  useEffect(() => {
    session && getAllStatisticsData();
  }, [session, selectedYear]);

  return (
    <AntdLayoutNoSSR
      content={
        <>
          <div className="h-full mt-5 mb-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 p-4 gap-4">
              <div className="bg-blue-500 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600  text-white font-medium group">
                <div className="flex justify-center items-center w-14 h-14 bg-white rounded-full transition-all duration-300 transform group-hover:rotate-12">
                  <svg
                    width="30"
                    height="30"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="stroke-current text-blue-800 transform transition-transform duration-500 ease-in-out"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    ></path>
                  </svg>
                </div>
                <div className="text-right">
                  <p className="text-2xl">{dataStatistics?.totalAccounts}</p>
                  <p>Tài khoản</p>
                </div>
              </div>
              <div className="bg-blue-500 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 text-white font-medium group">
                <div className="flex justify-center items-center w-14 h-14 bg-white rounded-full transition-all duration-300 transform group-hover:rotate-12">
                  <BiTrip className="text-blue-800 h-7 w-7" />
                </div>
                <div className="text-right">
                  <p className="text-2xl">{dataStatistics?.totalTrips}</p>
                  <p>Chuyến đi</p>
                </div>
              </div>
              <div className="bg-blue-500 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 text-white font-medium group">
                <div className="flex justify-center items-center w-14 h-14 bg-white rounded-full transition-all duration-300 transform group-hover:rotate-12">
                  <BiSupport className="text-blue-800 h-7 w-7" />
                </div>
                <div className="text-right">
                  <p className="text-2xl">
                    {dataStatistics?.totalSupportRequests}
                  </p>
                  <p>Hỗ trợ</p>
                </div>
              </div>
              <div className="bg-blue-500 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600  text-white font-medium group">
                <div className="flex justify-center items-center w-14 h-14 bg-white rounded-full transition-all duration-300 transform group-hover:rotate-12">
                  <RiAlarmWarningLine className="text-blue-800 h-7 w-7" />
                </div>
                <div className="text-right">
                  <p className="text-2xl">
                    {dataStatistics?.totalEmergencyRequests}
                  </p>
                  <p>Khẩn cấp</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 p-4 gap-4">
              <AccountPieChart
                dataAccount={dataStatistics?.accountDetails ?? []}
              />
              <TripPieChart dataTrip={dataStatistics?.tripStatistics ?? []} />
              <SupportPieChart
                dataSupport={dataStatistics?.supportStatusDetails ?? []}
              />

              <EmergencyPieChart
                dataEmergency={dataStatistics?.emergencyStatusDetails ?? []}
              />
            </div>

            {/* chart line */}
            <div className="w-10/12 m-auto mt-5">
              <div>
                <Select
                  placeholder="Chọn năm"
                  className="select_option"
                  options={dataYear}
                  defaultValue={selectedYear}
                  onChange={handleYearChange}
                />
              </div>
              <MonthlyIncomeLineChart
                dataProfit={dataProfitMonthlyIncome ?? []}
                dataRevenue={dataRevenueMonthlyIncome ?? []}
                selectedYear={selectedYear}
              />
              <h6 className="text-center mt-5">
                Biểu đồ thể hiện doanh thu và lợi nhuận trong năm {selectedYear}
              </h6>
            </div>
          </div>
        </>
      }
    />
  );
};

export default Dashboard;

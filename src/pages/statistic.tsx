"use client";
import BarChartComponent from "@components/chartComponent/Bar";
import { StatisticParamGet, Statistic } from "@models/statistic";
import statisticService from "@services/statistic";
import { ROLE_SALES, ROLE_TECH, dateAdvFormat } from "@utils/constants";
import { areInArray, convertDatePicker } from "@utils/helpers";
import { Avatar, Button, Select } from "antd";
import { ItemType } from "antd/es/breadcrumb/Breadcrumb";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const { Option } = Select;
const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
    ssr: false,
});

const StatisticPage: React.FC = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const [barData, setBarData] = useState<any>();
    const [barDataMonth1, setBarDataMonth1] = useState<any>();
    const [barDataMonth2, setBarDataMonth2] = useState<any>();
    const [barDataMonth3, setBarDataMonth3] = useState<any>();
    const [start1, setStart1] = useState<string>();
    const [end1, setEnd1] = useState<string>();
    const [month1, setMonth1] = useState<string>();
    const [start2, setStart2] = useState<string>();
    const [end2, setEnd2] = useState<string>();
    const [month2, setMonth2] = useState<string>();
    const [start3, setStart3] = useState<string>();
    const [end3, setEnd3] = useState<string>();
    const [month3, setMonth3] = useState<string>("");
    const [selectedYear, setSeletedYear] = useState<number>();

    const getStatisticOfMonth = async (startMonth: string, endMonth: string) => {
        let result: any;
        await statisticService
            .getData(
                session?.user.access_token!,
                {
                    StartDate: startMonth,
                    EndDate: endMonth
                } as unknown as StatisticParamGet)
            .then((res) => {
                result = Object.keys(res).map((val) => ({
                    name: val === "requestHosts" ? "IP Requests" :
                        (val === "requestUpgrades" ? "Hardware Change Requests" :
                            (val === "requestExpands" ? "Add Server Requests" : val.charAt(0).toUpperCase() + val.slice(1))),
                    waiting: res[val].waiting,
                    accepted: res[val].accepted,
                    success: res[val].success,
                    denied: res[val].denied,
                    failed: res[val].failed,
                    resolved: res[val].resolved,
                    unresolved: res[val].unresolved,
                }))
            });
        return result;
    }

    const isLeapYear = (year) => {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    };

    const handleChange = (value: number) => {
        var startDate1, startDate2, startDate3, endDate1, endDate2, endDate3;

        switch (value) {
            case 1:
                startDate1 = dayjs(`${selectedYear}/01/01`).format(dateAdvFormat);
                startDate2 = dayjs(`${selectedYear}/02/01`).format(dateAdvFormat);
                startDate3 = dayjs(`${selectedYear}/03/01`).format(dateAdvFormat);
                endDate1 = dayjs(`${selectedYear}/01/31`).endOf('day').format(dateAdvFormat);
                endDate2 = isLeapYear(selectedYear) ? dayjs(`${selectedYear}/02/29`).endOf('day').format(dateAdvFormat) : dayjs(`${selectedYear}/02/28`).endOf('day').format(dateAdvFormat);
                endDate3 = dayjs(`${selectedYear}/03/31`).endOf('day').format(dateAdvFormat);
                setStart1(startDate1);
                setStart2(startDate2);
                setStart3(startDate3);
                setEnd1(endDate1);
                setEnd2(endDate2);
                setEnd3(endDate3);
                setMonth1("January");
                setMonth2("February");
                setMonth3("March");
                break;
            case 2:
                startDate1 = dayjs(`${selectedYear}/04/01`).format(dateAdvFormat);
                startDate2 = dayjs(`${selectedYear}/05/01`).format(dateAdvFormat);
                startDate3 = dayjs(`${selectedYear}/06/01`).format(dateAdvFormat);
                endDate1 = dayjs(`${selectedYear}/04/30`).endOf('day').format(dateAdvFormat);
                endDate2 = dayjs(`${selectedYear}/05/31`).endOf('day').format(dateAdvFormat);
                endDate3 = dayjs(`${selectedYear}/06/30`).endOf('day').format(dateAdvFormat);
                setStart1(startDate1);
                setStart2(startDate2);
                setStart3(startDate3);
                setEnd1(endDate1);
                setEnd2(endDate2);
                setEnd3(endDate3);
                setMonth1("April");
                setMonth2("May");
                setMonth3("June");
                break;
            case 3:
                startDate1 = dayjs(`${selectedYear}/07/01`).format(dateAdvFormat);
                startDate2 = dayjs(`${selectedYear}/08/01`).format(dateAdvFormat);
                startDate3 = dayjs(`${selectedYear}/09/01`).format(dateAdvFormat);
                endDate1 = dayjs(`${selectedYear}/07/31`).endOf('day').format(dateAdvFormat);
                endDate2 = dayjs(`${selectedYear}/08/31`).endOf('day').format(dateAdvFormat);
                endDate3 = dayjs(`${selectedYear}/09/30`).endOf('day').format(dateAdvFormat);
                setStart1(startDate1);
                setStart2(startDate2);
                setStart3(startDate3);
                setEnd1(endDate1);
                setEnd2(endDate2);
                setEnd3(endDate3);
                setMonth1("July");
                setMonth2("August");
                setMonth3("September");
                break;
            case 4:
                startDate1 = dayjs(`${selectedYear}/10/01`).format(dateAdvFormat);
                startDate2 = dayjs(`${selectedYear}/11/01`).format(dateAdvFormat);
                startDate3 = dayjs(`${selectedYear}/12/01`).format(dateAdvFormat);
                endDate1 = dayjs(`${selectedYear}/10/31`).endOf('day').format(dateAdvFormat);
                endDate2 = dayjs(`${selectedYear}/11/30`).endOf('day').format(dateAdvFormat);
                endDate3 = dayjs(`${selectedYear}/12/31`).endOf('day').format(dateAdvFormat);
                setStart1(startDate1);
                setStart2(startDate2);
                setStart3(startDate3);
                setEnd1(endDate1);
                setEnd2(endDate2);
                setEnd3(endDate3);
                setMonth1("October");
                setMonth2("November");
                setMonth3("December");
                break;
        }
    };

    useEffect(() => {
        if (session) {
            getStatisticOfMonth(start1!, end1!).then(res => setBarDataMonth1(res));
            getStatisticOfMonth(start2!, end2!).then(res => setBarDataMonth2(res));
            getStatisticOfMonth(start3!, end3!).then(res => setBarDataMonth3(res));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [start1, start2, start3, end1, end2, end3]);

    const getPastYearsArray = () => {
        const currentYear = dayjs().endOf('year').year();
        let yearsArray: number[] = [];

        for (let i = 0; i < 5; i++) {
            yearsArray.push(currentYear - i);
        }

        return yearsArray;
    };

    return (
        <AntdLayoutNoSSR
            content={
                <>
                    {areInArray(session?.user.roles!, ROLE_SALES) && (
                        <>
                            <div className="flex mb-4 p-2 bg-[#f8f9fa]/10 border border-gray-200 rounded-lg shadow-lg shadow-[#e7edf5]/50">
                                <span className="mt-1.5 mr-1">Year:</span>
                                <Select
                                    placeholder="Select a year"
                                    onChange={(value) => setSeletedYear(value)}
                                >
                                    {getPastYearsArray().map((year) => (
                                        <Option key={year} value={year}>
                                            {year}
                                        </Option>
                                    ))}
                                </Select>
                                {selectedYear && selectedYear > 0 && (
                                    <>
                                        <span className="mt-1.5 mr-1 ml-2">Quarter:</span>
                                        <Select
                                            placeholder="Select quarter of year"
                                            onChange={(value) => handleChange(value)}
                                        >
                                            <Option value={1}>{`First quarter (January - March)`}</Option>
                                            <Option value={2}>{`Second quarter (April - June)`}</Option>
                                            <Option value={3}>{`Third quarter (July - September)`}</Option>
                                            <Option value={4}>{`Fourth quarter (October - December)`}</Option>
                                        </Select>
                                    </>
                                )}
                            </div>
                            <div className="flex justify-center">
                                <span className="m-2" style={{ textAlign: "center" }}>
                                    <BarChartComponent
                                        barData={barDataMonth1!}
                                    />
                                    <h3>{month1}</h3>
                                </span>
                                <span className="m-2" style={{ textAlign: "center" }}>
                                    <BarChartComponent
                                        barData={barDataMonth2!}
                                    />
                                    <h3>{month2}</h3>
                                </span>
                                <span className="m-2" style={{ textAlign: "center" }}>
                                    <BarChartComponent
                                        barData={barDataMonth3!}
                                    />
                                    <h3>{month3}</h3>
                                </span>
                            </div>
                        </>
                    )}
                </>
            }
        />
    );
};

export default StatisticPage;


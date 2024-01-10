"use client";
import { CaretLeftOutlined } from "@ant-design/icons";
import BreadcrumbComponent from "@components/BreadcrumbComponent";
import RackDetail from "@components/area/rack/RackDetail";
import RackMapRender from "@components/area/rack/RackMapRender";
import BarChartComponent from "@components/chartComponent/Bar";
import PieChartComponent from "@components/chartComponent/Pie";
import { Rack, RackMap } from "@models/rack";
import { StatisticParamGet } from "@models/statistic";
import area from "@services/rack";
import statisticService from "@services/statistic";
import { ROLE_SALES, ROLE_TECH, dateAdvFormat } from "@utils/constants";
import { areInArray, convertDatePicker } from "@utils/helpers";
import { Avatar, Button, DatePicker, List } from "antd";
import { ItemType } from "antd/es/breadcrumb/Breadcrumb";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const { RangePicker } = DatePicker;
const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
    ssr: false,
});

const Statistic: React.FC = () => {
    const { data: session } = useSession();
    const router = useRouter();
    //   const [statistic, setStatistic] = useState<Statistic | undefined>(undefined);
    const [barData, setBarData] = useState<any>();
    const [barDataMonth, setBarDataMonth] = useState<any>();
    const [start, setStart] = useState<string>();
    const [end, setEnd] = useState<string>();

    const getData = async () => {
        await statisticService
            .getDataByMonth(
                session?.user.access_token!,
                {
                    StartDate: start,
                    EndDate: end
                } as unknown as StatisticParamGet)
            .then((res) => {
                setBarData(res);
            });
    };

    useEffect(() => {
        if (session) {
            setStart(dayjs().toString());
            setEnd(dayjs().toString());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session]);

    useEffect(() => {
        if (session) {
            getData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [start, end]);

    return (
        <AntdLayoutNoSSR
            content={
                <>
                    {areInArray(session?.user.roles!, ROLE_SALES) && (
                        <>
                            <div className="flex justify-end mb-4 p-2 bg-[#f8f9fa]/10 border border-gray-200 rounded-lg shadow-lg shadow-[#e7edf5]/50">
                                <RangePicker
                                    name="statisticDate"
                                    onChange={(date) => {
                                        setStart(date?.[0]?.toString())
                                        setEnd(date?.[1]?.toString())
                                    }}
                                />
                            </div>
                            <div className="flex justify-center">
                                <BarChartComponent
                                    barData={barData!}
                                />
                            </div>
                        </>
                    )}
                </>
            }
        />
    );
};

export default Statistic;

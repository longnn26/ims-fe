"use client";
import { useEffect, useState } from "react";
import useDispatch from "@hooks/use-dispatch";
import useSelector from "@hooks/use-selector";
import { getUomCategories } from "@slices/uomCategory";
import dynamic from "next/dynamic";
import React from "react";
import { useSession } from "next-auth/react";
import UnitsOfMeasureTable from "@components/units-of-measure/UnitsOfMeasureTable";

const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});

const UnitsOfMeasure: React.FC = () => {
  const dispatch = useDispatch();
  const { data: session } = useSession();

  //function handle
  const fetchData = async () => {
    dispatch(
      getUomCategories({
        token: session?.user.access_token!,
      })
    );
  };

  //life cycle
  useEffect(() => {
    session && fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);
  return <AntdLayoutNoSSR content={<UnitsOfMeasureTable />} />;
};

export default UnitsOfMeasure;

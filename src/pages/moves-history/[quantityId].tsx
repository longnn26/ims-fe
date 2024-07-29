"use client";
import BreadcrumbComponent from "@components/breadcrumb/BreadcrumbComponent";
import { handleBreadCumb } from "@utils/helpers";
import { ItemType } from "antd/es/breadcrumb/Breadcrumb";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import dynamic from "next/dynamic";
import React from "react";
const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});

interface Props {
  quantityId: string;
  accessToken: string;
  itemBrs: ItemType[];
}

const MovesHistoryPage: React.FC<Props> = (props) => {
  const { quantityId, accessToken, itemBrs } = props;

  return (
    <AntdLayoutNoSSR
      content={<>{<BreadcrumbComponent itemBreadcrumbs={itemBrs} />}</>}
    />
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const session = await getSession(context);
  const quantityId = context.query.quantityId!;
  const accessToken = session?.user?.access_token!;
  const itemBrs = handleBreadCumb(context.resolvedUrl);
  return {
    props: {
      quantityId: quantityId.toString(),
      accessToken: accessToken?.toString(),
      itemBrs: itemBrs,
    },
  };
};
export default MovesHistoryPage;

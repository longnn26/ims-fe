"use client";

import { TableColumnsType } from "antd";
import { Button, Space, Table, Tooltip } from "antd";
import { useRouter } from "next/router";
import { RackMap } from "@models/rack";
import { ServerAllocation } from "@models/serverAllocation";
import React from "react";

interface Props {
  rackMapList: RackMap[];
  //   onEdit: (data: RackMap) => void;
  //   onDelete: (data: RackMap) => void;
}

interface DataType {
  key: React.Key;
  id: number;
  position: number;
  rackId: number;
  serverAllocation: ServerAllocation;
  requestedServerAllocation: ServerAllocation;
  rowSpanServer: number;
  isReserved: boolean;
}

const RackMapRender: React.FC<Props> = (props) => {
  const {
    // onEdit, onDelete,
    rackMapList,
  } = props;
  const router = useRouter();
  const _ = require("lodash");

  const groupWithServer = _.groupBy(rackMapList, "serverAllocation['id']");
  const groupWithServerR = _.groupBy(
    rackMapList,
    "requestedServerAllocation['id']"
  );
  const columns: TableColumnsType<DataType> = [
    {
      title: "Location",
      dataIndex: "position",
      key: "position",
      render: (_, record) => {
        return {
          props: {
            style: {
              backgroundColor: record.isReserved === false ? 
              (record.serverAllocation ? "#fde3cf"
                : record.requestedServerAllocation ? "#c2e4ea" : "#e1efd8") : "#fde3cf",
              color: record.isReserved === false ? 
              (record.serverAllocation
                ? "#f56a00"
                : record.requestedServerAllocation ? "black" : ""): "#f56a00",
              lineHeight:1,
            },
          },
          children: `U${record.position + 1}`,
        };
      },
    },
    {
      title: "Reserved For",
      key: "serverAllocation",
      render: (record: DataType) => {
        return {
          props: {
            style: {
              backgroundColor: record.isReserved === false ? 
              (record.serverAllocation ? "#fde3cf"
                : record.requestedServerAllocation ? "#c2e4ea" : "#e1efd8") : "#fde3cf",
              color: record.isReserved === false ? 
              (record.serverAllocation
                ? "#f56a00"
                : record.requestedServerAllocation ? "black" : ""): "#f56a00",
              lineHeight: 0,
            },
          },
          children: (
            <div>
              <p
              className={record.serverAllocation ? "cursor-pointer" : record.requestedServerAllocation ? "cursor-pointer" : ""}
              onClick={(e) => {
                record.serverAllocation &&
                  router.push(`/server/${record.serverAllocation.id}`);
                record.requestedServerAllocation &&
                  router.push(`/server/${record.requestedServerAllocation.id}`);
              }}
            >
                {record.serverAllocation ? `${record.serverAllocation?.masterIp?.address} - ${record.serverAllocation?.customer.companyName}`
                : record.requestedServerAllocation ? `${record.requestedServerAllocation?.masterIp ? record.requestedServerAllocation?.masterIp.address + " - " : ""} ${record.requestedServerAllocation?.customer.companyName}`
                : record.isReserved === true ? `Reserved for other device` : ``}
              </p>
            </div>
          ),
        };
      },
      onCell: (record) => {
        return {
          rowSpan: (record.serverAllocation?.id  || record.requestedServerAllocation?.id) ? record.rowSpanServer : 1,
        };
      },
    },
  ];

  const data: DataType[] = [];
  for (let i = 0; i < rackMapList?.length; ++i) {
    var rowSpan = 0;
    if (
      rackMapList[i].serverAllocation &&
      rackMapList[i].id ===
        groupWithServer[`${rackMapList[i].serverAllocation?.id}`][0].id
    ) {
      rowSpan =
        groupWithServer[`${rackMapList[i].serverAllocation?.id}`].length;
    }
    if (
      rackMapList[i].requestedServerAllocation &&
      rackMapList[i].id ===
        groupWithServerR[`${rackMapList[i].requestedServerAllocation?.id}`][0]
          .id
    ) {
      rowSpan =
        groupWithServerR[`${rackMapList[i].requestedServerAllocation?.id}`]
          .length;
    }
    data.push({
      key: rackMapList[i].id,
      id: rackMapList[i].id,
      position: rackMapList[i].position,
      rackId: rackMapList[i].rackId,
      serverAllocation: rackMapList[i].serverAllocation,
      requestedServerAllocation: rackMapList[i].requestedServerAllocation,
      rowSpanServer: rowSpan,
      isReserved: rackMapList[i].isReserved,
    });
  }

  return (
    <div className="shadow m-5">
      <Table
        bordered
        size="small"
        columns={columns}
        dataSource={data}        
        pagination={false}
        expandable={{
          rowExpandable: (record) => record.serverAllocation != null && record.isReserved,
        }}
      />
    </div>
  );
};

export default RackMapRender;

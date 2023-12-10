"use client";

import useSelector from "@hooks/use-selector";
import { dateAdvFormat } from "@utils/constants";
import { TableColumnsType } from "antd";
import { Button, Space, Table, Tooltip } from "antd";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import moment from "moment";
import { Area } from "@models/area";
import { useRouter } from "next/router";
import { RackMap } from "@models/rack";
import { ServerAllocation } from "@models/serverAllocation";
import type { TableProps } from "antd";
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
      dataIndex: "location",
      key: "location",
      render: (_, record) => {
        return {
          props: {
            style: {
              backgroundColor: record.serverAllocation
                ? "#fde3cf"
                : record.requestedServerAllocation
                ? "#c2e4ea"
                : "#e1efd8",
              color: record.serverAllocation
                ? "#f56a00"
                : record.requestedServerAllocation
                ? "black"
                : "",
            },
          },
          children: `${record.position + 1}`,
        };
      },
    },
    {
      title: "Server",
      key: "serverAllocation",
      render: (_, record) => {
        return {
          props: {
            style: {
              backgroundColor: record.serverAllocation
                ? "#fde3cf"
                : record.requestedServerAllocation
                ? "#c2e4ea"
                : "#e1efd8",
              color: record.serverAllocation
                ? "#f56a00"
                : record.requestedServerAllocation
                ? "black"
                : "",
            },
          },

          children: (
            <p
              className="cursor-pointer"
              onClick={(e) => {
                record.serverAllocation &&
                  router.push(`/server/${record.serverAllocation.id}`);
              }}
            >
              {record.serverAllocation
                ? `${record.serverAllocation?.masterIp.address} - ${record.serverAllocation?.customer.companyName}`
                : record.requestedServerAllocation
                ? `${record.requestedServerAllocation?.masterIp.address} - ${record.requestedServerAllocation?.customer.companyName}`
                : ``}
            </p>
          ),
        };
      },
      onCell: (record) => {
        return {
          rowSpan: record.rowSpanServer,
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
    });
  }

  return (
    <div className="shadow m-5">
      <Table
        // className="!p-2"
        bordered
        columns={columns}
        dataSource={data}
        scroll={{ x: 1300 }}
        pagination={false}
        expandable={{
          rowExpandable: (record) => record.serverAllocation != null,
        }}
      />
    </div>
  );
};

export default RackMapRender;

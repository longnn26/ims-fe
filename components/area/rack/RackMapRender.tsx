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
  console.log(groupWithServer);
  const columns: TableColumnsType<DataType> = [
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      render: (_, record) => {
        // <a className="text-[#b75c3c] hover:text-[#ee4623]">{record.position}</a>
        return {
          props: {
            style: {
              backgroundColor: record.serverAllocation ? "#fde3cf" : "#b2b6c1",
              color: record.serverAllocation ? "#f56a00" : "",
            },
          },
          children: `${record.position}`,
        };
      },
    },
    {
      title: "Server",
      key: "serverAllocation",
      render: (_, record) => {
        return {
          props: { style: { backgroundColor: "#fde3cf", color: "#f56a00" } },
          children: (
            <p
              className="cursor-pointer"
              onClick={(e) => {
                record.serverAllocation &&
                  router.push(`/server/${record.serverAllocation.id}`);
              }}
            >
              {`${record.serverAllocation?.customer.companyName} - ${record.serverAllocation?.note} `}
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
      console.log(groupWithServer[`${rackMapList[i].serverAllocation?.id}`]);
      rowSpan =
        groupWithServer[`${rackMapList[i].serverAllocation?.id}`].length;
    }
    data.push({
      key: rackMapList[i].id,
      id: rackMapList[i].id,
      position: rackMapList[i].position,
      rackId: rackMapList[i].rackId,
      serverAllocation: rackMapList[i].serverAllocation,
      rowSpanServer: rowSpan,
    });
  }

  return (
    <div className="shadow m-5">
      <Table
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

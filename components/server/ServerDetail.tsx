import React from "react";
import { Descriptions, Divider, Modal, Tag } from "antd";
import { ServerAllocation } from "@models/serverAllocation";
import { dateAdvFormat, serverAllocationStatus } from "@utils/constants";
import moment from "moment";

interface Props {
  serverAllocationDetail: ServerAllocation;
}

const ServerDetail: React.FC<Props> = (props) => {
  const { serverAllocationDetail } = props;
  var statusData = serverAllocationStatus.find(
    (_) => _.value === serverAllocationDetail?.status
  );
  return (
    <div className="shadow-[rgba(13,_38,_76,_0.19)_0px_9px_20px] m-5 rounded-md">
      <Divider orientation="left" plain>
        <h3>Server </h3>
      </Divider>{" "}
      <Descriptions className="p-5">
        {/* <Descriptions.Item label="Id">
          {serverAllocationDetail?.id}
        </Descriptions.Item> */}
        <Descriptions.Item label="Status">
          <Tag color={statusData?.color}>{statusData?.value}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Date Created">
          {moment(serverAllocationDetail?.dateCreated).format(dateAdvFormat)}
        </Descriptions.Item>
        <Descriptions.Item label="Nearest Updated">
          {moment(serverAllocationDetail?.dateUpdated).format(dateAdvFormat)}
        </Descriptions.Item>
        <Descriptions.Item label="Customer">
          {serverAllocationDetail?.customer.companyName}
        </Descriptions.Item>
        <Descriptions.Item label="Technical note" span={4}>
          {serverAllocationDetail?.techNote}
        </Descriptions.Item>
        <Descriptions.Item label="Server's IP" span={0}>
          {serverAllocationDetail?.masterIp?.address}
        </Descriptions.Item>
        <Descriptions.Item label="Serial Number" span={0}>
          {serverAllocationDetail?.serialNumber}
        </Descriptions.Item>
        <Descriptions.Item label="Server Name" span={0}>
          {serverAllocationDetail?.name}
        </Descriptions.Item>
        <Descriptions.Item label="Power (w)">
          {serverAllocationDetail?.power}
        </Descriptions.Item>
        <Descriptions.Item label="Additional IPs">
          {serverAllocationDetail?.ipCount}
        </Descriptions.Item>
        <Descriptions.Item label="Location">
          {serverAllocationDetail?.location}
        </Descriptions.Item>
        <Descriptions.Item label="Receipt Of Recipient (installation)" span={4}>
          {serverAllocationDetail?.receiptOfRecipientFilePath}
        </Descriptions.Item>
        <Descriptions.Item label="Inspection Report" span={4}>
          {serverAllocationDetail?.inspectionRecordFilePath}
        </Descriptions.Item>
        <Descriptions.Item label="Receipt Of Recipient (removal)">
          {serverAllocationDetail?.removalFilePath}
        </Descriptions.Item>
        {/* <Descriptions.Item label="Note" span={4}>
          {serverAllocationDetail?.note}
        </Descriptions.Item> */}
        {/* <Descriptions.Item label="Inspector Note" span={4}>
          {serverAllocationDetail?.inspectorNote}
        </Descriptions.Item> */}
      </Descriptions>
    </div>
  );
};

export default ServerDetail;

import React from "react";
import { Descriptions, Divider, Modal, Tag } from "antd";
import { ServerAllocation } from "@models/serverAllocation";
import { dateAdvFormat, serverAllocationStatus } from "@utils/constants";
import moment from "moment";
import { ServerHardwareConfigData } from "@models/serverHardwareConfig";

interface Props {
  serverAllocationDetail: ServerAllocation;
  hardware: ServerHardwareConfigData | undefined;
}

const ServerDetail: React.FC<Props> = (props) => {
  const { serverAllocationDetail, hardware } = props;
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
        <Descriptions.Item label="Server's IP" span={0}>
          {serverAllocationDetail?.masterIp?.address}
        </Descriptions.Item>
        <Descriptions.Item label="Serial Number" span={0}>
          {serverAllocationDetail?.serialNumber}
        </Descriptions.Item>
        <Descriptions.Item label="Server Name" span={0}>
          {serverAllocationDetail?.name}
        </Descriptions.Item>
        <Descriptions.Item label="Power" span={0}>
          {serverAllocationDetail?.power} W
        </Descriptions.Item>
        <Descriptions.Item label="Part Number" span={2}>
          {serverAllocationDetail?.partNumber}
        </Descriptions.Item>
        <Descriptions.Item label="Customer" span={4}>
          {serverAllocationDetail?.customer?.companyName}
        </Descriptions.Item>
        <Descriptions.Item label="CPU" span={3}>
          {hardware?.data.find((i) => i.componentId === 1)?.description}
        </Descriptions.Item>
        <Descriptions.Item label="Memory" span={3}>
          {hardware?.data.find((i) => i.componentId === 2)?.description}
        </Descriptions.Item>
        <Descriptions.Item label="Storage" span={3}>
          {hardware?.data.find((i) => i.componentId === 3)?.description}
        </Descriptions.Item>
        <Descriptions.Item label="Additional IPs" span={0}>
          {serverAllocationDetail?.ipCount}
        </Descriptions.Item>
        <Descriptions.Item label="Location" span={2}>
          {serverAllocationDetail?.location}
        </Descriptions.Item>
        <Descriptions.Item label="Delivery Report (Installation)" span={4}>
          {serverAllocationDetail?.receiptOfRecipientFilePath !== null && (
            <a href={`${serverAllocationDetail?.receiptOfRecipientFilePath}`}>
              Biên bản giao nhận (lắp đặt thiết bị)
            </a>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Acceptance Report" span={4}>
          {serverAllocationDetail?.inspectionRecordFilePath !== null && (
            <a href={`${serverAllocationDetail?.inspectionRecordFilePath}`}>
              Biên bản nghiệm thu (khi lắp đặt thiết bị)
            </a>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Delivery Report (Removal)">
          {serverAllocationDetail?.removalReceiptFilePath !== null && (
            <a href={`${serverAllocationDetail?.removalReceiptFilePath}`}>
              Biên bản giao nhận (gỡ thiết bị)
            </a>
          )}
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

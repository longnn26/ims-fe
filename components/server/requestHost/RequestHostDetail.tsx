import { RequestHost } from "@models/requestHost";
import { dateAdvFormat, requestHostStatus } from "@utils/constants";
import { Descriptions, Divider, Tag } from "antd";
import { count } from "console";
import moment from "moment";
import React from "react";

interface Props {
  requestHostDetail: RequestHost;
}

const RequestHostDetailInfor: React.FC<Props> = (props) => {
  const { requestHostDetail } = props;

  return (
    <div className="shadow-[rgba(13,_38,_76,_0.19)_0px_9px_20px] m-5 rounded-md">
      <Divider orientation="left" plain>
        <h3>IP Request information </h3>
      </Divider>{" "}
      <Descriptions className="p-5">
        <Descriptions.Item label="Request's Status">
          <Tag
            className="text-center"
            color={
              requestHostStatus.find(
                (_) => _.value === requestHostDetail?.status
              )?.color
            }
          >
            {
              requestHostStatus.find(
                (_) => _.value === requestHostDetail?.status
              )?.value
            }
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Type">
          {requestHostDetail?.type}
        </Descriptions.Item>
        <Descriptions.Item label="Date Created">
          {moment(requestHostDetail?.dateCreated).format(dateAdvFormat)}
        </Descriptions.Item>
        <Descriptions.Item label="Customer" span={4}>
          {requestHostDetail?.customer.companyName}
        </Descriptions.Item>
        <Descriptions.Item label="Purpose">
          {requestHostDetail?.isRemoval
            ? "Remove"
            : requestHostDetail?.isUpgrade
            ? "Upgrade"
            : "Add"}
        </Descriptions.Item>
        <Descriptions.Item
          label="Quantity"
          span={
            requestHostDetail?.type === "Port" &&
            (requestHostDetail?.ipAddresses === null ||
              requestHostDetail?.ipAddresses.length === 0)
              ? 0
              : 2
          }
        >
          {requestHostDetail?.quantity}
        </Descriptions.Item>
        {Boolean(
          requestHostDetail?.type === "Port" &&
            (requestHostDetail?.ipAddresses === null ||
              requestHostDetail?.ipAddresses.length === 0)
        ) && (
          <Descriptions.Item label="Capacity (GB)">
            {requestHostDetail?.capacities.join(" | ")}
          </Descriptions.Item>
        )}
        <Descriptions.Item label="Sales Staff">
          {requestHostDetail?.evaluator?.fullname}
        </Descriptions.Item>
        <Descriptions.Item label="Sale Staff's Note" span={2}>
          {requestHostDetail?.saleNote}
        </Descriptions.Item>
        <Descriptions.Item label="Technical Staff">
          {requestHostDetail?.executor?.fullname}
        </Descriptions.Item>
        <Descriptions.Item label="Technical Staff's Note" span={2}>
          {requestHostDetail?.techNote}
        </Descriptions.Item>
        <Descriptions.Item label="Customer's Note" span={4}>
          {requestHostDetail?.note}
        </Descriptions.Item>
        <Descriptions.Item label="Acceptance Report" span={4}>
          {requestHostDetail?.inspectionReportFilePath !== null && (
            <a href={`${requestHostDetail?.inspectionReportFilePath}`}>
              Biên bản nghiệm thu (dịch vụ sử dụng IP)
            </a>
          )}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default RequestHostDetailInfor;

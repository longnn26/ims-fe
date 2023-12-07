import { RequestHost } from "@models/requestHost";
import { dateAdvFormat, requestHostStatus } from "@utils/constants";
import { Descriptions, Divider, Tag } from "antd";
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
        <h3>Request host information </h3>
      </Divider>{" "}
      <Descriptions className="p-5">
        <Descriptions.Item label="Date Created" span={2}>
          {moment(requestHostDetail?.dateCreated).format(dateAdvFormat)}
        </Descriptions.Item>

        <Descriptions.Item label="Request's Status" span={2}>
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

        <Descriptions.Item label="Customer" span={2}>
          {requestHostDetail?.customer.companyName}
        </Descriptions.Item>
        <Descriptions.Item label="Type" span={2}>
          {requestHostDetail?.type === "Additional"
            ? "Ip"
            : requestHostDetail?.type}
        </Descriptions.Item>
        <Descriptions.Item label="Address" span={2}>
          {requestHostDetail?.customer.address}
        </Descriptions.Item>
        <Descriptions.Item label="Purpose" span={2}>
          {requestHostDetail?.isRemoval ? "Remove" : "Add"}
        </Descriptions.Item>
        <Descriptions.Item label="Taxnumber" span={2}>
          {requestHostDetail?.customer.taxNumber}
        </Descriptions.Item>
        <Descriptions.Item label="Quantity" span={2}>
          {requestHostDetail?.quantity}
        </Descriptions.Item>
        <Descriptions.Item label="Email" span={2}>
          {requestHostDetail?.customer.email}
        </Descriptions.Item>
        <Descriptions.Item label="Sales Staff" span={2}>
          {requestHostDetail?.evaluator?.fullname}
        </Descriptions.Item>
        <Descriptions.Item label="Phone" span={2}>
          {requestHostDetail?.customer.phoneNumber}
        </Descriptions.Item>
        <Descriptions.Item label="Sale Staff's Note" span={2}>
          {requestHostDetail?.saleNote}
        </Descriptions.Item>
        <Descriptions.Item label="Server's Ip" span={2}>
          {requestHostDetail?.serverAllocation.masterIpAddress}
        </Descriptions.Item>
        <Descriptions.Item label="Technical Staff" span={2}>
          {requestHostDetail?.executor?.fullname}
        </Descriptions.Item>

        <Descriptions.Item label="Customer's Note" span={2}>
          {requestHostDetail?.note}
        </Descriptions.Item>

        <Descriptions.Item label="Technical Staff's Note" span={2}>
          {requestHostDetail?.techNote}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default RequestHostDetailInfor;

import { RequestHost } from "@models/requestHost";
import { dateAdvFormat, requestUpgradeStatus } from "@utils/constants";
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
        <Descriptions.Item label="Date Created" span={4}>
          {moment(requestHostDetail?.dateCreated).format(dateAdvFormat)}
        </Descriptions.Item>

        <Descriptions.Item label="Customer">
          {requestHostDetail?.customer.companyName}
        </Descriptions.Item>
        <Descriptions.Item label="Address">
          {requestHostDetail?.customer.address}
        </Descriptions.Item>
        <Descriptions.Item label="Taxnumber">
          {requestHostDetail?.customer.taxNumber}
        </Descriptions.Item>
        <Descriptions.Item label="Email">
          {requestHostDetail?.customer.email}
        </Descriptions.Item>
        <Descriptions.Item label="Phone">
          {requestHostDetail?.customer.phoneNumber}
        </Descriptions.Item>
        <Descriptions.Item label="Server's Ip">
          {requestHostDetail?.serverAllocation.masterIpAddress}
        </Descriptions.Item>
        <Descriptions.Item label="Request's Status" span={4}>
          <Tag
            className="text-center"
            color={
              requestUpgradeStatus.find(
                (_) => _.value === requestHostDetail?.status
              )?.color
            }
          >
            {
              requestUpgradeStatus.find(
                (_) => _.value === requestHostDetail?.status
              )?.value
            }
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Type" span={4}>
          {requestHostDetail?.isRemoval ? "Remove" : "Add"}
        </Descriptions.Item>
        <Descriptions.Item label="Quantity" span={4}>
          {requestHostDetail?.quantity}
        </Descriptions.Item>
        <Descriptions.Item label="Customer's Note" span={4}>
          {requestHostDetail?.note}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default RequestHostDetailInfor;
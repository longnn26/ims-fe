import React from "react";
import { Descriptions, Divider, Tag } from "antd";
import { dateAdvFormat, requestUpgradeStatus } from "@utils/constants";
import moment from "moment";
import { RequestUpgrade } from "@models/requestUpgrade";

interface Props {
  requestUpgradeDetail: RequestUpgrade;
}

const RequestUpgradeDetailInfor: React.FC<Props> = (props) => {
  const { requestUpgradeDetail } = props;

  return (
    <div className="shadow-[rgba(13,_38,_76,_0.19)_0px_9px_20px] m-5 rounded-md">
      <Divider orientation="left" plain>
        <h3>Hardware Upgrade Request Information </h3>
      </Divider>{" "}
      <Descriptions className="p-5">
        <Descriptions.Item label="Customer" span={4}>
          {requestUpgradeDetail?.customer.companyName}
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag
            className="text-center"
            color={
              requestUpgradeStatus.find(
                (_) => _.value === requestUpgradeDetail?.status
              )?.color
            }
          >
            {
              requestUpgradeStatus.find(
                (_) => _.value === requestUpgradeDetail?.status
              )?.value
            }
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Component">
          {requestUpgradeDetail?.component.name}
        </Descriptions.Item>
        <Descriptions.Item label="Request Type" span={2}>
          {requestUpgradeDetail?.requestType}
        </Descriptions.Item>
        <Descriptions.Item label="Customer Note" span={4}>
          {requestUpgradeDetail?.note}
        </Descriptions.Item>
        <Descriptions.Item label="Sale Staff" span={4}>
          {requestUpgradeDetail?.evaluator?.fullname}
        </Descriptions.Item>
        <Descriptions.Item label="Sale Staff's Note" span={4}>
          {requestUpgradeDetail?.saleNote}
        </Descriptions.Item>
        <Descriptions.Item label="Technical Staff" span={4}>
          {requestUpgradeDetail?.executor?.fullname}
        </Descriptions.Item>
        <Descriptions.Item label="Technical Staff's Note" span={4}>
          {requestUpgradeDetail?.techNote}
        </Descriptions.Item>
        <Descriptions.Item label="Date Created" span={1}>
          {moment(requestUpgradeDetail?.dateCreated).format(dateAdvFormat)}
        </Descriptions.Item>
        <Descriptions.Item label="Nearest Updated" span={2}>
          {moment(requestUpgradeDetail?.dateUpdated).format(dateAdvFormat)}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default RequestUpgradeDetailInfor;

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
        <h3>Request upgrade information </h3>
      </Divider>{" "}
      <Descriptions className="p-5">
        <Descriptions.Item label="Id">
          {requestUpgradeDetail?.id}
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
        <Descriptions.Item label="Component" span={4}>
          {requestUpgradeDetail?.component.name}
        </Descriptions.Item>
        <Descriptions.Item label="Date Created" span={4}>
          {moment(requestUpgradeDetail?.dateCreated).format(dateAdvFormat)}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default RequestUpgradeDetailInfor;

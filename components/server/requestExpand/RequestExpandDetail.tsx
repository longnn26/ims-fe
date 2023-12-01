import React from "react";
import { Descriptions, Divider, Tag } from "antd";
import { dateAdvFormat, requestUpgradeStatus } from "@utils/constants";
import moment from "moment";
import { RequestExpand } from "@models/requestExpand";

interface Props {
  requestExpandDetail: RequestExpand;
}

const RequestExpandDetailInfor: React.FC<Props> = (props) => {
  const { requestExpandDetail } = props;

  return (
    <div className="shadow-[rgba(13,_38,_76,_0.19)_0px_9px_20px] m-5 rounded-md">
      <Divider orientation="left" plain>
        <h3>Request expand information </h3>
      </Divider>{" "}
      <Descriptions className="p-5">
        <Descriptions.Item label="Id">
          {requestExpandDetail?.id}
        </Descriptions.Item>
        <Descriptions.Item label="Expand size (U)">
          {requestExpandDetail?.size}
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag
            className="text-center"
            color={
              requestUpgradeStatus.find(
                (_) => _.value === requestExpandDetail?.status
              )?.color
            }
          >
            {
              requestUpgradeStatus.find(
                (_) => _.value === requestExpandDetail?.status
              )?.value
            }
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Tech note" span={4}>
          {requestExpandDetail?.techNote}
        </Descriptions.Item>
        <Descriptions.Item label="Customer's expectation" span={4}>
          {requestExpandDetail?.customer.customerName}
        </Descriptions.Item>
        <Descriptions.Item label="Date Created" span={4}>
          {moment(requestExpandDetail?.dateCreated).format(dateAdvFormat)}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default RequestExpandDetailInfor;

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
        <h3>Server Allocation Request Information </h3>
      </Divider>{" "}
      <Descriptions className="p-5">
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
        <Descriptions.Item label="Request Type" span={2}>
          {requestExpandDetail?.requestType}
        </Descriptions.Item>
        <Descriptions.Item label="Size">
          {requestExpandDetail?.size}
        </Descriptions.Item>
        <Descriptions.Item label="Location" span={2}>
          {requestExpandDetail?.chosenLocation}
        </Descriptions.Item>
        <Descriptions.Item label="Date Request" span={0}>
          {moment(requestExpandDetail?.dateCreated).format(dateAdvFormat)}
        </Descriptions.Item>
        <Descriptions.Item label="Nearest Updated " span={2}>
          {moment(requestExpandDetail?.dateUpdated).format(dateAdvFormat)}
        </Descriptions.Item>

        <Descriptions.Item label="Customer" span={4}>
          {requestExpandDetail?.customer?.companyName}
        </Descriptions.Item>
        <Descriptions.Item label="Customer Note" span={4}>
          {requestExpandDetail?.note}
        </Descriptions.Item>
        <Descriptions.Item label="Sales Staff" span={4}>
          {requestExpandDetail?.evaluator?.fullname}
        </Descriptions.Item>
        <Descriptions.Item label="Sales Staff Note" span={4}>
          {requestExpandDetail?.saleNote}
        </Descriptions.Item>
        <Descriptions.Item label="Technical Staff" span={4}>
          {requestExpandDetail?.executor?.fullname}
        </Descriptions.Item>
        <Descriptions.Item label="Technical Staff Note" span={4}>
          {requestExpandDetail?.techNote}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default RequestExpandDetailInfor;

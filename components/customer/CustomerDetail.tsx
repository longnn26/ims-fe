import React from "react";
import { Descriptions, Divider, Modal, Tag } from "antd";
import { Customer } from "@models/customer";
import { customerStatus, dateAdvFormat } from "@utils/constants";
import moment from "moment";

interface Props {
    customerDetail: Customer;
}

const CustomerDetail: React.FC<Props> = (props) => {
  const { customerDetail } = props;
  var statusData = customerStatus.find(
    (_) => _.value === customerDetail?.isDeleted
  );
  return (
    <div className="shadow-[rgba(13,_38,_76,_0.19)_0px_9px_20px] m-5 rounded-md">
      <Divider orientation="left" plain>
        <h3>Customer Information</h3>
      </Divider>{" "}
      <Descriptions className="p-5">
        <Descriptions.Item label="Id">
          {customerDetail?.id}
        </Descriptions.Item>
        {/* <Descriptions.Item label="Status">
          <Tag color={statusData?.color}>{statusData?.value}</Tag>
        </Descriptions.Item> */}
        <Descriptions.Item label="Power">
          {customerDetail?.companyName}
        </Descriptions.Item>
        <Descriptions.Item label="Serial Number" span={0}>
          {customerDetail?.address}
        </Descriptions.Item>
        <Descriptions.Item label="Server Name" span={0}>
          {customerDetail?.taxNumber}
        </Descriptions.Item>
        <Descriptions.Item label="IP Address" span={0}>
          {customerDetail?.email}
        </Descriptions.Item>
        <Descriptions.Item label="Customer" span={4}>
          {customerDetail?.phoneNumber}
        </Descriptions.Item>
        <Descriptions.Item label="Date Created" span={4}>
          {moment(customerDetail?.dateCreated).format(dateAdvFormat)}
        </Descriptions.Item>
        <Descriptions.Item label="Date Updated" span={4}>
          {moment(customerDetail?.dateUpdated).format(dateAdvFormat)}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default CustomerDetail;
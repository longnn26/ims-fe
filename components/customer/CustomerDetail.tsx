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
    (_) => _.value === customerDetail?.isDeleted != true ? "Active" : "Removed"
  );
  return (
    <div className="shadow-[rgba(13,_38,_76,_0.19)_0px_9px_20px] m-5 rounded-md">
      <Divider orientation="left" plain>
        <h3>Customer Information</h3>
      </Divider>
      <Descriptions className="p-7">
        {/* <Descriptions.Item label="Status">
          <Tag color={statusData?.color}>{statusData?.value}</Tag>
        </Descriptions.Item> */}
        <Descriptions.Item label="Company">
          {customerDetail?.companyName}
        </Descriptions.Item>
        <Descriptions.Item label="Address" span={0}>
          {customerDetail?.address}
        </Descriptions.Item>
        <Descriptions.Item label="Tax Number" span={0}>
          {customerDetail?.taxNumber}
        </Descriptions.Item>
        <Descriptions.Item label="Email" span={0}>
          {customerDetail?.email}
        </Descriptions.Item>
        <Descriptions.Item label="Phone Number" span={4}>
          {customerDetail?.phoneNumber}
        </Descriptions.Item>
        <Descriptions.Item label="Date Created" span={4}>
          {moment(customerDetail?.dateCreated).format(dateAdvFormat)}
        </Descriptions.Item>
        <Descriptions.Item label="Status" span={4}>
          {/* <Tag color={statusData?.color}>{statusData?.value}</Tag> */}
          {customerDetail?.isDeleted ? "Yes" : " No"}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default CustomerDetail;
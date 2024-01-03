import React from "react";
import { Descriptions, Divider, Modal, Tag } from "antd";
import { ServerAllocation } from "@models/serverAllocation";
import { dateAdvFormat, requestUpgradeStatus } from "@utils/constants";
import moment from "moment";
import { Appointment } from "@models/appointment";

interface Props {
  appointmentDetail: Appointment;
}

const ServerDetail: React.FC<Props> = (props) => {
  const { appointmentDetail } = props;

  return (
    <div className="shadow-[rgba(13,_38,_76,_0.19)_0px_9px_20px] m-5 rounded-md">
      <Divider orientation="left" plain>
        <h3>Appointment </h3>
      </Divider>{" "}
      <Descriptions className="p-5">
        <Descriptions.Item label="Status">
          <Tag
            className="text-center"
            color={
              requestUpgradeStatus.find(
                (_) => _.value === appointmentDetail?.status
              )?.color
            }
          >
            {
              requestUpgradeStatus.find(
                (_) => _.value === appointmentDetail?.status
              )?.value
            }
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Date Created">
          {moment(appointmentDetail?.dateCreated).format(dateAdvFormat)}
        </Descriptions.Item>
        <Descriptions.Item label="Date Updated" span={2}>
          {moment(appointmentDetail?.dateUpdated).format(dateAdvFormat)}
        </Descriptions.Item>
        <Descriptions.Item label="Date Appointed">
          {moment(appointmentDetail?.dateAppointed).format(dateAdvFormat)}
        </Descriptions.Item>
        <Descriptions.Item label="Customer" span={2}>
          {appointmentDetail?.customer.companyName}
        </Descriptions.Item>
        <Descriptions.Item label="Server IP's">
          {appointmentDetail?.serverAllocation.masterIpAddress}
        </Descriptions.Item>
        <Descriptions.Item label="Serial Number">
          {appointmentDetail?.serverAllocation.serialNumber}
        </Descriptions.Item>
        <Descriptions.Item label="Serial Name" span={2}>
          {appointmentDetail?.serverAllocation.name}
        </Descriptions.Item>
        <Descriptions.Item label="Visiter">
          {appointmentDetail?.appointedCustomer}
        </Descriptions.Item>

        {/* <Descriptions.Item label="Appointed" span={4}>
          {moment(appointmentDetail?.dateAppointed).format(dateAdvFormat)}
        </Descriptions.Item> */}

        <Descriptions.Item label="Customer Note">
          {appointmentDetail?.note}
        </Descriptions.Item>
        <Descriptions.Item label="Reason">
          {appointmentDetail?.reason}
        </Descriptions.Item>
        <Descriptions.Item label="Sale Staff">
          {appointmentDetail?.evaluator?.fullname}
        </Descriptions.Item>
        <Descriptions.Item label="Sale Staff's Note" span={2}>
          {appointmentDetail?.saleNote}
        </Descriptions.Item>
        <Descriptions.Item label="Technical Staff">
          {appointmentDetail?.executor?.fullname}
        </Descriptions.Item>
        <Descriptions.Item label=" Techical Staff's Note" span={2}>
          {appointmentDetail?.techNote}
        </Descriptions.Item>
        <Descriptions.Item label="CheckedIn">
          {moment(appointmentDetail?.dateCheckedIn).format(dateAdvFormat)}
        </Descriptions.Item>
        <Descriptions.Item label="CheckedOut" span={2}>
          {moment(appointmentDetail?.dateCheckedOut).format(dateAdvFormat)}
        </Descriptions.Item>
        <Descriptions.Item label="Acceptance Report" span={4}>
          {appointmentDetail?.inspectionReportFilePath !== null && (
            <a href={`${appointmentDetail?.inspectionReportFilePath}`}>
              Biên bản nghiệm thu
            </a>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Delivery Report" span={4}>
          {appointmentDetail?.inspectionReportFilePath !== null && (
            <a href={`${appointmentDetail?.receiptOfRecipientFilePath}`}>
              Biên bản giao nhận
            </a>
          )}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default ServerDetail;

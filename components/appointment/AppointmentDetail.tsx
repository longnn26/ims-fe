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
      <Descriptions className="p-5" column={4}>
        <Descriptions.Item label="Status" span={1}>
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
        <Descriptions.Item label="Reason" span={3}>
          {appointmentDetail?.reason}
        </Descriptions.Item>
        <Descriptions.Item label="Customer" span={1}>
          {appointmentDetail?.customer.companyName}
        </Descriptions.Item>
        <Descriptions.Item label="Server IP's" span={1}>
          {appointmentDetail?.serverAllocation.masterIpAddress}
        </Descriptions.Item>
        <Descriptions.Item label="Serial Number" span={1}>
          {appointmentDetail?.serverAllocation.serialNumber}
        </Descriptions.Item>
        <Descriptions.Item label="Serial Name" span={1}>
          {appointmentDetail?.serverAllocation.name}
        </Descriptions.Item>          
        <Descriptions.Item label="Customer Note" span={1}>
          {appointmentDetail?.note}
        </Descriptions.Item>
        <Descriptions.Item label="Visitor" span={3}>
          {appointmentDetail?.appointedCustomer && (
            <>
              {appointmentDetail.appointedCustomer.split(',').map((visitor, index) => (
                <>
                  {index > 0 && <br />}
                  {visitor}
                </>
              ))}
            </>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Sale Staff">
          {appointmentDetail?.evaluator?.fullname}
        </Descriptions.Item>
        <Descriptions.Item label="Sale Staff's Note" span={1}>
          {appointmentDetail?.saleNote}
        </Descriptions.Item>
        <Descriptions.Item label="Technical Staff">
          {appointmentDetail?.executor?.fullname}
        </Descriptions.Item>
        <Descriptions.Item label=" Techical Staff's Note" span={1}>
          {appointmentDetail?.techNote}
        </Descriptions.Item>
        
        {/* Date Record */}
        <Descriptions.Item label="Date Created" span={1}>
          {moment(appointmentDetail?.dateCreated).format(dateAdvFormat)}
        </Descriptions.Item>
        <Descriptions.Item label="Date Appointed" span={1}>
          {moment(appointmentDetail?.dateAppointed).format(dateAdvFormat)}
        </Descriptions.Item>
        <Descriptions.Item label="Date Checked In">
          {moment(appointmentDetail?.dateCheckedIn).format(dateAdvFormat)}
        </Descriptions.Item>
        <Descriptions.Item label="Date Checked Out" span={1}>
          {moment(appointmentDetail?.dateCheckedOut).format(dateAdvFormat)}
        </Descriptions.Item>
        <Descriptions.Item label="Approval Date" span={1}>
          {moment(appointmentDetail?.dateEvaluated).format(dateAdvFormat)}
        </Descriptions.Item>
        <Descriptions.Item label="Technical Recorded Date" span={1}>
          {moment(appointmentDetail?.dateExecuted).format(dateAdvFormat)}
        </Descriptions.Item>
        <Descriptions.Item label="Customer Confirmed Date" span={2}>
          {moment(appointmentDetail?.dateConfirm).format(dateAdvFormat)}
        </Descriptions.Item>
        {/* Không biết có cần hay khum;-;
        <Descriptions.Item label="Nearest Date Updated" span={1}>
          {moment(appointmentDetail?.dateUpdated).format(dateAdvFormat)}
        </Descriptions.Item> */}
        <Descriptions.Item label="Acceptance Report" span={1}>
          {appointmentDetail?.inspectionReportFilePath !== null && (
            <a href={`${appointmentDetail?.inspectionReportFilePath}`}>
              Biên bản nghiệm thu
            </a>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Acceptance Report (Signed)" span={1}>
          {appointmentDetail?.finalInspectionReport !== null && (
            <a href={`${appointmentDetail?.finalInspectionReport}`}>
              Hình ảnh chữ ký
            </a>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Delivery Report" span={1}>
          {appointmentDetail?.receiptOfRecipientFilePath !== null && (
            <a href={`${appointmentDetail?.receiptOfRecipientFilePath}`}>
              Biên bản giao nhận
            </a>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Delivery Report (Signed)" span={1}>
          {appointmentDetail?.finalReceiptOfRecipient !== null && (
            <a href={`${appointmentDetail?.finalReceiptOfRecipient}`}>
              Hình ảnh chữ ký
            </a>
          )}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default ServerDetail;

import React from "react";
import { Descriptions, Divider, Modal } from "antd";
import { ServerAllocation } from "@models/serverAllocation";
import { dateAdvFormat } from "@utils/constants";
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
        <Descriptions.Item label="Id">
          {appointmentDetail?.id}
        </Descriptions.Item>
        <Descriptions.Item label="Customer">
          {appointmentDetail?.appointedCustomer}
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          {appointmentDetail?.status}
        </Descriptions.Item>
        {/* <Descriptions.Item label="Appointed" span={4}>
          {moment(appointmentDetail?.dateAppointed).format(dateAdvFormat)}
        </Descriptions.Item> */}
        <Descriptions.Item label="CheckedIn">
          {moment(appointmentDetail?.dateCheckedIn).format(dateAdvFormat)}
        </Descriptions.Item>
        <Descriptions.Item label="CheckedOut" span={2}>
          {moment(appointmentDetail?.dateCheckedOut).format(dateAdvFormat)}
        </Descriptions.Item>
        <Descriptions.Item label="Note" span={4}>
          {appointmentDetail?.note}
        </Descriptions.Item>
        <Descriptions.Item label="Reason" span={4}>
          {appointmentDetail?.reason}
        </Descriptions.Item>

        <Descriptions.Item label="Created">
          {moment(appointmentDetail?.dateCreated).format(dateAdvFormat)}
        </Descriptions.Item>
        <Descriptions.Item label="Updated">
          {moment(appointmentDetail?.dateUpdated).format(dateAdvFormat)}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default ServerDetail;

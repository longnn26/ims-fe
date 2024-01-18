import React from "react";
import { Badge, Descriptions, Divider, Tag } from "antd";
import { dateAdvFormat, requestUpgradeStatus } from "@utils/constants";
import moment from "moment";
import { Incident } from "@models/incident";

interface Props {
  incidentDetail: Incident;
}

const IncidentDetailInfo: React.FC<Props> = (props) => {
  const { incidentDetail } = props;

  return (
    <div className="shadow-[rgba(13,_38,_76,_0.19)_0px_9px_20px] m-5 rounded-md">
      <Divider orientation="left" plain>
        <h3>Incident Information</h3>
      </Divider>{" "}
      <Descriptions className="p-5">
        <Descriptions.Item label="Status">
          {incidentDetail.isResolved ? (
            <Badge status="success" text="Resolved" />
          ) : (
            <Badge status="warning" text="Resolving" />
          )}
        </Descriptions.Item>
        {incidentDetail.isResolved === true && (
          <Descriptions.Item label="Date Resolved " span={2}>
            {moment(incidentDetail?.dateResolved).format(dateAdvFormat)}
          </Descriptions.Item>
        )}

        <Descriptions.Item label="Description" span={4}>
          {incidentDetail?.description}
        </Descriptions.Item>
        <Descriptions.Item label="Solution" span={4}>
          {incidentDetail?.solution}
        </Descriptions.Item>

        <Descriptions.Item label="Technical Staff" span={4}>
          {incidentDetail?.executor?.fullname}
        </Descriptions.Item>

        <Descriptions.Item label="Date Request" span={0}>
          {moment(incidentDetail?.dateCreated).format(dateAdvFormat)}
        </Descriptions.Item>
        <Descriptions.Item label="Nearest Updated " span={2}>
          {moment(incidentDetail?.dateUpdated).format(dateAdvFormat)}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default IncidentDetailInfo;

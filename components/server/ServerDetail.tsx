import React from "react";
import { Descriptions, Divider, Modal } from "antd";
import { ServerAllocation } from "@models/serverAllocation";
import { dateAdvFormat } from "@utils/constants";
import moment from "moment";

interface Props {
  serverAllocationDetail: ServerAllocation;
}

const ServerDetail: React.FC<Props> = (props) => {
  const { serverAllocationDetail } = props;

  return (
    <div className="shadow-[rgba(13,_38,_76,_0.19)_0px_9px_20px] m-5 rounded-md">
      <Divider orientation="left" plain>
        <h3>Server </h3>
      </Divider>{" "}
      <Descriptions className="p-5">
        <Descriptions.Item label="Id">
          {serverAllocationDetail?.id}
        </Descriptions.Item>
        {/* <Descriptions.Item label="Expected Size">
          {serverAllocationDetail?.expectedSize}
        </Descriptions.Item> */}
        <Descriptions.Item label="Status">
          {serverAllocationDetail?.status}
        </Descriptions.Item>
        <Descriptions.Item label="Note" span={4}>
          {serverAllocationDetail?.note}
        </Descriptions.Item>
        {/* <Descriptions.Item label="Inspector Note" span={4}>
          {serverAllocationDetail?.inspectorNote}
        </Descriptions.Item> */}

        <Descriptions.Item label="Date Created" span={4}>
          {moment(serverAllocationDetail?.dateCreated).format(dateAdvFormat)}
        </Descriptions.Item>
        <Descriptions.Item label="Date Updated" span={4}>
          {moment(serverAllocationDetail?.dateUpdated).format(dateAdvFormat)}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default ServerDetail;

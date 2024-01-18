import React from "react";
import { Descriptions, Divider, Modal, Tag } from "antd";
import { ServerAllocation } from "@models/serverAllocation";
import { dateAdvFormat, serverAllocationStatus } from "@utils/constants";
import moment from "moment";
import { Rack } from "@models/rack";

interface Props {
  rackDetail: Rack;
}

const RackDetail: React.FC<Props> = (props) => {
  const { rackDetail } = props;

  return (
    <div className="shadow-[rgba(13,_38,_76,_0.19)_0px_9px_20px] m-5 rounded-md">
      <Divider orientation="left" plain>
        <h3>
          Rack{" "}
          {`${rackDetail?.area.name}${rackDetail?.row + 1} - ${
            rackDetail?.column + 1
          }`}{" "}
        </h3>
      </Divider>{" "}
      <Descriptions className="p-5">
        {/* <Descriptions.Item label="Id">{rackDetail?.id}</Descriptions.Item> */}

        <Descriptions.Item label="Max power">
          {rackDetail?.maxPower}
        </Descriptions.Item>
        {/* <Descriptions.Item label="Current power">
          {rackDetail?.currentPower}
        </Descriptions.Item> */}
        <Descriptions.Item label="Size" span={4}>
          {rackDetail?.size} U
        </Descriptions.Item>
        {/* <Descriptions.Item label="Customer" span={4}>
          {rackDetail?.customer.customerName}
        </Descriptions.Item>
        <Descriptions.Item label="Note" span={4}>
          {rackDetail?.note}
        </Descriptions.Item> */}
        {/* <Descriptions.Item label="Inspector Note" span={4}>
          {serverAllocationDetail?.inspectorNote}
        </Descriptions.Item> */}
      </Descriptions>
    </div>
  );
};

export default RackDetail;

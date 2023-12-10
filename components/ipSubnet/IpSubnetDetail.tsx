import React from "react";
import { Descriptions, Divider, Tag } from "antd";
import { dateAdvFormat } from "@utils/constants";
import moment from "moment";
import { IpSubnet } from "@models/ipSubnet";

interface Props {
  ipSubnetDetail: IpSubnet;
}

const IpSubnetDetail: React.FC<Props> = (props) => {
  const { ipSubnetDetail } = props;

  return (
    <div className="shadow-[rgba(13,_38,_76,_0.19)_0px_9px_20px] m-5 rounded-md">
      <Divider orientation="left" plain>
        <h3>Subnet detail</h3>
      </Divider>{" "}
      <Descriptions className="p-5">
        <Descriptions.Item label="Id">{ipSubnetDetail?.id}</Descriptions.Item>
        <Descriptions.Item
          label="Subnet"
          span={2}
        >{`${ipSubnetDetail?.firstOctet}.${ipSubnetDetail?.secondOctet}.${ipSubnetDetail?.thirdOctet}.${ipSubnetDetail?.fourthOctet}/${ipSubnetDetail?.prefixLength}`}</Descriptions.Item>
        <Descriptions.Item label="Note" span={4}>
          {ipSubnetDetail?.note}
        </Descriptions.Item>
        <Descriptions.Item label="Date Created" span={4}>
          {moment(ipSubnetDetail?.dateCreated).format(dateAdvFormat)}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default IpSubnetDetail;

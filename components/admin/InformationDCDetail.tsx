import React from "react";
import { Descriptions, Divider } from "antd";
import { InformationDC } from "@models/informationDC";

interface Props {
  informationDCDetail: InformationDC | undefined;
}

const InformationDCDetail: React.FC<Props> = (props) => {
  const { informationDCDetail } = props;

  return (
    <div className="shadow-[rgba(13,_38,_76,_0.19)_0px_9px_20px] m-5 rounded-md">
      <Divider orientation="left" plain>
        <h3>Information Detail</h3>
      </Divider>
      <Descriptions className="p-5">
        <Descriptions.Item label=" Quang Trung Representator">
          {informationDCDetail?.qtName}
        </Descriptions.Item>
        <Descriptions.Item label="Position">
          {informationDCDetail?.position}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default InformationDCDetail;

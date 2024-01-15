import React from "react";
import { Descriptions, Divider, Modal, Tag } from "antd";
import { dateAdvFormat, requestUpgradeStatus } from "@utils/constants";
import moment from "moment";
import { User } from "@models/user";

interface Props {
  staffAccountDetail: User | undefined;
}

const StaffAccountDetail: React.FC<Props> = (props) => {
  const { staffAccountDetail } = props;

  console.log(staffAccountDetail)
  return (
    <div className="shadow-[rgba(13,_38,_76,_0.19)_0px_9px_20px] m-5 rounded-md">
      <Divider orientation="left" plain>
        <h3>Staff Account Detail</h3>
      </Divider>
      <Descriptions className="p-5" column={2}>
        <Descriptions.Item label="Username">
          {staffAccountDetail?.userName}
        </Descriptions.Item>
        <Descriptions.Item label="Full Name">
          {staffAccountDetail?.fullname}
        </Descriptions.Item>
        <Descriptions.Item label="Email">
          {staffAccountDetail?.email}
        </Descriptions.Item>
        <Descriptions.Item label="Phone Number">
          {staffAccountDetail?.phoneNumber}
        </Descriptions.Item>
        <Descriptions.Item label="Address" span={2}>
          {staffAccountDetail?.address}
        </Descriptions.Item>
        <Descriptions.Item label="Position" span={2}>
          {staffAccountDetail?.positions?.at(0) === "Admin" ? "Adminstrator" :
           staffAccountDetail?.positions?.at(0) === "Sale" ? "Sales Staff" :
           staffAccountDetail?.positions?.at(0) === "Tech" ? "Technical Staff" : 
           staffAccountDetail?.positions?.at(0)}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default StaffAccountDetail;

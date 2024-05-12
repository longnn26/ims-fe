import React from "react";
import { Descriptions, Divider } from "antd";
import { User } from "@models/user";

interface Props {
  userDetail: User | undefined;
}

const AccountDetail: React.FC<Props> = (props) => {
  const { userDetail} = props;

  return (
    <div className="m-5 rounded-md">
      <Divider orientation="left" plain>
        <h3>My Account</h3>
      </Divider>
      <Descriptions className="p-5" layout="vertical">
        <>
          <Descriptions.Item label="Username">
            {userDetail?.userName}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {userDetail?.email}
          </Descriptions.Item>
          <Descriptions.Item label="Phone Number">
            {userDetail?.phoneNumber}
          </Descriptions.Item>
          <Descriptions.Item label="Address">
            {userDetail?.address}
          </Descriptions.Item>
        </>
      </Descriptions>
    </div>
  );
};

export default AccountDetail;

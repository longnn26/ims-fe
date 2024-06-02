import React from "react";
import { Avatar } from "antd";
import { User } from "@models/user";
import { UserOutlined, StarOutlined } from "@ant-design/icons";
import { urlImageLinkHost } from "@utils/api-links";
import { truncateString } from "@utils/helpers";

interface ProfileCellProps {
  user: any;
}

const ProfileCell: React.FC<ProfileCellProps> = ({ user }) => {
  return (
    <div className="flex items-center gap-3">
      <Avatar src={`${urlImageLinkHost + user?.avatar}`} size="large" >
        {user?.name?.charAt(0)}
      </Avatar>
      <div className="flex flex-col">
        <p className="font-normal">{user?.name}</p>

        <p className="opacity-70">{truncateString(user?.email ?? "", 35)}</p>
      </div>
    </div>
  );
};

export default ProfileCell;

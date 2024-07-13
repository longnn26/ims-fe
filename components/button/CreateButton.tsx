import React from "react";
import { Button, Tooltip } from "antd";
import { MdCreateNewFolder } from "react-icons/md";

interface CreateButtonProps {
  onSave: () => void;
}

const FlexButtons: React.FC<CreateButtonProps> = ({ onSave }) => {
  return (
    <Tooltip title="New">
      <Button
        type="primary"
        shape="round"
        icon={<MdCreateNewFolder size={20} />}
        onClick={onSave}
      />
    </Tooltip>
  );
};

export default FlexButtons;

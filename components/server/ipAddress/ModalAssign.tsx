import React, { useState } from "react";
import { Alert, Button, Modal, Space, message } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { IpAddress } from "@models/ipAddress";
import { useSession } from "next-auth/react";
import serverAllocationService from "@services/serverAllocation";
import { MasterIpCreateModel } from "@models/serverAllocation";
import { BsFillHddNetworkFill } from "react-icons/bs";

const { confirm } = Modal;

interface Props {
  id: number;
  ipSuggestMaster?: IpAddress;
  onClose: () => void;
  onRefresh: () => void;
}

const ModalAssign: React.FC<Props> = (props) => {
  const { onRefresh, onClose, ipSuggestMaster, id } = props;
  const { data: session } = useSession();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const assignMasterIp = async () => {
    setConfirmLoading(true);
    await serverAllocationService
      .assignMasterIp(session?.user.access_token!, id, {
        ipAddressId: ipSuggestMaster?.id,
      } as MasterIpCreateModel)
      .then((res) => {
        message.success("Assign master ip successful!");
        onRefresh();
        onClose();
      })
      .catch((errors) => {
        message.error(errors.response.data);
      })
      .finally(() => {
        setConfirmLoading(false);
      });
  };
  return (
    <>
      <Modal
        title={<span className="inline-block m-auto">IP Address</span>}
        open={Boolean(ipSuggestMaster)}
        confirmLoading={confirmLoading}
        onCancel={() => {
          onClose();
        }}
        footer={[]}
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          {Boolean(ipSuggestMaster) && (
            <Alert
              message="Ip suggest master"
              description={`${ipSuggestMaster?.address}`}
              type="success"
              showIcon
              action={
                <Button
                  loading={confirmLoading}
                  size="small"
                  type="text"
                  icon={<BsFillHddNetworkFill />}
                  onClick={() => {
                    confirm({
                      title: "Do you want to save?",
                      async onOk() {
                        assignMasterIp();
                      },
                      onCancel() {},
                    });
                  }}
                >
                  Assign
                </Button>
              }
            />
          )}
        </Space>
      </Modal>
    </>
  );
};

export default ModalAssign;

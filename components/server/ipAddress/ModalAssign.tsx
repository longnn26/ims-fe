import React, { useEffect, useState } from "react";
import { Alert, Button, Modal, Select, Space, Spin, message } from "antd";
import { IpAddress, IpAddressParamGet } from "@models/ipAddress";
import { useSession } from "next-auth/react";
import serverAllocationService from "@services/serverAllocation";
import ipAddressService from "@services/ipAddress";
import { MasterIpCreateModel } from "@models/serverAllocation";
import { BsFillHddNetworkFill } from "react-icons/bs";
const { Option } = Select;

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
  const [loading, setLoading] = useState(false);

  const [ipAddressParamGet, setIpAddressParamGet] = useState<IpAddressParamGet>(
    { PageIndex: 0, PageSize: 6, IsAssigned: false, IsAvailable: true, } as IpAddressParamGet
  );
  const [ipAddressList, setIpAddressList] = useState<IpAddress[]>([]);
  const [ipAddressSelected, setIpAddressSelected] = useState<
    number | undefined
  >();

  // const [pageSizeIp, setPageSizeIp] = useState<number>(6);
  const [totalPageIp, setTotalPageIp] = useState<number>(2);
  // const [pageIndexIp, setPageIndexIp] = useState<number>(0);

  const assignMasterIp = async (ipAddressId: number) => {
    setLoading(true);
    await serverAllocationService
      .assignMasterIp(session?.user.access_token!, id, {
        ipAddressId: ipAddressId,
      } as MasterIpCreateModel)
      .then((res) => {
        message.success("Assign master ip successfully!", 1.5);
        onRefresh();
        onClose();
      })
      .catch((errors) => {
        message.error(errors.response.data, 1.5);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getMoreIpAddressList = async () => {
    ipAddressParamGet.PageIndex += 1;
    await ipAddressService
      .getData(session?.user.access_token!, {...ipAddressParamGet, IsAssigned: false, IsAvailable: true,})
      .then(async (data) => {
        setTotalPageIp(data.totalPage);
        ipAddressParamGet.PageIndex = data.pageIndex;
        setIpAddressList([...ipAddressList, ...data.data]);
      });
  };

  useEffect(() => {
    session && getMoreIpAddressList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, ipAddressParamGet]);
  return (
    <>
      <Modal
        destroyOnClose={true}
        title={<span className="inline-block m-auto">IP Address</span>}
        open={Boolean(ipSuggestMaster)}
        confirmLoading={confirmLoading}
        onCancel={() => {
          onClose();
          setIpAddressSelected(undefined);
          setIpAddressParamGet({
            PageIndex: 0,
            PageSize: 6,
          } as IpAddressParamGet);
        }}
        footer={[]}
      >
        <Spin spinning={loading}>
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
                          assignMasterIp(ipSuggestMaster?.id!);
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
            <Space.Compact style={{ width: "100%" }}>
              <Select
                labelInValue
                listHeight={160}
                style={{ width: "100%" }}
                showSearch
                filterOption={(inputValue, option) => {
                  return Boolean(
                    option?.label?.toString().includes(inputValue)
                  );
                }}
                onSearch={(value) => {
                  setIpAddressList([]);
                  setIpAddressParamGet({
                    ...ipAddressParamGet,
                    Address: value,
                    PageIndex: 0,
                  });
                }}
                onPopupScroll={async (e: any) => {
                  const { target } = e;
                  if (
                    (target as any).scrollTop + (target as any).offsetHeight ===
                    (target as any).scrollHeight
                  ) {
                    if (ipAddressParamGet.PageIndex < totalPageIp) {
                      getMoreIpAddressList();
                    }
                  }
                }}
                onSelect={(value) => {
                  setIpAddressSelected(value.value);
                }}
              >
                {ipAddressList.map((l, index) => (
                  <Option value={l.id} label={l?.address} key={index}>
                    {l.address}
                  </Option>
                ))}
              </Select>
              {ipAddressSelected !== undefined && (
                <Button
                  loading={confirmLoading}
                  type="primary"
                  icon={<BsFillHddNetworkFill />}
                  onClick={() => {
                    confirm({
                      title: "Do you want to save?",
                      async onOk() {
                        assignMasterIp(ipAddressSelected);
                      },
                      onCancel() {},
                    });
                  }}
                >
                  Assign
                </Button>
              )}
            </Space.Compact>{" "}
          </Space>
        </Spin>
      </Modal>
    </>
  );
};

export default ModalAssign;

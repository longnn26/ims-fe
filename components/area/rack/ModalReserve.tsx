import React, { useEffect, useRef, useState } from "react";
import { Button, Input, Modal, Select, Space, Spin, message } from "antd";
import { Form } from "antd";
import { IpSubnet, IpSubnetCreateModel } from "@models/ipSubnet";
import { CloseOutlined } from "@ant-design/icons";
import ipSubnetService from "@services/ipSubnet";
import { useSession } from "next-auth/react";
import ipAddress from "@services/ipAddress";
import { IpAddress, IpAddressParamGet } from "@models/ipAddress";
import locationService from "@services/location";
import { Location, LocationParamGet } from "@models/location";
import { useRouter } from "next/router";
const { confirm } = Modal;
const { Option } = Select;

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const ModalReserve: React.FC<Props> = (props) => {
  const formRef = useRef(null);
  const [form] = Form.useForm();
  const { open, onClose, onSubmit } = props;
  const { data: session } = useSession();
  const router = useRouter();

  const [totalPageCus, setTotalPageCus] = useState<number>(2);
  const [pageIndexCus, setPageIndexCus] = useState<number>(0);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<Location[]>([]);
  const [paramGet, setParamGet] = useState<LocationParamGet>({
    PageIndex: 0,
    PageSize: 6,
  } as LocationParamGet);
  const [totalPage, setTotalPage] = useState<number>(2);
  const [selectedLocation, setSelectedLocation] = useState<number>();
  const [locationList, setLocationList] = useState<Location[]>([]);

  const disabled = async () => {
    var result = false;
    try {
      await form.validateFields();
    } catch (errorInfo) {
      result = true;
    }
    return result;
  };

  const reverse = async (id: number[]) => {
    setLoading(true);
    await locationService
      .reserve(session?.user.access_token!, id)
      .then(() => {
        message.success("Reserve successfully!", 1.5);
        onSubmit();
        form.resetFields();
      })
      .catch((errors) => {
        message.error(errors.response.data, 1.5);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getMoreLocation = async (isFirst?: boolean) => {
    if (isFirst === true) {
      paramGet.PageIndex = 0;
    }
    paramGet.PageIndex += 1;
    await locationService
      .getData(session?.user.access_token!, {
        ...paramGet,
        RackId: parseInt(router.query.rackId+""),
        Size: 1,
      })
      .then(async (data) => {
        setTotalPage(data.totalPage);
        paramGet.PageIndex = data.pageIndex;
        isFirst === true ?
        setLocationList([...data.data])
        : setLocationList([...locationList, ...data.data]);
      });
  };

  useEffect(() => {
    if (session) {
      getMoreLocation(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, open]);

  return (
    <>
      <Modal
        title={<span className="inline-block m-auto">Reserve</span>}
        open={open}
        confirmLoading={confirmLoading}
        onCancel={() => {
          onClose();
          form.resetFields();
        }}
        footer={[
          <Button
            disabled={loading}
            loading={confirmLoading}
            className="btn-submit"
            key="submit"
            onClick={async () => {
              if (!(await disabled()))
                confirm({
                  title: "Do you want to reserve these Location?",
                  async onOk() {
                    reverse(form.getFieldValue("ids"));
                  },
                  onCancel() {},
                });
            }}
          >
            Submit
          </Button>,
        ]}
      >
        <Spin spinning={loading} tip="Reserve" size="large">
          <div className="flex max-w-md flex-col gap-4 m-auto">
            <Form
              ref={formRef}
              form={form}
              style={{ width: "100%" }}
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 20 }}
              name="dynamic_form_complex"
            >
              {/* <Form.Item name="subnet" label="Subnet">
                <Input readOnly />
              </Form.Item> */}
              <Form.Item
                name="ids"
                label="Location"
                rules={[
                  {
                    required: true,
                    message: "Please select at least an Location",
                  },
                ]}
              >
                <Select
                  mode="multiple"
                  placeholder="Please select Location"
                  allowClear
                  listHeight={160}
                  onPopupScroll={async (e: any) => {
                    const { target } = e;
                    if (
                      (target as any).scrollTop +
                        (target as any).offsetHeight ===
                      (target as any).scrollHeight
                    ) {
                      if (pageIndexCus < totalPageCus) {
                        getMoreLocation();
                      }
                    }
                  }}
                >
                  {locationList.map((l, index) => (
                    <Option key={l.id} value={l.id}>
                      {`${l?.rack.area.name}${l?.rack.row + 1} - ${l?.rack.column + 1} U${
                        l?.position !== undefined ? l.position + 1 : ""
                      }`}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Form>
          </div>
        </Spin>
      </Modal>
    </>
  );
};

export default ModalReserve;

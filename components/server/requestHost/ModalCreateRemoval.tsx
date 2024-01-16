import React, { useRef, useState, useEffect } from "react";
import { Button, Input, Modal, Select, Spin, Upload, UploadFile, message } from "antd";
import { Form } from "antd";
import useSelector from "@hooks/use-selector";
import { RequestHostCreateModel } from "@models/requestHost";
import { UploadOutlined } from '@ant-design/icons';

import { useSession } from "next-auth/react";
import requestHostService from "@services/requestHost";
import { ServerAllocation } from "@models/serverAllocation";
import { IpAddress, IpAddressParamGet } from "@models/ipAddress";
import ipAddress from "@services/ipAddress";
import { useRouter } from "next/router";
import UploadComponent from "@components/UploadComponent";
const { Option } = Select;
const { confirm } = Modal;

interface Props {
  serverId: number | undefined;
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const ModalCreate: React.FC<Props> = (props) => {
  const formRef = useRef(null);
  const { data: session } = useSession();
  const [form] = Form.useForm();
  const router = useRouter();
  const { onSubmit, open, onClose } = props;

  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const { componentOptions } = useSelector((state) => state.component);
  const [selectedCapacities, setSelectedCapacities] = useState<number[]>([]);
  const [pageSize, setPageSize] = useState<number>(6);
  const [totalPageCus, setTotalPageCus] = useState<number>(2);
  const [pageIndexCus, setPageIndexCus] = useState<number>(0);
  const [maxQuantity, setMaxQuantity] = useState<number>(1);
  // const [server, setServer] = useState<ServerAllocation[]>([]);
  const [openModal, setOpenModal] = useState<boolean | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  const [ipAddresses, setIpAddresses] = useState<IpAddress[]>([]);
  const [requestType, setRequestType] = useState<string | undefined>(undefined);
  const [fileUpload, setFileUpload] = useState<UploadFile[]>([]);
  const [disabledFileUpload, setDisabledFileUpload] =  useState<boolean>(false);

  const disabled = async () => {
    var result = false;
    try {
      await form.validateFields();
    } catch (errorInfo) {
      result = true;
    }
    return result;
  };

  const getMoreIp = async () => {
    await ipAddress
      .getData(session?.user.access_token!, {
        PageIndex: pageIndexCus + 1,
        PageSize: pageSize,
        ServerAllocationId: parseInt(router.query.serverAllocationId + ""),
        AssignmentTypes: requestType,
        IsAssigned: true,
      } as IpAddressParamGet)
      .then(async (data) => {
        setTotalPageCus(data.totalPage);
        setPageIndexCus(data.pageIndex);
        setIpAddresses([...ipAddresses, ...data.data]);
        setMaxQuantity(ipAddresses.length);
      });
  };

  const createRequest = async (formData: RequestHostCreateModel, ipData: number[]) => {
    setLoading(true);
    await requestHostService
      .createData(session?.user.access_token!, formData)
      .then(async (res) => {
        await requestHostService
          .saveProvideIps(
            session?.user.access_token!,
            res.id,
            ipData
          )
          .then((res) => {
            message.success("Create successfully!", 1.5);
            form.resetFields();
            setOpenModal(undefined);
            onSubmit();
          })
          .catch((errors) => {
            setOpenModal(true);
            message.error(errors.response.data, 1.5);
          })
      })
      .catch((errors) => {
        setOpenModal(true);
        message.error(errors.response.data, 1.5);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    // Khi requestType thay đổi, reset selectedCapacities và hiển thị/ẩn quantity
    setSelectedCapacities([]);
    const filterIp =
      requestType === "Additional"
        ? ipAddresses.filter((l) => l.assignmentType === "Additional")
        : ipAddresses.filter((l) => l.assignmentType === "Port");
    setMaxQuantity(filterIp.length);
  }, [requestType]);

  useEffect(() => {
    session && getMoreIp();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  return (
    <>
      <Modal
        title={
          <span className="inline-block m-auto">Create IP Removal Request</span>
        }
        open={openModal === undefined ? open : openModal}
        confirmLoading={confirmLoading}
        onCancel={() => {
          onClose();
          setOpenModal(undefined);
          form.resetFields();
        }}
        footer={[
          <Button
            loading={loadingSubmit}
            className="btn-submit"
            key="submit"
            disabled={loading}
            onClick={async () => {
              if (!(await disabled()))
                confirm({
                  title: "Do you want to save?",
                  async onOk() {
                    setLoading(true); // Đặt trạng thái loading khi bắt đầu gửi dữ liệu
                    let formData: RequestHostCreateModel;
                    let ipData: number[];

                    formData = {
                      isRemoval: true,
                      type: form.getFieldValue("type"),
                      quantity: form.getFieldValue("ipAddressIds")?.length || 0,
                      note: form.getFieldValue("note"),
                      serverAllocationId: parseInt(router.query.serverAllocationId + ""),
                      removalRequestDocument: form.getFieldValue("upload").fileList[0].originFileObj,
                      removalRequestDocumentFileName: "Công văn ngưng (dịch vụ IP)"
                    } as RequestHostCreateModel;

                    ipData = form
                      .getFieldValue("ipAddressIds")
                      ?.map((l) => l.value);
                    // Call the provided onSubmit function with the formData

                    createRequest(formData, ipData);
                  },
                  onCancel() { },
                });
            }}
          >
            Submit
          </Button>,
        ]}
      >
        <div className="flex max-w-md flex-col gap-4 m-auto">
          <Spin spinning={loading} tip="Creating request..." size="large">
            <Form
              ref={formRef}
              form={form}
              labelCol={{ span: 6 }}
              labelWrap={true}
              wrapperCol={{ span: 20 }}
              style={{ width: "100%" }}
              name="dynamic_form_complex"
            >
              <Form.Item
                name="type"
                label="Remove Type"
                rules={[
                  { required: true, message: "Please select a component." },
                ]}
              >
                <Select
                  placeholder="Choose Request Type"
                  allowClear
                  onChange={(value) => setRequestType(value)}
                >
                  <Option value="Additional">IP</Option>
                  <Option value="Port">Port</Option>
                </Select>
              </Form.Item>
              <>
                {requestType && (
                  <>
                    <Form.Item
                      name="ipAddressIds"
                      label="IP Addresses"
                      labelAlign="right"
                      rules={[
                        {
                          required: true,
                          message: "IP Addresses must not empty!",
                        },
                      ]}
                    >
                      <Select
                        mode="multiple"
                        labelInValue
                        placeholder="Please select IPs to remove"
                        allowClear
                        listHeight={160}
                        onPopupScroll={async (e: any) => {
                          const { target } = e;
                          if (
                            (target as any).scrollTop + (target as any).offsetHeight === (target as any).scrollHeight
                          ) {
                            if (pageIndexCus < totalPageCus) {
                              getMoreIp();
                            }
                          }
                        }}
                      >
                        {requestType === "Additional"
                          ? ipAddresses
                            .filter((l) => l.assignmentType === "Additional")
                            .map((l, index) => (
                              <Option value={l.id} key={index}>
                                {`${l.address}`}
                              </Option>
                            ))
                          : ipAddresses
                            .filter((l) => l.assignmentType === "Port")
                            .map((l, index) => (
                              <Option value={l.id} key={index}>
                                {`${l.address} - ${l.capacity! === 0.1 ? "100 Mbps" : "1 GBps"
                                  }`}
                              </Option>
                            ))}
                      </Select>
                    </Form.Item>
                  </>
                )}
              </>
              <Form.Item name="upload" label="Discontinued service letter">
                <Upload>
                  <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
              </Form.Item>
              <Form.Item name="note" label="Note" rules={[{ max: 2000 }]}>
                <Input placeholder="Note" allowClear />
              </Form.Item>
            </Form>
          </Spin>
        </div>
      </Modal>
    </>
  );
};

export default ModalCreate;

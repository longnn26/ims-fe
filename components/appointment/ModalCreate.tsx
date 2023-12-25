import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Input, Modal, Row, Select, Card, DatePicker } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { Form } from "antd";
import useSelector from "@hooks/use-selector";
import customerService from "@services/customer";
import serverService from "@services/serverAllocation";
import requestUpgradeService from "@services/requestUpgrade";
import requestExpandService from "@services/requestExpand";
import { AppointmentCreateModel } from "@models/appointment";
import { dateAdvFormat } from "@utils/constants";
import { ServerAllocation } from "@models/serverAllocation";
import { useSession } from "next-auth/react";
import { ParamGet, ParamGetWithId } from "@models/base";
import { areInArray, parseJwt } from "@utils/helpers";
import { RUParamGet, RequestUpgrade } from "@models/requestUpgrade";
import { RequestExpand } from "@models/requestExpand";
const { Option } = Select;
const { confirm } = Modal;

interface Props {
  open: boolean;
  onClose: () => void;
  // loadingSubmit: boolean;
  onSubmit: (data: AppointmentCreateModel) => void;
}

const ModalCreate: React.FC<Props> = (props) => {
  const formRef = useRef(null);
  const [form] = Form.useForm();
  const { onSubmit, open, onClose } = props;
  const { data: session, update: sessionUpdate } = useSession();

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [server, setServer] = useState<ServerAllocation[]>([]);
  const [requestUpgrade, setRequestUpgrade] = useState<RequestUpgrade[]>([]);
  const [requestExpand, setRequestExpand] = useState<RequestExpand[]>([]);
  const [pageSizeCus, setPageSizeCus] = useState<number>(6);
  const [totalPageCus, setTotalPageCus] = useState<number>(2);
  const [pageIndexCus, setPageIndexCus] = useState<number>(0);
  const [totalPageUp, setTotalPageUp] = useState<number>(2);
  const [pageIndexUp, setPageIndexUp] = useState<number>(0);
  const [selectedServer, setSelectedServer] = useState<ServerAllocation>();
  const [selectedReason, setSelectedReason] = useState<string>("");

  const disabled = async () => {
    var result = false;
    try {
      await form.validateFields();
    } catch (errorInfo) {
      result = true;
    }
    return result;
  };

  const getMoreServer = async () => {
    await customerService
      .getServerById(session?.user.access_token!, {
        PageIndex: pageIndexCus + 1,
        PageSize: pageSizeCus,
        Id: parseJwt(session?.user.access_token).UserId,
      } as ParamGetWithId)
      .then(async (data) => {
        setTotalPageCus(data.totalPage);
        setPageIndexCus(data.pageIndex);
        setServer([...server, ...data.data]);
      });
  };

  const getMoreRequestUpgrade = async (serverId: number) => {
    await requestUpgradeService
      .getData(session?.user.access_token!, {
        PageIndex: pageIndexUp + 1,
        PageSize: pageSizeCus,
        ServerAllocationId: serverId,
      } as RUParamGet)
      .then(async (data) => {
        setTotalPageUp(data.totalPage);
        setPageIndexUp(data.pageIndex);
        setRequestUpgrade([...requestUpgrade, ...data.data]);
      });
  };

  const getMoreRequestExpand = async (serverId: number) => {
    await requestExpandService
      .getData(
      session?.user.access_token!, {
        PageIndex: pageIndexUp + 1,
        PageSize: pageSizeCus,
      } as ParamGet,
      serverId)
      .then(async (data) => {
        console.log(data)
        setTotalPageUp(data.totalPage);
        setPageIndexUp(data.pageIndex);
        setRequestExpand([...requestExpand, ...data.data]);
      });
  };

  const handleServerChange = async (res) => {
    await setRequestUpgrade([]);
    await setRequestExpand([]);
    await serverService.getServerAllocationById(session?.user.access_token!, res.value)
      .then((res) => {       
        setSelectedServer(res);
        setPageIndexUp(0);
        getMoreRequestUpgrade(res.id!);
        getMoreRequestExpand(res.id!);
      })
    form.setFieldsValue({
      requestUpgradeIds: undefined,
      requestExpand: undefined,
    });
  };


  useEffect(() => {
      if (session) {
        getMoreServer();
      }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  return (
    <>
      <Modal
        title={<span className="inline-block m-auto">Create customer</span>}
        open={open}
        confirmLoading={confirmLoading}
        onCancel={() => {
          onClose();
          form.resetFields();
          setSelectedServer(undefined);
        }}
        footer={[
          <Button
            // loading={loadingSubmit}
            className="btn-submit"
            key="submit"
            onClick={async () => {
              if (!(await disabled()))
                confirm({
                  title: "Do you want to save?",
                  async onOk() {
                    const requestUpgradeIds = form.getFieldValue("requestUpgradeIds").map(value => ({value})) || [];
                    onSubmit({
                      appointedCustomer: form.getFieldValue("appointedCustomer"),
                      dateAppointed: form.getFieldValue("dateAppointed"),
                      reason: form.getFieldValue("reason"),
                      note: form.getFieldValue("note"),
                      requestUpgradeIds: requestUpgradeIds,
                      requestExpandId: form.getFieldValue("requestExpandId"),
                    } as AppointmentCreateModel);
                    form.resetFields();
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
          <Form
            ref={formRef}
            form={form}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ width: "100%" }}
          >
            <Form.Item
              name="appointedCustomer"
              label="Visitor"
              rules={[{ required: true }]}
            >
              <Input placeholder="Visitor" allowClear />
            </Form.Item>
            <Form.Item
              name="dateAppointed"
              label="Visit date"
              rules={[{ required: true }]}
            >
              <DatePicker
                style={{ width: "100%" }}
                placeholder="Visit date"
                showTime
                format={dateAdvFormat}
                onChange={(value) =>
                  form.setFieldsValue({
                    dateCheckedIn: value,
                  })
                }
              />{" "}
            </Form.Item>
            <Form.Item
              name="reason"
              label="Reason"
              rules={[{ required: true, message: "Reason must not empty!" }]}
            >
              <Select
                labelInValue
                allowClear
                onChange={(res) => {
                  setSelectedReason(res.value);
                  form.setFieldsValue({serverAllocationId: undefined})
                }}
              >
                <Option value="Install">Server Installation</Option>
                <Option value="Uninstall">Server Gỡ</Option>
                <Option value="Upgrade">Server Nâng phần cứng</Option>
                <Option value="Support">Server Hỗ trợ</Option>
                <Option value="Incident">Server Sự cố</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="serverAllocationId"
              label="Server"
              labelAlign="right"
              rules={[{ required: true, message: "Server must not empty!" }]}
            >
              <Select
                labelInValue
                placeholder="Please select a server"
                allowClear
                listHeight={160}
                onChange={handleServerChange}
                onPopupScroll={async (e: any) => {
                  const { target } = e;
                  if (
                    (target as any).scrollTop + (target as any).offsetHeight ===
                    (target as any).scrollHeight
                  ) {
                    if (pageIndexCus < totalPageCus) {
                      getMoreServer();
                    }
                  }
                }}
              >
                {selectedReason === "Upgrade" ? 
                server
                .filter((l) => (l.status === "Working"))
                .map((l, index) => (
                  <Option 
                    value={l.id}
                    title={`${l?.name} - ${l.masterIp.address}`} 
                    key={index}
                  >
                    {`${l?.name} - ${l?.status}`}
                  </Option>
                )) : 
                server.map((l, index) => (
                  <Option 
                    value={l.id}
                    title={`${l?.name} - ${l?.masterIp === null ? "master IP has not assigned yet" : `${l.masterIp.address}`}`} 
                    key={index}
                  >
                    {`${l?.name} - ${l?.status}`}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            {selectedServer?.status === "Working" && selectedReason === "Upgrade" && (
              <>
                <Form.Item
                  name="requestUpgradeIds"
                  label="Request Upgrade"
                  labelAlign="right"
                  rules={[{ required: true, message: "Request must not empty!" }]}
                >
                  <Select
                    mode="multiple"
                    placeholder="Please select a request"
                    allowClear
                    onPopupScroll={async (e: any) => {
                      const { target } = e;
                      if (
                        (target as any).scrollTop + (target as any).offsetHeight ===
                        (target as any).scrollHeight
                      ) {
                        if (pageIndexUp < totalPageUp) {
                          getMoreRequestUpgrade(selectedServer?.id!);
                        }
                      }
                    }}
                  >
                    {requestUpgrade.map((l, index) => (
                      <Option value={l.id} key={index}>
                        {`${l?.id} - ${l?.component.name} - ${l?.status}`}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </>
            )}
            {(selectedReason === "Install" || selectedReason === "Uninstall") && (
              <>
                <Form.Item
                  name="requestExpandId"
                  label="Request Expand"
                  labelAlign="right"
                  rules={[{ required: true, message: "Request must not empty!" }]}
                >
                  <Select
                    placeholder="Please select a request"
                    allowClear
                    onPopupScroll={async (e: any) => {
                      const { target } = e;
                      if (
                        (target as any).scrollTop + (target as any).offsetHeight ===
                        (target as any).scrollHeight
                      ) {
                        if (pageIndexUp < totalPageUp) {
                          getMoreRequestExpand(selectedServer?.id!);
                        }
                      }
                    }}
                  >
                    {selectedReason === "Install" ? requestExpand
                      .filter((l) => (l.requestType === "Expand"))
                      .map((l, index) => (
                        <Option value={l.id} key={index}>
                          {`${l?.id} - Installation`}
                        </Option>
                      )) : requestExpand
                        .filter((l) => (l.requestType === "RemoveLocation")
                        ).map((l, index) => (
                          <Option value={l.id} key={index}>
                            {`${l?.id} - Remove Server`}
                          </Option>))}
                  </Select>
                </Form.Item>
              </>
            )}
            <Form.Item
              name="note"
              label="Note"
              rules={[{ required: true, max: 2000 }]}
            >
              <Input.TextArea
                placeholder="Note"
                allowClear
                autoSize={{ minRows: 1, maxRows: 6 }}
              />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default ModalCreate;

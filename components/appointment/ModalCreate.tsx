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
import { areInArray, convertDatePicker, parseJwt } from "@utils/helpers";
import { RUParamGet, RequestUpgrade } from "@models/requestUpgrade";
import { RequestExpand } from "@models/requestExpand";
import moment from "moment";
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
      .getServerById(
        session?.user.access_token!,
        parseJwt(session?.user.access_token).UserId,
        {
          PageIndex: pageIndexCus + 1,
          PageSize: pageSizeCus,
        } as ParamGet
      )
      .then(async (data) => {
        setTotalPageCus(data.totalPage);
        setPageIndexCus(data.pageIndex);
        setServer([...server, ...data.data]);
      });
  };

  const getMoreRequestUpgrade = async (
    serverId: number,
    pageIndex?: number,
    req?: RequestUpgrade[]
  ) => {
    await requestUpgradeService
      .getData(session?.user.access_token!, {
        PageIndex: pageIndex === 0 ? pageIndex : pageIndexUp + 1,
        PageSize: pageSizeCus,
        ServerAllocationId: serverId,
      } as RUParamGet)
      .then(async (data) => {
        setTotalPageUp(data.totalPage);
        setPageIndexUp(data.pageIndex);
        req
          ? setRequestUpgrade([...req, ...data.data])
          : setRequestUpgrade([...requestUpgrade, ...data.data]);
      });
  };

  const getMoreRequestExpand = async (
    serverId: number,
    pageIndex?: number,
    req?: RequestExpand[]
  ) => {
    await requestExpandService
      .getData(
        session?.user.access_token!,
        {
          PageIndex: pageIndex === 0 ? pageIndex : pageIndexUp + 1,
          PageSize: pageSizeCus,
        } as ParamGet,
        serverId
      )
      .then(async (data) => {
        setTotalPageUp(data.totalPage);
        setPageIndexUp(data.pageIndex);
        req
          ? setRequestExpand([...req, ...data.data])
          : setRequestExpand([...requestExpand, ...data.data]);
      });
  };

  const resetAllLists = (count: number) => {
    if (count === 3) {
      setSelectedReason("");
      setSelectedServer(undefined);
      setServer([]);
      setRequestExpand([]);
      setRequestUpgrade([]);
      setPageIndexUp(0);
      setPageIndexCus(0);
    } else if (count === 1) {
      setServer([]);
      setSelectedServer(undefined);
      setPageIndexCus(0);
    }
  };

  const handleServerChange = (res) => {
    form.setFieldsValue({
      requestUpgradeIds: undefined,
      requestExpandId: undefined,
    });
    if (res) {
      serverService
        .getServerAllocationById(session?.user.access_token!, res.value)
        .then((server) => {
          setSelectedServer(server);
          getMoreRequestUpgrade(server.id!, 0, []);
          getMoreRequestExpand(server.id!, 0, []);
        });
    }
  };

  const handleReasonChange = (res) => {
    resetAllLists(1);
    setSelectedReason(res.value);
    form.setFieldsValue({
      serverAllocationId: undefined,
      requestUpgradeIds: undefined,
      requestExpandId: undefined,
    });
    getMoreServer();
    handleServerChange(undefined);
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
        title={<span className="inline-block m-auto">Create Appointment</span>}
        open={open}
        confirmLoading={confirmLoading}
        onCancel={() => {
          onClose();
          form.resetFields();
          resetAllLists(3);
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
                    onSubmit({
                      appointedCustomer:
                        form.getFieldValue("appointedCustomer"),
                      dateAppointed: form.getFieldValue("dateAppointed"),
                      reason: selectedReason,
                      note: form.getFieldValue("note"),
                      requestUpgradeIds:
                        form.getFieldValue("requestUpgradeIds"),
                      serverAllocationId: selectedServer?.id,
                      requestExpandId: form.getFieldValue("requestExpandId"),
                    } as AppointmentCreateModel);
                    form.resetFields();
                  },
                  onCancel() {},
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
              rules={[
                {
                  required: true,
                  validator: (_, value) => {
                    const todate = convertDatePicker(moment().toString());
                    if (value.isAfter(todate)) {
                      return Promise.resolve();
                    } else {
                      return Promise.reject("Visit date must be later!");
                    }
                  },
                },
              ]}
            >
              <DatePicker
                style={{ width: "100%" }}
                placeholder="Visit date"
                showTime
                format={dateAdvFormat}
              />
            </Form.Item>

            <Form.Item
              name="reason"
              label="Reason"
              rules={[{ required: true, message: "Reason must not empty!" }]}
            >
              <Select
                placeholder="Select a reason"
                labelInValue
                allowClear
                onChange={(res) => {
                  handleReasonChange(res);
                }}
              >
                <Option value="Install">Server Installation</Option>
                <Option value="Uninstall">Server Removal</Option>
                <Option value="Upgrade">Server Hardware Change</Option>
                <Option value="Support">Server Support</Option>
                <Option value="Incident">Server Incident</Option>
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
                onChange={(res) => {
                  handleServerChange(res);
                }}
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
                {selectedReason === "Upgrade" || selectedReason === "Uninstall"
                  ? server
                      .filter((l) => l.status === "Working")
                      .map((l, index) => (
                        <Option
                          value={l.id}
                          title={`${l?.name} - ${l.masterIp.address}`}
                          key={index}
                        >
                          {`${l?.name} - ${l?.status}`}
                        </Option>
                      ))
                  : selectedReason === "Install"
                  ? server
                      .filter((l) => l.status === "Waiting")
                      .map((l, index) => (
                        <Option
                          value={l.id}
                          title={`${l?.name} - ${
                            l?.masterIp === null
                              ? "master IP has not assigned yet"
                              : `${l.masterIp.address}`
                          }`}
                          key={index}
                        >
                          {`${l?.name} - ${l?.status}`}
                        </Option>
                      ))
                  : server.map((l, index) => (
                      <Option
                        value={l.id}
                        title={`${l?.name} - ${
                          l?.masterIp === null
                            ? "master IP has not assigned yet"
                            : `${l.masterIp.address}`
                        }`}
                        key={index}
                      >
                        {`${l?.name} - ${l?.status}`}
                      </Option>
                    ))}
              </Select>
            </Form.Item>
            {selectedReason === "Upgrade" && (
              <>
                <Form.Item
                  name="requestUpgradeIds"
                  label="Request Upgrade"
                  labelAlign="right"
                  rules={[
                    { required: true, message: "Request must not empty!" },
                  ]}
                >
                  <Select
                    mode="multiple"
                    placeholder="Please select a request"
                    allowClear
                    onPopupScroll={async (e: any) => {
                      const { target } = e;
                      if (
                        (target as any).scrollTop +
                          (target as any).offsetHeight ===
                        (target as any).scrollHeight
                      ) {
                        if (pageIndexUp < totalPageUp) {
                          getMoreRequestUpgrade(selectedServer?.id!);
                        }
                      }
                    }}
                  >
                    {requestUpgrade
                      .filter(
                        (l) => l.status === "Waiting" || l.status === "Accepted"
                      )
                      .map((l, index) => (
                        <Option value={l.id} key={index}>
                          {`${l?.component.name} - ${l?.requestType} - ${l?.status}`}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
              </>
            )}
            {(selectedReason === "Install" ||
              selectedReason === "Uninstall") && (
              <>
                <Form.Item
                  name="requestExpandId"
                  label="Request Expand"
                  labelAlign="right"
                  rules={[
                    { required: true, message: "Request must not empty!" },
                  ]}
                >
                  <Select
                    placeholder="Please select a request"
                    allowClear
                    onPopupScroll={async (e: any) => {
                      const { target } = e;
                      if (
                        (target as any).scrollTop +
                          (target as any).offsetHeight ===
                        (target as any).scrollHeight
                      ) {
                        if (pageIndexUp < totalPageUp) {
                          getMoreRequestExpand(selectedServer?.id!);
                        }
                      }
                    }}
                  >
                    {selectedReason === "Install"
                      ? requestExpand
                          .filter(
                            (l) =>
                              l.requestType === "Expand" &&
                              (l.status === "Waiting" ||
                                l.status === "Accepted")
                          )
                          .map((l, index) => (
                            <Option value={l.id} key={index}>
                              {`Server Installation Request`}
                            </Option>
                          ))
                      : requestExpand
                          .filter(
                            (l) =>
                              l.requestType === "RemoveLocation" &&
                              l.status !== "Success" &&
                              l.removalStatus != "Failed" &&
                              l.removalStatus !== "Success"
                          )
                          .map((l, index) => (
                            <Option value={l.id} key={index}>
                              {`Server Removal Request`}
                            </Option>
                          ))}
                  </Select>
                </Form.Item>
              </>
            )}
            <Form.Item name="note" label="Note" rules={[{ max: 2000 }]}>
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

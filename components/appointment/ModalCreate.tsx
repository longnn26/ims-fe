import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Col,
  Input,
  Modal,
  Row,
  Select,
  Card,
  DatePicker,
  message,
  Space,
} from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { Form } from "antd";
import useSelector from "@hooks/use-selector";
import customerService from "@services/customer";
import serverService from "@services/serverAllocation";
import requestUpgradeService from "@services/requestUpgrade";
import requestExpandService from "@services/requestExpand";
import appointmentService from "@services/appointment";
import { AppointmentCreateModel } from "@models/appointment";
import { dateAdvFormat } from "@utils/constants";
import { ServerAllocation } from "@models/serverAllocation";
import { useSession } from "next-auth/react";
import { ParamGet, ParamGetWithId } from "@models/base";
import { areInArray, convertDatePicker, parseJwt } from "@utils/helpers";
import { RUParamGet, RequestUpgrade } from "@models/requestUpgrade";
import { RequestExpand } from "@models/requestExpand";
import moment from "moment";
import dayjs from "dayjs";
import appointment from "@services/appointment";
import incident from "@services/incident";
import { AppointmentIncidentCreateModel, Incident, IncidentParam } from "@models/incident";
const { Option } = Select;
const { confirm } = Modal;

interface Props {
  open: boolean;
  onClose: () => void;
  // loadingSubmit: boolean;
  onSubmit: () => void;
}

const ModalCreate: React.FC<Props> = (props) => {
  const formRef = useRef(null);
  const [form] = Form.useForm();
  const { onSubmit, open, onClose } = props;
  const { data: session, update: sessionUpdate } = useSession();

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [server, setServer] = useState<ServerAllocation[]>([]);
  const [requestUpgrade, setRequestUpgrade] = useState<RequestUpgrade[]>([]);
  const [requestExpand, setRequestExpand] = useState<RequestExpand | undefined>(undefined);
  const [incidentData, setIncidentData] = useState<Incident | undefined>(undefined);
  const [pageSizeCus, setPageSizeCus] = useState<number>(6);
  const [totalPageCus, setTotalPageCus] = useState<number>(2);
  const [pageIndexCus, setPageIndexCus] = useState<number>(0);
  const [totalPageUp, setTotalPageUp] = useState<number>(2);
  const [pageIndexUp, setPageIndexUp] = useState<number>(0);
  const [selectedServer, setSelectedServer] = useState<ServerAllocation>();
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [openModalCreate, setOpenModalCreate] = useState<boolean | undefined>(
    undefined
  );
  const [contactList, setContactList] = useState<string[] | undefined>(
    undefined
  );

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
    await serverService
      .getServerAllocationData(session?.user.access_token!, {
        PageIndex: pageIndexCus + 1,
        PageSize: pageSizeCus,
        //truyền param như vầy nè
        CustomerId: parseJwt(session?.user.access_token).UserId,
      } as ParamGet)
      .then(async (data) => {
        setTotalPageCus(data.totalPage);
        setPageIndexCus(data.pageIndex);
        setServer([...server, ...data.data]);
      });
  };

  const getContacts = async () => {
    await customerService
      .getCustomerById(
        session?.user.access_token!,
        parseJwt(session?.user.access_token).UserId
      )
      .then(async (data) => {
        const contacts = data.contacts
          .filter((l) => l.forAppointment === true)
          .map((contact, index) => `${contact.name} - ${contact.cccd}`);
        setContactList(contacts);
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

  const getRequestExpand = async (serverId: number) => {
    var customerId = "";
    if (session?.user.roles.includes("Customer")) {
      customerId = parseJwt(session.user.access_token).UserId;
    }
    await requestExpandService
      .getData(session?.user.access_token!, {
        PageIndex: pageIndexUp + 1,
        PageSize: pageSizeCus,
        ServerAllocationId: serverId,
        CustomerId: customerId,
      } as RUParamGet)
      .then(async (data) => {
        setRequestExpand(data.data.at(0));
      });
  };

  const getIncident = async (serverId: number) => {
    await incident
      .getData(session?.user.access_token!, {
        PageIndex: pageIndexUp + 1,
        PageSize: pageSizeCus,
        ServerAllocationId: serverId,
        IsResolved: false,
      } as unknown as IncidentParam)
      .then(async (data) => {
        setIncidentData(data.data.at(0))
      });
  };

  const resetAllLists = (count: number) => {
    if (count === 3) {
      setSelectedReason("");
      setSelectedServer(undefined);
      setServer([]);
      setRequestExpand(undefined);
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
    if (res) {
      serverService
        .getServerAllocationById(session?.user.access_token!, res.value)
        .then((server) => {
          setSelectedServer(server);
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

  const createIncidentAppointment = async (data: AppointmentIncidentCreateModel) => {
    setLoading(true);
    await appointmentService.createIncident(
      session?.user.access_token!,
      data
    ).then((res) => {
      message.success("Create successfully!", 1.5);
      form.resetFields();
      setOpenModalCreate(undefined);
      onSubmit();
    })
      .catch((errors) => {
        message.error(errors.response.data, 1.5);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    if (session) {
      getMoreServer();
      getContacts();
    }
  }, [session]);

  useEffect(() => {
    form.setFieldsValue({
      requestUpgradeIds: undefined,
      requestExpandId: undefined,
    });
    if (selectedServer) {
      if (selectedReason === "Upgrade") {
        getMoreRequestUpgrade(selectedServer?.id!, 0, []);
      }
      if (selectedReason === "Install" || "Uninstall") {
        getRequestExpand(selectedServer?.id!);
        form.setFieldsValue({ requestExpandId: requestExpand?.id });
      }
      if (selectedReason === "Incident") {
        getIncident(selectedServer.id!);
        form.setFieldsValue({ incidentId: incidentData?.id });
      }
    }
  }, [selectedServer]);

  useEffect(() => {
    resetAllLists(1);
  }, [selectedReason]);
  return (
    <>
      <Modal
        title={<span className="inline-block m-auto">Create Appointment</span>}
        open={openModalCreate === undefined ? open : openModalCreate}
        confirmLoading={confirmLoading}
        onCancel={() => {
          onClose();
          resetAllLists(3);
          setOpenModalCreate(undefined);
          form.resetFields();
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
                    if (selectedReason !== "Incident") {
                      const data = {
                        appointedCustomer: form
                          .getFieldValue("appointedCustomer")
                          ?.join(","),
                        dateAppointed: form
                          .getFieldValue("dateAppointed")
                          ?.format(dateAdvFormat),
                        reason: selectedReason,
                        note: form.getFieldValue("note"),
                        requestUpgradeIds:
                          form.getFieldValue("requestUpgradeIds"),
                        serverAllocationId: selectedServer?.id,
                        requestExpandId:
                          selectedReason === "Install" ||
                            selectedReason === "Uninstall"
                            ? requestExpand?.id
                            : undefined,
                      } as AppointmentCreateModel;
                      setLoading(true);
                      await appointmentService
                        .create(session?.user.access_token!, data)
                        .then((res) => {
                          message.success("Create successfully!", 1.5);
                          form.resetFields();
                          setOpenModalCreate(undefined);
                          onSubmit();
                        })
                        .catch((errors) => {
                          message.error(errors.response.data, 1.5);
                        })
                        .finally(() => {
                          setLoading(false);
                        });
                    } else {
                      const data = {
                        appointedCustomer: form
                          .getFieldValue("appointedCustomer")
                          ?.join(","),
                        dateAppointed: form
                          .getFieldValue("dateAppointed")
                          ?.format(dateAdvFormat),
                        note: form.getFieldValue("note"),
                        serverAllocationId: selectedServer?.id,
                        incidentId: incidentData?.id,
                      } as AppointmentIncidentCreateModel;
                      createIncidentAppointment(data);
                    }
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
            labelWrap={true}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 20 }}
            style={{ width: "100%" }}
          >
            <Form.Item
              name="appointedCustomer"
              label="Visitor"
              rules={[{ required: true }]}
            >
              {/* <Input placeholder="Visitor" allowClear /> */}
              <Select
                mode="multiple"
                placeholder="Please select visitor(s) for appointment"
                allowClear
                onChange={(selectedValues) => {
                  form.setFieldsValue({
                    appointedCustomer: selectedValues.map((value) => value),
                  });
                }}
              >
                {contactList &&
                  contactList.map((c, index) => (
                    <Option value={c} key={index}>
                      {`${c}`}
                    </Option>
                  ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="dateAppointed"
              label="Visit date"
              rules={[
                {
                  required: true,
                  validator: (_, value) => {
                    if (value.isAfter(moment())) {
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
                disabledDate={(current) => {
                  const now = dayjs();
                  const isBeforeToday = current && current.isBefore(now, "day");
                  const isToday = current && current.isSame(now, "day");
                  const isDisabledTime =
                    current &&
                    now.isSame(current, "day") &&
                    (current.hour() < 8 || current.hour() > 17);

                  return isBeforeToday || (isToday && isDisabledTime);
                }}
                disabledTime={() => ({
                  disabledHours: () => [
                    0, 1, 2, 3, 4, 5, 6, 7, 18, 19, 20, 21, 22, 23, 24,
                  ],
                })}
                format={dateAdvFormat}
                onChange={(value) =>
                  form.setFieldsValue({
                    dateAppointed: value,
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
                          title={`${l?.name} - ${l?.masterIp === null
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
                        title={`${l?.name} - ${l?.masterIp === null
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
                  label="Hardware Upgrade request"
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
            {Boolean(
              (selectedReason === "Install" ||
                selectedReason === "Uninstall") &&
              selectedServer !== undefined &&
              requestExpand !== undefined
            ) && (
                <>
                  <Form.Item
                    name="requestExpandId"
                    label="Rack Expansion request"
                    labelAlign="right"
                    labelCol={{ span: 10 }}
                    wrapperCol={{ span: 20 }}
                  >
                    <span>
                      {selectedReason === "Install"
                        ? `${selectedServer?.serialNumber} Installation`
                        : `${selectedServer?.serialNumber} Removal Request`}
                    </span>
                  </Form.Item>
                </>
              )}
            {Boolean(
              selectedReason === "Incident" &&
              selectedServer !== undefined &&
              incidentData !== undefined
            ) && (
                <>
                  <Form.Item
                    name="incidentId"
                    label="Incident"
                    labelAlign="right"
                  >
                    <span>{`Incident ${incidentData?.description}`}</span>
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

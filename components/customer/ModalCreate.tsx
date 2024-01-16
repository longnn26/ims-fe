import React, { useRef, useState } from "react";
import {
  Button,
  Col,
  Input,
  Modal,
  Row,
  Select,
  Card,
  message,
  Spin,
  DatePicker,
} from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { Form } from "antd";
import { CustomerCreateModel } from "@models/customer";
import useSelector from "@hooks/use-selector";
import customerService from "@services/customer";
import { useSession } from "next-auth/react";
import dayjs from "dayjs";
import moment from "moment";
import { dateAdvFormat } from "@utils/constants";
const { Option } = Select;
const { confirm } = Modal;

interface Props {
  open: boolean;
  onClose: () => void;
  // loadingSubmit: boolean;
  //Loading: sửa chỗ này
  onSubmit: () => void;
}

const ModalCreate: React.FC<Props> = (props) => {
  const formRef = useRef(null);
  const { data: session } = useSession();
  const [form] = Form.useForm();
  const { onSubmit, open, onClose } = props;
  const [openModalCreate, setOpenModalCreate] = useState<boolean | undefined>(
    undefined
  );

  const [confirmLoading, setConfirmLoading] = useState(false);
  //Loading: thêm biến này
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<boolean>(false);

  const disabled = async () => {
    var result = false;
    try {
      await form.validateFields();
    } catch (errorInfo) {
      result = true;
    }
    return result;
  };

  const handleFetchData = async () => {
    const taxNumber = form.getFieldValue("taxNumber");
    if (!taxNumber) {
      return;
    }

    const response = await customerService.getCompanyByTax(taxNumber);
    // form.resetFields();
    form.setFieldsValue({
      taxNumber,
      companyName: response.data.name,
      address: response.data.address,
    });
  };

  const handleContactType = (any) => {
    setSelectedType(any);
  };

  return (
    <>
      <Modal
        title={<span className="inline-block m-auto">Create customer</span>}
        open={openModalCreate === undefined ? open : openModalCreate}
        confirmLoading={confirmLoading}
        onCancel={() => {
          onClose();
          setOpenModalCreate(undefined);
          form.resetFields();
        }}
        width={600}
        footer={[
          <Button
            // loading={loadingSubmit}
            className="btn-submit"
            key="submit"
            //Loading: từ dòng này, xuống 125.
            onClick={async () => {
              if (!(await disabled()))
                confirm({
                  title: "Do you want to save?",
                  async onOk() {
                    const data = {
                      companyName: form.getFieldValue("companyName"),
                      taxNumber: form.getFieldValue("taxNumber"),
                      address: form.getFieldValue("address"),
                      email: form.getFieldValue("email"),
                      phoneNumber: form.getFieldValue("phoneNumber"),
                      representator: form.getFieldValue("representator"),
                      representatorPosition: form.getFieldValue(
                        "representatorPosition"
                      ),
                      contractNumber: form.getFieldValue("contractNumber"),
                      contacts: form.getFieldValue("contacts")
                        ? form.getFieldValue("contacts").map((item, index) => ({
                            forAppointment: form.getFieldValue([
                              "contacts",
                              index,
                              "forAppointment",
                            ]),
                            cccd: form.getFieldValue([
                              "contacts",
                              index,
                              "cccd",
                            ]),
                            name: form.getFieldValue([
                              "contacts",
                              index,
                              "name",
                            ]),
                            position: form.getFieldValue([
                              "contacts",
                              index,
                              "position",
                            ]),
                            email: form.getFieldValue([
                              "contacts",
                              index,
                              "email",
                            ]),
                            phoneNumber: form.getFieldValue([
                              "contacts",
                              index,
                              "phoneNumber",
                            ]),
                            dateContract: form
                              .getFieldValue("dateContract")
                              ?.format(dateAdvFormat),
                          }))
                        : [],
                    } as CustomerCreateModel;
                    setLoading(true);
                    await customerService
                      .createData(session?.user.access_token!, data)
                      .then((res) => {
                        message.success("Create successfully!", 1.5);
                        form.resetFields();
                        setOpenModalCreate(undefined);
                        onSubmit();
                      })
                      .catch((errors) => {
                        setOpenModalCreate(true);
                        message.error(errors.response.data, 1.5);
                      })
                      .finally(() => {
                        setLoading(false);
                      });
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
          {loading === true && (
            <>
              <Spin size="large" tip="Creating customer information...">
                <Form
                  ref={formRef}
                  form={form}
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                >
                  <Row gutter={8}>
                    <Col span={18}>
                      <Form.Item
                        label="Tax number"
                        style={{ paddingLeft: "55px" }}
                      >
                        <Input placeholder="Tax number" allowClear />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Button>Save</Button>
                    </Col>
                  </Row>
                  <Form.Item label="Company name">
                    <Input.TextArea
                      placeholder="Company name"
                      autoSize={{ minRows: 1, maxRows: 6 }}
                      allowClear
                    />
                  </Form.Item>
                  <Form.Item label="Address">
                    <Input.TextArea
                      placeholder="Address"
                      autoSize={{ minRows: 1, maxRows: 6 }}
                      allowClear
                    />
                  </Form.Item>
                  <Form.Item label="Contract number">
                    <Input placeholder="Contract number" allowClear />
                  </Form.Item>
                  <Form.Item label="Representator">
                    <Input placeholder="Representator name" allowClear />
                  </Form.Item>
                  <Form.Item label="Representator Position">
                    <Input placeholder="Representator position" allowClear />
                  </Form.Item>
                  <Form.Item label="Email">
                    <Input placeholder="Email" allowClear />
                  </Form.Item>
                  <Form.Item label="Phone number">
                    <Input placeholder="Phone number" allowClear />
                  </Form.Item>

                  <Button type="dashed">+ Add Contact</Button>
                </Form>
              </Spin>
            </>
          )}
          {loading === false && (
            <>
              <Form
                ref={formRef}
                form={form}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 20 }}
                style={{ width: "110%" }}
              >
                <Row gutter={8}>
                  <Col span={18}>
                    <Form.Item
                      name="taxNumber"
                      label="Tax number"
                      rules={[
                        {
                          required: true,
                        },
                        {
                          pattern: /^\d{10,13}$/,
                          message: "Tax number is invalid!",
                        },
                      ]}
                      style={{ paddingLeft: "60px" }}
                    >
                      <Input placeholder="Tax number" allowClear />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Button key="fetchData" onClick={handleFetchData}>
                      Save
                    </Button>
                  </Col>
                </Row>
                <Form.Item
                  name="companyName"
                  label="Company name"
                  rules={[{ required: true, min: 6, max: 2000 }]}
                >
                  <Input.TextArea
                    placeholder="Company name"
                    autoSize={{ minRows: 1, maxRows: 6 }}
                    allowClear
                  />
                </Form.Item>
                <Form.Item
                  name="address"
                  label="Address"
                  rules={[{ required: true, min: 6, max: 2000 }]}
                >
                  <Input.TextArea
                    placeholder="Address"
                    autoSize={{ minRows: 1, maxRows: 6 }}
                    allowClear
                  />
                </Form.Item>
                <Form.Item
                  name="contractNumber"
                  label="Contract number"
                  rules={[
                    { required: true, min: 3, max: 4 },
                    {
                      pattern: /^\d{3,4}$/,
                      message: "Contract number is invalid!",
                    },
                  ]}
                >
                  <Input placeholder="Contract number" allowClear />
                </Form.Item>

                <Form.Item
                  name="dateContact"
                  label="Contract Signing Date"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    placeholder="Contract date"
                    showTime
                    format={dateAdvFormat}
                    onChange={(value) =>
                      form.setFieldsValue({
                        dateAppointed: value,
                      })
                    }
                  />
                </Form.Item>

                <Form.Item
                  name="representator"
                  label="Representator"
                  rules={[{ required: true, min: 6, max: 255 }]}
                >
                  <Input placeholder="Representator name" allowClear />
                </Form.Item>
                <Form.Item
                  name="representatorPosition"
                  label="Representator Position"
                  rules={[{ required: true, min: 6, max: 255 }]}
                >
                  <Input placeholder="Representator position" allowClear />
                </Form.Item>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your email address",
                    },
                    {
                      pattern:
                        /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
                      message: "Please enter a valid email address",
                    },
                    {
                      min: 6,
                      max: 255,
                      message: "Email must be between 6 and 255 characters",
                    },
                  ]}
                >
                  <Input placeholder="Email" allowClear />
                </Form.Item>
                <Form.Item
                  name="phoneNumber"
                  label="Phone number"
                  rules={[
                    {
                      required: true,
                      message: "Please enter staff phone number",
                    },
                    {
                      pattern:
                        /^(0|84)(2(0[3-9]|1[0-689]|2[0-25-9]|3[2-9]|4[0-9]|5[124-9]|6[0369]|7[0-7]|8[0-9]|9[012346789])|3[2-9]|5[25689]|7[06-9]|8[0-9]|9[012346789])([0-9]{7})$/gm,
                      message: "Please enter a valid phone number",
                    },
                  ]}
                >
                  <Input placeholder="Phone number" allowClear />
                </Form.Item>
                <Form.List name="contacts">
                  {(fields, { add, remove }) => (
                    <div
                      style={{
                        display: "flex",
                        rowGap: 16,
                        flexDirection: "column",
                      }}
                    >
                      {fields.map((field) => (
                        <Card
                          size="small"
                          title={`Contact ${field.name + 1}`}
                          key={field.key}
                          extra={
                            <CloseOutlined
                              onClick={() => {
                                remove(field.name);
                              }}
                            />
                          }
                        >
                          <Form.Item
                            label="Registration type"
                            name={[field.name, "forAppointment"]}
                            rules={[{ required: true }]}
                          >
                            <Select
                              placeholder="Contact Type"
                              allowClear
                              onChange={(res) => handleContactType(res)}
                            >
                              <Option value={true}>Permission to visit DC</Option>
                              <Option value={false}>Informative contact</Option>
                            </Select>
                          </Form.Item>
                          {form.getFieldValue([
                            "contacts",
                            field.name,
                            "forAppointment",
                          ]) === true && (
                            <>
                              <Form.Item
                                label="Citizen  Identification"
                                name={[field.name, "cccd"]}
                                rules={[
                                  { required: true },
                                  {
                                    pattern: /^\d{12}$/,
                                    message: "Citizen ID must be 12 numbers!",
                                  },
                                ]}
                              >
                                <Input placeholder="Citizen ID" allowClear />
                              </Form.Item>
                            </>
                          )}
                          <Form.Item
                            label="Full Name"
                            name={[field.name, "name"]}
                            rules={[{ required: true, min: 8, max: 255 }]}
                          >
                            <Input.TextArea
                              autoSize={{ minRows: 1, maxRows: 6 }}
                              allowClear
                              placeholder="Full Name"
                            />
                          </Form.Item>
                          <Form.Item
                            label="Email"
                            name={[field.name, "email"]}
                            rules={[
                              {
                                required: true,
                                message: "Please enter your email address",
                              },
                              {
                                pattern:
                                  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
                                message: "Please enter a valid email address",
                              },
                              {
                                min: 6,
                                max: 255,
                                message:
                                  "Email must be between 6 and 255 characters",
                              },
                            ]}
                          >
                            <Input allowClear placeholder="Email" />
                          </Form.Item>
                          <Form.Item
                            label="Phone Number"
                            name={[field.name, "phoneNumber"]}
                            rules={[
                              { required: true },
                              {
                                pattern:
                                  /^(0|84)(2(0[3-9]|1[0-689]|2[0-25-9]|3[2-9]|4[0-9]|5[124-9]|6[0369]|7[0-7]|8[0-9]|9[012346789])|3[2-9]|5[25689]|7[06-9]|8[0-9]|9[012346789])([0-9]{7})$/gm,
                                message: "Please enter a valid phone number",
                              },
                            ]}
                          >
                            <Input allowClear placeholder="Phone Number" />
                          </Form.Item>
                          <Form.Item
                            label="Position"
                            name={[field.name, "position"]}
                            rules={[{ min: 8, max: 255 }]}
                          >
                            <Input.TextArea
                              autoSize={{ minRows: 1, maxRows: 6 }}
                              allowClear
                              placeholder="Position"
                            />
                          </Form.Item>
                        </Card>
                      ))}

                      <Button
                        type="dashed"
                        onClick={() => {
                          add();
                          setSelectedType(false);
                        }}
                        block
                      >
                        + Add Contact
                      </Button>
                    </div>
                  )}
                </Form.List>
              </Form>
            </>
          )}
        </div>
      </Modal>
    </>
  );
};

export default ModalCreate;

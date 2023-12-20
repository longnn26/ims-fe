import React, { useEffect, useRef, useState } from "react";
import { Button, Input, Modal, Select, Card, Row, Col } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { Form } from "antd";
import { CustomerUpdateModel, Customer } from "@models/customer";
import customerService from "@services/customer";
import useSelector from "@hooks/use-selector";
const { Option } = Select;
const { confirm } = Modal;

interface Props {
  customer: Customer;
  onClose: () => void;
  onSubmit: (data: CustomerUpdateModel) => void;
}

const ModalUpdate: React.FC<Props> = (props) => {
  const formRef = useRef(null);
  const [form] = Form.useForm();
  const { onSubmit, customer, onClose } = props;

  const [confirmLoading, setConfirmLoading] = useState(false);
  const { companyTypeList } = useSelector((state) => state.companyType);

  const disabled = async () => {
    var result = false;
    try {
      await form.validateFields();
    } catch (errorInfo) {
      result = true;
    }
    return result;
  };

  const showAll = () => {
    const contacts = form.getFieldValue("contacts");
  };

  const setFieldsValueInitial = () => {
    let contacts;
    if (customer.contacts) {
    contacts = customer.contacts.map(
      (contact, index) => ({
        name: contact.name,
        position: contact.position,
        email: contact.email,
        phoneNumber: contact.phoneNumber,
      })
    );
    }

    if (formRef.current)
      form.setFieldsValue({
        id: customer.id,
        companyName: customer.companyName,
        address: customer.address,
        taxNumber: customer.taxNumber,
        email: customer.email,
        phoneNumber: customer.phoneNumber,
        representator: customer.representator,
        representatorPosition: customer.representatorPosition,
        contractNumber: customer.contractNumber,
        contacts: contacts || [],
      });
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

  useEffect(() => {
    // refresh after submit for fileList
    if (customer) {
      setFieldsValueInitial();
      showAll();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer]);

  return (
    <>
      <Modal
        title={<span className="inline-block m-auto">Update customer</span>}
        open={Boolean(customer)}
        confirmLoading={confirmLoading}
        onCancel={() => {
          onClose();
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
                      id: form.getFieldValue("id"),
                      companyName: form.getFieldValue("companyName"),
                      taxNumber: form.getFieldValue("taxNumber"),
                      address: form.getFieldValue("address"),
                      email: form.getFieldValue("email"),
                      phoneNumber: form.getFieldValue("phoneNumber"),
                      representator: form.getFieldValue("representator"),
                      representatorPosition: form.getFieldValue("representatorPosition"),
                      contractNumber: form.getFieldValue("contractNumber"),
                      contacts: form
                      .getFieldValue("contacts")
                      .map((item, index) => ({
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
                      })),
                    });
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
            <Row gutter={8}>
              <Col span={18}>
                <Form.Item
                  name="taxNumber"
                  label="Tax number"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                  style={{ paddingLeft: "55px" }}
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
              rules={[{ required: true }]}
            >
              <Input placeholder="Company name" allowClear />
            </Form.Item>
            <Form.Item
              name="address"
              label="Address"
              rules={[{ required: true }]}
            >
              <Input placeholder="Address" allowClear />
            </Form.Item>
            <Form.Item
              name="contractNumber"
              label="Contract number"
              rules={[{ required: true }]}
            >
              <Input placeholder="Contract number" allowClear />
            </Form.Item>
            <Form.Item
              name="representator"
              label="Representator"
              rules={[{ required: true }]}
            >
              <Input placeholder="Representator name" allowClear />
            </Form.Item>
            <Form.Item
              name="representatorPosition"
              label="Representator Position"
              rules={[{ required: true }]}
            >
              <Input placeholder="Representator position" allowClear />
            </Form.Item>
            <Form.Item name="email" label="Email" rules={[{ required: true }]}>
              <Input placeholder="Email" allowClear />
            </Form.Item>
            <Form.Item
              name="phoneNumber"
              label="Phone number"
              rules={[{ required: true }]}
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
                        label="Name"
                        name={[field.name, "name"]}
                        rules={[{ required: true, min: 8, max: 255 }]}
                      >
                        <Input.TextArea
                          autoSize={{ minRows: 1, maxRows: 6 }}
                          allowClear
                          placeholder="Name"
                        />
                      </Form.Item>
                      <Form.Item
                        label="Position"
                        name={[field.name, "position"]}
                        rules={[{ required: true, min: 8, max: 255 }]}
                      >
                        <Input.TextArea
                          autoSize={{ minRows: 1, maxRows: 6 }}
                          allowClear
                          placeholder="Position"
                        />
                      </Form.Item>
                      <Form.Item
                        label="Email"
                        name={[field.name, "email"]}
                        rules={[{ required: true } , { max: 2000 }]}
                      >
                        <Input allowClear placeholder="Email" />
                      </Form.Item>
                      <Form.Item
                        label="Phone Number"
                        name={[field.name, "phoneNumber"]}
                        rules={[ 
                          { required: true, message: 'Please enter staff phone number' },
                          {
                              pattern: /^(0|84)(2(0[3-9]|1[0-689]|2[0-25-9]|3[2-9]|4[0-9]|5[124-9]|6[0369]|7[0-7]|8[0-9]|9[012346789])|3[2-9]|5[25689]|7[06-9]|8[0-9]|9[012346789])([0-9]{7})$/gm,
                              message: 'Please enter a valid phone number',
                          },
                        ]}
                      >
                        <Input allowClear placeholder="Phone Number" />
                      </Form.Item>
                    </Card>
                  ))}

                  <Button type="dashed" onClick={() => add()} block>
                    + Add Contact
                  </Button>
                </div>
              )}
            </Form.List>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default ModalUpdate;

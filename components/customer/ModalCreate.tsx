import React, { useRef, useState } from "react";
import { Button, Input, Modal, Select } from "antd";
import { Form } from "antd";
import { CustomerCreateModel } from "@models/customer";
import useSelector from "@hooks/use-selector";
const { Option } = Select;
const { confirm } = Modal;

interface Props {
  open: boolean;
  onClose: () => void;
  // loadingSubmit: boolean;
  onSubmit: (data: CustomerCreateModel) => void;
}

const ModalCreate: React.FC<Props> = (props) => {
  const formRef = useRef(null);
  const [form] = Form.useForm();
  const { onSubmit, open, onClose } = props;

  const [confirmLoading, setConfirmLoading] = useState(false);

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

    const response = await fetch(`https://api.vietqr.io/v2/business/${taxNumber}`);
    const data = await response.json();
    form.resetFields();
    form.setFieldsValue({
      taxNumber,
      companyName: data.data.name,
      address: data.data.address,
    });
  }

  return (
    <>
      <Modal
        title={<span className="inline-block m-auto">Create customer</span>}
        open={open}
        confirmLoading={confirmLoading}
        onCancel={() => {
          onClose();
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
                    console.log(form.getFieldValue("taxNumber"));
                    console.log(form.getFieldValue("companyName"));
                    console.log(form.getFieldValue("address"));
                    console.log(form.getFieldValue("email"));
                    console.log(form.getFieldValue("phoneNumber"));
                    onSubmit({
                      companyName: form.getFieldValue("companyName"),
                      address: form.getFieldValue("address"),
                      taxNumber: form.getFieldValue("taxNumber"),
                      email: form.getFieldValue("email"),
                      phoneNumber: form.getFieldValue("phoneNumber"),
                    } as CustomerCreateModel);
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
              name="taxNumber"
              label="Tax number"
              rules={[{ required: true }]}
            >
              <Input placeholder="Tax number" allowClear />
            </Form.Item>
            <Form.Item
            name="button"
              label="Save"
            >
            <Button key="fetchData" onClick={handleFetchData}>Save</Button>
            </Form.Item>
            <Form.Item
              name="companyName"
              label="Company name"
            >
              <Input placeholder="Company name" readOnly disabled/>
            </Form.Item>
            <Form.Item
              name="address"
              label="Address"
            >
              <Input placeholder="Address" readOnly disabled/>
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
            {/* <Form.Item
              name="customerName"
              label="Customer name"
              rules={[{ required: true }]}
            >
              <Input placeholder="Customer name" allowClear />
            </Form.Item> */}
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default ModalCreate;

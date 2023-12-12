import React, { useRef, useState } from "react";
import { Button, Input, Modal, Select } from "antd";
import { Form } from "antd";
import { CustomerCreateModel } from "@models/customer";
import useSelector from "@hooks/use-selector";
import customerService from "@services/customer";
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

    const response = await customerService.getCompanyByTax(taxNumber);
    form.resetFields();
    form.setFieldsValue({
      taxNumber,
      companyName: response.data.name,
      address: response.data.address,
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
            
            <Button key="fetchData" onClick={handleFetchData} style={{float:'right'}}>Search</Button>
            <Form.Item
              name="taxNumber"
              label="Tax number"
              rules={[{ required: true }]}
            >
              <Input placeholder="Tax number" allowClear />
            </Form.Item>
            <Form.Item
              name="companyName"
              label="Company name"
            >
              <Input placeholder="Company name" allowClear/>
            </Form.Item>
            <Form.Item
              name="address"
              label="Address"
            >
              <Input placeholder="Address" allowClear/>
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

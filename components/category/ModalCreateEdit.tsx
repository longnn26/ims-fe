import React, { useRef } from "react";
import { Button, Input, Modal } from "antd";
import { Form } from "antd";
import { CategoryCreate } from "@models/category";
const { confirm } = Modal;

interface Props {
  parentCategoryId?: string;
  open: boolean;
  setOpen: (data: boolean) => void;
  onSubmit: (data: CategoryCreate) => void;
}

const ModalCreate: React.FC<Props> = (props) => {
  const formRef = useRef(null);
  const [form] = Form.useForm();
  const { open, onSubmit, setOpen, parentCategoryId } = props;

  const handleCancel = () => {
    form.resetFields();
    setOpen(false);
  };

  const disabled = async () => {
    var result = false;
    try {
      await form.validateFields();
    } catch (errorInfo) {
      result = true;
    }
    return result;
  };

  return (
    <>
      <Modal
        title={<span className="inline-block m-auto">Category</span>}
        open={open}
        onCancel={handleCancel}
        footer={[
          <Button
            className="btn-submit"
            key="submit"
            onClick={async () => {
              if (!(await disabled()))
                confirm({
                  title: "Do you want to save?",
                  async onOk() {
                    onSubmit({
                      name: form.getFieldValue("name"),
                      parentCategoryId: parentCategoryId,
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
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: "Category not empty" }]}
            >
              <Input placeholder="Category name" allowClear />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default ModalCreate;

import React, { useEffect, useRef, useState } from "react";
import { Alert, Button, Input, Modal, Space, Tabs, TabsProps } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { Form } from "antd";
import {
  RequestExpandUpdateModel,
  RequestExpand,
  SuggestLocation,
  RequestedLocation,
} from "@models/requestExpand";
import { RequestHost } from "@models/requestHost";
const { confirm } = Modal;

interface Props {
  requestHost: RequestHost;
  suggestLocation?: SuggestLocation;
  onClose: () => void;
  onSubmit: (data: RequestExpandUpdateModel) => void;
  onSaveLocation: (data: RequestedLocation) => void;
}

const ModalUpdate: React.FC<Props> = (props) => {
  const formRef = useRef(null);
  const [form] = Form.useForm();
  const { onSubmit, requestHost, onClose, suggestLocation, onSaveLocation } =
    props;

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

  const setFieldsValueInitial = () => {
    if (formRef.current)
      form.setFieldsValue({
        id: requestHost.id,
        note: requestHost.note,
        techNote: requestHost.techNote,
        saleNote: requestHost.saleNote,
        quantity: requestHost.quantity,
        type: requestHost.type,
        // location: `${suggestLocation?.areaId} - ${suggestLocation?.rackId} - ${suggestLocation?.position}`,
      });
  };

  useEffect(() => {
    // refresh after submit for fileList
    if (requestHost) {
      setFieldsValueInitial();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestHost]);

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Information",
      children: (
        <>
          <div className="flex max-w-md flex-col gap-4 m-auto">
            <Form
              ref={formRef}
              form={form}
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ width: "100%" }}
            >
              <Form.Item
                name="size"
                label="Size"
                rules={[
                  { required: true },
                  {
                    pattern: new RegExp(/^[0-9]+$/),
                    message: "Size must be a number greater than 0",
                  },
                ]}
              >
                <Input placeholder="Size" allowClear />
              </Form.Item>
              <Form.Item name="note" label="Note">
                <Input placeholder="Note" allowClear />
              </Form.Item>
              <Form.Item name="techNote" label="Tech Note">
                <Input placeholder="Tech Note" allowClear />
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
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
                            size: Number.parseInt(form.getFieldValue("size")),
                            note: form.getFieldValue("note"),
                            techNote: form.getFieldValue("techNote"),
                          } as RequestExpandUpdateModel);
                          // form.resetFields();
                        },
                        onCancel() {},
                      });
                  }}
                >
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </div>
        </>
      ),
    },
    {
      key: "2",
      label: "Location",
      children: (
        <>
          <Space direction="vertical" style={{ width: "100%" }}>
            {Boolean(suggestLocation) && (
              <Alert
                message="Suggest location"
                description={`${suggestLocation?.area.name} - ${suggestLocation?.rack.id} - ${suggestLocation?.position}`}
                type="success"
                showIcon
                action={
                  <Button
                    size="small"
                    type="text"
                    icon={<SaveOutlined />}
                    onClick={() => {
                      onSaveLocation({
                        rackId: suggestLocation?.rack.id!,
                        startPosition: suggestLocation?.position!,
                      });
                    }}
                  >
                    Save
                  </Button>
                }
              />
            )}
          </Space>
        </>
      ),
    },
  ];

  return (
    <>
      <Modal
        title={
          <span className="inline-block m-auto">Update request expand</span>
        }
        open={Boolean(requestHost)}
        confirmLoading={confirmLoading}
        onCancel={() => {
          onClose();
        }}
        footer={[]}
      >
        <Tabs defaultActiveKey="1" items={items} />
      </Modal>
    </>
  );
};

export default ModalUpdate;

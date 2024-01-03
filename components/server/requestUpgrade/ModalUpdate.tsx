"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button, Input, Modal, Select, Card, message } from "antd";
import { Form } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import useSelector from "@hooks/use-selector";
import {
  RequestUpgrade,
  RequestUpgradeUpdateModel,
} from "@models/requestUpgrade";
import requestUpgradeService from "@services/requestUpgrade";
import { useSession } from "next-auth/react";
import { areInArray } from "@utils/helpers";
import { ROLE_CUSTOMER, ROLE_SALES, ROLE_TECH } from "@utils/constants";
const { Option } = Select;
const { confirm } = Modal;

interface Props {
  open: boolean;
  requestUpgrade: RequestUpgrade;
  onClose: () => void;
  onSubmit: () => void;
}

const ModalUpdate: React.FC<Props> = (props) => {
  const formRef = useRef(null);
  const { data: session } = useSession();
  const [form] = Form.useForm();
  const { onSubmit, requestUpgrade, onClose, open } = props;

  const [confirmLoading, setConfirmLoading] = useState(false);
  const { componentOptions } = useSelector((state) => state.component);
  const [loading, setLoading] = useState<boolean>(false);
  const [openModalUpdate, setOpenModalUpdate] = useState<boolean | undefined>(undefined);

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
    if (formRef.current) {
      form.setFieldsValue({
        description: requestUpgrade.description,
        note: requestUpgrade.note,
        saleNote: requestUpgrade.saleNote,
        techNote: requestUpgrade.techNote,
      });
    }
  };

  useEffect(() => {
    // refresh after submit for fileList
    if (requestUpgrade && formRef.current) {
      setFieldsValueInitial();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestUpgrade]);

  return (
    <>
      <Modal
        title={
          <span className="inline-block m-auto">Update Hardware Upgrade request</span>
        }
        open={openModalUpdate === undefined ? open : openModalUpdate}
        confirmLoading={confirmLoading}
        onCancel={() => {
          onClose();
          setOpenModalUpdate(undefined);
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
                    const formData = {
                      id: requestUpgrade.id,
                      description: form.getFieldValue("description"),
                      note: form.getFieldValue("note") ? form.getFieldValue("note") : requestUpgrade.note,
                      techNote: form.getFieldValue("techNote") ? form.getFieldValue("techNote") : requestUpgrade.techNote,
                      saleNote: form.getFieldValue("saleNote") ? form.getFieldValue("saleNote") : requestUpgrade.saleNote,
                    } as RequestUpgradeUpdateModel;
                    await setLoading(true);
                    await requestUpgradeService
                    .updateData(session?.user.access_token!, formData)
                    .then((res) => {
                      message.success("Update successfully!");
                      form.resetFields();
                      setOpenModalUpdate(undefined);
                      onClose();
                    })
                    .catch((errors) => {
                      setOpenModalUpdate(true);
                      message.error(errors.response.data);
                    })
                    .finally(() => {
                      onSubmit();
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
          <Form
            ref={formRef}
            form={form}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ width: "100%" }}
            name="dynamic_form_complex"
          >
            <Form.Item
              name="component"
              label="Component"
              rules={[
                { required: true, message: "Please select a hardware type." },
              ]}
            >
              <Select
                allowClear
                placeholder="Select a hardware type."
              >
                <Option value={1}>CPU</Option>
                <Option value={2}>Memory</Option>
                <Option value={3}>Storage</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Description"
              name="descrition"
              rules={[{ required: true, min: 6, max: 2000 }]}
            >
              <Input allowClear placeholder="Description" />
            </Form.Item>
            {areInArray(session?.user.roles!, ROLE_CUSTOMER) && (
              <Form.Item
                label="Note"
                name="note"
                rules={[{ max: 2000 }]}
              >
                <Input allowClear placeholder="Note" />
              </Form.Item>
            )}
            {areInArray(session?.user.roles!, ROLE_SALES) && (
              <Form.Item
                label="Note"
                name="saleNote"
                rules={[{ required: true, max: 2000 }]}
              >
                <Input allowClear placeholder="Note" />
              </Form.Item>
            )}
            {areInArray(session?.user.roles!, ROLE_TECH) && (
              <Form.Item
                label="Note"
                name="techNote"
                rules={[{required: true, max: 2000 }]}
              >
                <Input allowClear placeholder="Note" />
              </Form.Item>
            )}
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default ModalUpdate;

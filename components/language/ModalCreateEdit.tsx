import React, { useEffect, useRef, useState } from "react";
import { Button, Input, Modal } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import UploadComponent from "@components/uploadComponent/UploadComponent";
import { Language, LanguageCreateOrEdit } from "@models/language";
import { url } from "@utils/api-links";
import { Form, Select } from "antd";
import { optionStatus } from "@utils/constants";
const { confirm } = Modal;

interface Props {
  language: Language;
  loadingSubmit: boolean;
  setLanguageEdit: (data: Language | undefined) => void;
  onSubmit: (languge: LanguageCreateOrEdit) => void;
}

const ModalCreateEdit: React.FC<Props> = (props) => {
  const formRef = useRef(null);
  const [form] = Form.useForm();
  const { language, setLanguageEdit, onSubmit, loadingSubmit } = props;

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleCancel = () => {
    setFileList([]);
    form.resetFields();
    setLanguageEdit(undefined);
  };

  const setFieldsValueInitial = () => {
    if (formRef.current)
      form.setFieldsValue({
        name: language.name,
        description: language.description,
        status: language?.status
          ? {
              value: language?.status,
              label: language?.status,
            }
          : undefined,
      });
    if (language?.image) {
      const file = {
        uid: language?.id,
        name: language?.image,
        status: "done",
        url: `${url}/${language.parentFolder}/${language?.image}`,
      } as UploadFile;
      setFileList([file]);
    }
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

  useEffect(() => {
    // refresh after submit for fileList
    !Boolean(language) && setFileList([]);
    if (language) {
      setFieldsValueInitial();
    }
  }, [language]);

  return (
    <>
      <Modal
        title={<span className="inline-block m-auto">Language</span>}
        open={Boolean(language)}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        footer={[
          <Button
            loading={loadingSubmit}
            className="btn-submit"
            key="submit"
            onClick={async () => {
              if (!(await disabled()))
                confirm({
                  title: "Do you want to save?",
                  async onOk() {
                    onSubmit({
                      id: language.id,
                      name: form.getFieldValue("name"),
                      description: form.getFieldValue("description"),
                      status: form.getFieldValue("status").value,
                      image: language.image,
                      fileList: fileList,
                    } as LanguageCreateOrEdit);
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
              rules={[{ required: true, message: "Language not empty" }]}
            >
              <Input placeholder="Language name" allowClear />
            </Form.Item>
            <Form.Item name="description" label="Description">
              <Input placeholder="Language description" allowClear />
            </Form.Item>
            <Form.Item
              name="status"
              label="Status"
              labelAlign="right"
              rules={[{ required: true, message: "Status not empty" }]}
            >
              <Select labelInValue allowClear options={optionStatus} />
            </Form.Item>
          </Form>

          <UploadComponent
            fileList={fileList}
            setFileList={setFileList}
            onlyImage={true}
          ></UploadComponent>
        </div>
      </Modal>
    </>
  );
};

export default ModalCreateEdit;

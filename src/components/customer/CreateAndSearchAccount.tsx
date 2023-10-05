"use client";
import React, { useState } from "react";
import { Button, Form, Input, Modal, Tabs } from "antd";
import Search from "antd/es/input/Search";
import CreateOneAccount from "./CreateOneAccount";
import CreateMoreAccount from "./CreateMoreAccount";

const { TabPane } = Tabs;

interface Values {
  title: string;
  description: string;
  modifier: string;
}

interface CollectionCreateFormProps {
  open: boolean;
  onCreate: (values: Values) => void;
  onCancel: () => void;
}

const onChange = (key: string) => {
  console.log(key);
};

const CreateModalForm: React.FC<CollectionCreateFormProps> = ({
  open,
  onCreate,
  onCancel,
}) => {
  const [form] = Form.useForm();
  return (
    <Modal
      open={open}
      title={<h2 style={{ textAlign: "center" }}>Tạo Tài Khoản Mới</h2>}
      okText="Create"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onCreate(values);
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
    >
      <Tabs defaultActiveKey="1" centered onChange={onChange}>
        <TabPane key={"1"} tab="Một">
          <CreateOneAccount />
        </TabPane>
        <TabPane key={"2"} tab="Nhiều">
          <CreateMoreAccount />
        </TabPane>
      </Tabs>
    </Modal>
  );
};

const CreateAndSearchAccount: React.FC = () => {
  const [open, setOpen] = useState(false);

  const onCreate = (values: any) => {
    console.log("Received values of form: ", values);
    setOpen(false);
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <Button
        type="primary"
        onClick={() => {
          setOpen(true);
        }}
      >
        Tạo Tài Khoản Mới
      </Button>
      <CreateModalForm
        open={open}
        onCreate={onCreate}
        onCancel={() => {
          setOpen(false);
        }}
      />
      <div style={{ display: "flex", alignItems: "center" }}>
        <strong>Tìm kiếm khách hàng:</strong>{" "}
        <Search
          placeholder="Tìm kiếm"
          allowClear
          style={{
            marginLeft: "15px",
            width: 300,
          }}
        />
      </div>
    </div>
  );
};

export default CreateAndSearchAccount;

"use client";

import React from "react";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { Button, Upload } from "antd";
import { Typography } from "antd";

const { Title, Text } = Typography;

const props: UploadProps = {
  action: "//jsonplaceholder.typicode.com/posts/",
  listType: "picture",
  previewFile(file) {
    console.log("Your upload file:", file);
    // Your process logic. Here we just mock to the same file
    return fetch("", {
      method: "POST",
      body: file,
    })
      .then((res) => res.json())
      .then(({ thumbnail }) => thumbnail);
  },
};

const CreateMoreAccount: React.FC = () => (
  <>
    <Title type="danger" style={{ textAlign: "center" }} level={3}>
      Thêm Nhiều Tài Khoản Mới
    </Title>
    <div style={{ textAlign: "center", paddingBottom: "15px" }}>
      <Text type="warning" strong>
        Sử dụng file Excel để thêm nhiều tài khoản
      </Text>
    </div>
    <div style={{ textAlign: "center" }}>
      <Upload {...props}>
        <Button icon={<UploadOutlined />}>Upload</Button>
      </Upload>
    </div>
  </>
);

export default CreateMoreAccount;

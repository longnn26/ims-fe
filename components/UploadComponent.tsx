"use client";
import { useState } from "react";

import { InboxOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import { Upload, message } from "antd";
interface Props {
  fileList: UploadFile[];
  title: string;
  multiple: boolean;
  maxCount: number;
  setFileList: (fileList: UploadFile[]) => void;
  disabled: (value: boolean) => void;
}

const { Dragger } = Upload;

const UploadComponent: React.FC<Props> = (props) => {
  const { setFileList, multiple, maxCount, title, fileList, disabled } = props;
  const beforeUpload = (file) => {
    const isJPEG = file.type === "image/jpeg";
    const isPDF = file.type === "application/pdf";
    const isDOCX =
      file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    const isDOC = file.type === "application/msword";
    if (!isJPEG && !isPDF && !isDOCX && !isDOC) {
      disabled(true);
      message.error(
        `System only accepts files with the following extensions: .pdf, .docx, .doc, .jpeg`
      );
    } else {
      disabled(false);
    }
    return isJPEG && isPDF && isDOCX && isDOC;
  };

  const onChange = (info) => {
    const { status } = info.file;
    if (status !== "uploading") {
      setFileList(info.fileList);
    }
    // if (status === "done") {
    //   message.success(`${info.file.name} file uploaded successfully.`);
    // } else if (status === "error") {
    //   message.error(`${info.file.name} file upload failed.`);
    // }
  };

  const onDrop = (e) => {
    // setFileList(e.dataTransfer.files);
  };

  return (
    <div className="">
      <Dragger
        beforeUpload={beforeUpload}
        onChange={onChange}
        onDrop={onDrop}
        name="file"
        multiple={multiple}
        maxCount={maxCount}
        fileList={fileList}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-drag-icon">{/* <InboxOutlined /> */}</p>
        <p className="ant-upload-text">{title}</p>

        <p className="ant-upload-hint">
          Click or drag file to this area to upload
        </p>
      </Dragger>
    </div>
  );
};

export default UploadComponent;

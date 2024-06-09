"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  Button,
  Input,
  Modal,
  message,
  Checkbox,
  CheckboxProps,
  Divider,
  UploadFile,
  UploadProps,
  Spin,
  Upload,
} from "antd";
import { Form } from "antd";
import useSelector from "@hooks/use-selector";
import { useSession } from "next-auth/react";
const { confirm } = Modal;
import useDispatch from "@hooks/use-dispatch";
import { BrandCarType } from "@models/car";
import { getBrandLogoPath } from "@utils/helpers";
import { CiEdit } from "react-icons/ci";
import { BiPlus, BiTrash } from "react-icons/bi";
import { RcFile } from "antd/es/upload";
import { TypeOptions, toast } from "react-toastify";
import carService from "@services/car";
import { urlImageLinkHost } from "@utils/api-links";
const { Dragger } = Upload;

interface Props {
  open: boolean;
  onClose: () => void;
  dataBrandList: BrandCarType[];
  setDataBrandList: React.Dispatch<React.SetStateAction<BrandCarType[]>>;
  onSubmit: () => void;
}

const contentStyle: React.CSSProperties = {
  padding: 50,
  borderRadius: 4,
};

const content = <div style={contentStyle} />;

const ModalManageBrandVehicle: React.FC<Props> = (props) => {
  const formRef = useRef(null);
  const dispatch = useDispatch();

  const { data: session } = useSession();
  const [form] = Form.useForm();
  const { onSubmit, open, onClose, dataBrandList, setDataBrandList } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [editBrand, setEditBrand] = useState<BrandCarType | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleOpenEditMode = (brand: BrandCarType) => {
    setEditBrand(brand);
    form.setFieldsValue(brand);
    setFileList([
      {
        uid: "-1",
        name: "image.png",
        status: "done",
        url: `${urlImageLinkHost + brand.brandImg}`,
      },
    ]);
  };

  const handleOpenAddMode = () => {
    setEditBrand(null);
    setIsAdding(true);
    form.resetFields();
    setFileList([]);
  };

  const handleSave = () => {
    form.validateFields().then(async (values) => {
      setLoadingSubmit(true);
      if (!editBrand) {
        //thêm
        await carService
          .addNewBrand(session?.user.access_token!, {
            brandName: form.getFieldValue("brandName"),
            file: fileList[0].originFileObj,
          })
          .then((res) => {
            const newBrand = { ...res };
            console.log("newBrand", newBrand);
            setDataBrandList([...dataBrandList, newBrand]);

            toast(`Thêm mới hãng xe thành công!`, {
              type: "success" as TypeOptions,
              position: "top-right",
            });
            form.resetFields();
          })
          .catch((errors) => {
            console.log("errors add brand: ", errors);
          })
          .finally(() => {
            setLoadingSubmit(false);
          });
      } else {
        //edit

        await carService
          .updateSelectedBrand(session?.user.access_token!, {
            brandVehicleId: editBrand?.id,
            brandName: form.getFieldValue("brandName"),
            file: fileList[0].originFileObj,
          })
          .then((res) => {

            const updatedList = dataBrandList.map((brand) =>
              //   brand.id === editBrand?.id ? { ...brand, ...values, brandImg } : brand
              brand.id === editBrand?.id ? { ...brand, ...res } : brand
            );

            setDataBrandList(updatedList);
            toast(`Cập nhập thành công!`, {
              type: "success" as TypeOptions,
              position: "top-right",
            });
            form.resetFields();
          })
          .catch((errors) => {
            console.log("errors edit brand: ", errors);
          })
          .finally(() => {
            setLoadingSubmit(false);
          });

       
      }
      setEditBrand(null);
      setIsAdding(false);
      form.resetFields();
      setFileList([]);
    });
  };

  const handleDeleteBrand = (brand: BrandCarType) => {
    confirm({
      cancelText: "Hủy",
      okText: "Xác nhận",
      title: "Bạn có chắc muốn xóa nhãn hiệu này ra khỏi hệ thống?",
      async onOk() {
        try {
          setLoadingSubmit(true);

          await carService.deleteSelectedBrand(
            session?.user.access_token!,
            brand.id ?? ""
          );

          const updatedBrandList = dataBrandList.filter(
            (item) => item.id !== brand.id
          );
          setDataBrandList(updatedBrandList);

          toast("Xóa nhãn hiệu thành công!", {
            type: "success" as TypeOptions,
            position: "top-right",
          });

          form.resetFields();
        } catch (errors) {
          console.log("errors remove:", errors);
          toast("Có lỗi xảy ra!", {
            type: "error" as TypeOptions,
            position: "top-right",
          });
        } finally {
          setLoadingSubmit(false);
        }
      },
      onCancel() {},
    });
  };

  const handleUploadChange: UploadProps["onChange"] = ({
    fileList: newFileList,
  }) => {
    setFileList(newFileList);
  };

  const handlePreview = async (file: UploadFile) => {
    console.log("UploadFile: ", file);
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as RcFile);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const imgWindow = window.open(src);
    imgWindow?.document.write('<img src="' + src + '" />');
  };

  return (
    <>
      <Modal
        width={1000}
        open={open}
        confirmLoading={confirmLoading}
        onCancel={() => {
          onClose();
          setEditBrand(null);
          setIsAdding(false);
          form.resetFields();
        }}
        footer={false}
        style={{ top: 10 }}
      >
        <div className="my-6">
          <div className="grid grid-cols-3 gap-6">
            {dataBrandList.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 mx-5"
                style={{ border: "1px solid #D3D3D3" }}
              >
                <img
                  src={
                    item.brandImg
                      ? `${urlImageLinkHost + item.brandImg}`
                      : getBrandLogoPath(item.brandName)
                  }
                  alt={item.brandName}
                  className="w-10 mr-4"
                />
                <span className="mr-4">{item.brandName}</span>
                <div className="flex gap-2">
                  <Button
                    icon={<CiEdit />}
                    onClick={() => handleOpenEditMode(item)}
                  />
                  <Button
                    icon={<BiTrash />}
                    onClick={() => handleDeleteBrand(item)}
                  />
                </div>
              </div>
            ))}
            <div className="flex justify-center items-center w-full">
              <Button
                icon={<BiPlus />}
                onClick={handleOpenAddMode}
                className="w-full mx-5 h-full"
                type="dashed"
              >
                Thêm hãng xe
              </Button>
            </div>
          </div>

          {/* edit */}

          {(editBrand || isAdding) && (
            <>
              <Divider
                className=""
                style={{
                  borderWidth: "medium",
                  borderColor: "#EEEEEE",
                }}
              ></Divider>
              <h5 className="text-center">
                {editBrand ? "Cập nhật hãng xe" : "Thêm hãng xe"}
              </h5>
              <Form form={form} layout="vertical">
                <div className="px-10 flex flex-row">
                  <div className="w-2/3">
                    <Form.Item
                      name="brandImg"
                      label="Logo hãng"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng cập nhập logo hãng xe!",
                        },
                      ]}
                    >
                      <Upload
                        listType="picture-card"
                        fileList={fileList}
                        onChange={handleUploadChange}
                        onPreview={handlePreview}
                        beforeUpload={() => false}
                      >
                        {fileList.length < 1 && "Thêm logo"}
                      </Upload>
                    </Form.Item>
                    <Form.Item
                      name="brandName"
                      label="Hãng xe"
                      rules={[
                        { required: true, message: "Vui lòng nhập hãng xe!" },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </div>

                  <div className="flex items-center w-1/3 justify-end gap-4 mt-4">
                    {loadingSubmit && (
                      <Spin tip="Loading" size="small">
                        {content}
                      </Spin>
                    )}
                    <Button
                      onClick={() => {
                        setEditBrand(null);
                        setIsAdding(false);
                      }}
                      style={{ marginLeft: "8px" }}
                    >
                      Hủy
                    </Button>
                    <Button type="primary" onClick={handleSave}>
                      Lưu
                    </Button>
                  </div>
                </div>
              </Form>
            </>
          )}
        </div>
      </Modal>
    </>
  );
};

export default ModalManageBrandVehicle;

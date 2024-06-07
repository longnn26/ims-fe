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
  Select,
  Spin,
} from "antd";
import { Form } from "antd";
import useSelector from "@hooks/use-selector";
import { useSession } from "next-auth/react";
const { confirm } = Modal;
import useDispatch from "@hooks/use-dispatch";
import { BrandCarType, ModelCarType } from "@models/car";
import { getBrandLogoPath } from "@utils/helpers";
import { CiEdit } from "react-icons/ci";
import { BiPlus, BiTrash } from "react-icons/bi";
import carService from "@services/car";
import { TypeOptions, toast } from "react-toastify";

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

const ModalManageModelVehicle: React.FC<Props> = (props) => {
  const formRef = useRef(null);
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const [form] = Form.useForm();

  const { onSubmit, open, onClose, dataBrandList, setDataBrandList } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [editModel, setEditModel] = useState<ModelCarType | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<BrandCarType | null>();
  const [modelDataList, setModelDataList] = useState<ModelCarType[]>([]);

  const disabled = async () => {
    var result = false;
    try {
      await form.validateFields();
    } catch (errorInfo) {
      result = true;
    }
    return result;
  };

  const handleOpenEditMode = (model: ModelCarType) => {
    setEditModel(model);
    form.setFieldsValue(model);
  };

  const handleOpenAddMode = () => {
    setEditModel(null);
    setIsAdding(true);
    form.resetFields();
  };

  const handleSave = () => {
    form.validateFields().then(async (values) => {
      setLoadingSubmit(true);

      if (!editModel) {
        //thêm
        // const newBrand = { ...values, brandImg, id: new Date().getTime() };
        await carService
          .addNewModel(session?.user.access_token!, {
            modelName: form.getFieldValue("modelName"),
            brandVehicleId: selectedBrand?.id ?? "",
            //img
          })
          .then((res) => {
            console.log("add newModel: ", res);
            setModelDataList([...modelDataList, res]);

            toast(`Thêm mới mẫu xe thành công!`, {
              type: "success" as TypeOptions,
              position: "top-right",
            });
            form.resetFields();
          })
          .catch((errors) => {
            console.log("errors add model: ", errors);
          })
          .finally(() => {
            setLoadingSubmit(false);
          });
      } else {
        //edit

        await carService
          .updateSelectedModelByBrandVehicleId(session?.user.access_token!, {
            modelVehicleId: editModel?.id,
            modelName: form.getFieldValue("modelName"),
            //img
          })
          .then((res) => {
            const updatedList = modelDataList.map((model) =>
              //   brand.id === editModel?.id ? { ...brand, ...values, brandImg } : brand
              model.id === editModel?.id
                ? { ...model, modelName: form.getFieldValue("modelName") }
                : model
            );
            setModelDataList(updatedList);

            toast(`Cập nhập mẫu xe thành công!`, {
              type: "success" as TypeOptions,
              position: "top-right",
            });
            form.resetFields();
          })
          .catch((errors) => {
            console.log("errors edit model: ", errors);
          })
          .finally(() => {
            setLoadingSubmit(false);
          });
      }
      setEditModel(null);
      setIsAdding(false);
      form.resetFields();
    });
  };

  const handleDeleteModel = (model: ModelCarType) => {
    confirm({
      cancelText: "Hủy",
      okText: "Xác nhận",
      title: "Bạn có chắc muốn xóa mẫu xe này ra khỏi hệ thống?",
      async onOk() {
        try {
          setLoadingSubmit(true);

          await carService.deleteSelectedModelByModelVehicleId(
            session?.user.access_token!,
            model.id ?? ""
          );

          const updatedModelList = modelDataList.filter(
            (item) => item.id !== model.id
          );
          setModelDataList(updatedModelList);

          toast("Xóa mẫu xe thành công!", {
            type: "success" as TypeOptions,
            position: "top-right",
          });

          form.resetFields();
        } catch (errors) {
          console.log("errors remove model:", errors);
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

  const getAllModelByBrandCar = async () => {
    setLoading(true);
    await carService
      .getAllModelByBrandVehicleId(
        session?.user.access_token!,
        selectedBrand?.id ?? ""
      )
      .then((res) => {
        setLoading(false);
        console.log("res all model vehicle: ", res);
        setModelDataList(res);
      })
      .catch((errors) => {
        console.log("errors get all model: ", errors);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    selectedBrand && getAllModelByBrandCar();
  }, [selectedBrand]);

  return (
    <>
      <Modal
        width={1000}
        open={open}
        confirmLoading={confirmLoading}
        onCancel={() => {
          onClose();
          setEditModel(null);
          setIsAdding(false);
          setSelectedBrand(null);
          form.resetFields();
        }}
        footer={false}
        style={{ top: 10 }}
      >
        <Select
          className="w-52"
          value={selectedBrand?.brandName}
          onChange={(brandName) => {
            const selectedBrandObject = dataBrandList.find(
              (brand) => brand.brandName === brandName
            );
            setSelectedBrand(selectedBrandObject);
            setEditModel(null);
            setIsAdding(false);
            form.resetFields();
          }}
          placeholder="Vui lòng chọn hãng xe"
        >
          {dataBrandList.map((brand) => (
            <Select.Option key={brand.brandName} value={brand.brandName}>
              {brand.brandName}
            </Select.Option>
          ))}
        </Select>

        <div className="my-6">
          {selectedBrand && (
            <div className="grid grid-cols-3 gap-6">
              {modelDataList.length === 0 ? (
                <div className="text-center text-gray-500 py-4">
                  Chưa có mẫu xe nào được thêm
                </div>
              ) : (
                modelDataList.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 mx-5"
                    style={{ border: "1px solid #D3D3D3" }}
                  >
                    <span className="mr-4">{item.modelName}</span>
                    <div className="flex gap-2">
                      <Button
                        icon={<CiEdit />}
                        onClick={() => handleOpenEditMode(item)}
                      />
                      <Button
                        icon={<BiTrash />}
                        onClick={() => handleDeleteModel(item)}
                      />
                    </div>
                  </div>
                ))
              )}
              <div className="flex justify-center items-center w-full">
                <Button
                  icon={<BiPlus />}
                  onClick={handleOpenAddMode}
                  className="w-full mx-5 h-full"
                  type="dashed"
                >
                  Thêm mẫu xe
                </Button>
              </div>
            </div>
          )}

          {/* edit */}

          {(editModel || isAdding) && (
            <>
              <Divider
                className=""
                style={{
                  borderWidth: "medium",
                  borderColor: "#EEEEEE",
                }}
              ></Divider>
              <h5 className="text-center">
                {editModel ? "Cập nhật mẫu xe" : "Thêm mẫu xe"}
              </h5>
              <Form form={form} layout="vertical" className="px-10 ">
                <Form.Item
                  name="modelName"
                  label="Tên mẫu xe"
                  rules={[{ required: true, message: "Vui lòng nhập mẫu xe!" }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item>
                  <div className="flex justify-end gap-4">
                    {loadingSubmit && (
                      <Spin tip="Loading" size="small">
                        {content}
                      </Spin>
                    )}
                    <Button
                      onClick={() => {
                        setEditModel(null);
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
                </Form.Item>
              </Form>
            </>
          )}
        </div>
      </Modal>
    </>
  );
};

export default ModalManageModelVehicle;

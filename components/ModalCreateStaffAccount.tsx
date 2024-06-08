import React, { useRef, useState, useEffect } from "react";
import { Button, Input, Modal, message, Checkbox, CheckboxProps } from "antd";
import { Form } from "antd";
import useSelector from "@hooks/use-selector";
import { useSession } from "next-auth/react";
import { SupportType } from "@models/support";
const { confirm } = Modal;
import customerService from "@services/customer";
import { EmergencyStatusEnum, SupportStatusEnum } from "@utils/enum";
import { TypeOptions, toast } from "react-toastify";
import FirstStageCreate from "./stageCreateAccount/FirstStageCreate";
import { formatDobToYYYYMMDD } from "@utils/helpers";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  functionResetListDataAccount?: () => Promise<void>;
}

const ModalCreateStaffAccount: React.FC<Props> = (props) => {
  const { onSubmit, open, onClose, functionResetListDataAccount } = props;
  const { data: session } = useSession();
  const formAccountRef = useRef(null);
  const [formAccount] = Form.useForm();

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

  //   quản lý trạng thái chuyển trang
  const [currentStage, setCurrentStage] = useState(1);
  const [stageEnabled, setStageEnabled] = useState<Record<number, boolean>>({
    1: true,
  });

  const getStageName = (stage: any) => {
    switch (stage) {
      case 1:
        return "Thông tin nhân viên";
      // case 2:
      //   return "CCCD";
      // case 3:
      //   return "Bằng lái xe";
      default:
        return "";
    }
  };

  const getStageContent = (stage: any) => {
    switch (stage) {
      case 1:
        return (
          <FirstStageCreate
            formAccountRef={formAccountRef}
            formAccount={formAccount}
          />
        );
      // case 2:
      //   return (
      //     <SecondStageCreate
      //       formIdentityCardRef={formIdentityCardRef}
      //       formIdentityCard={formIdentityCard}
      //       data={dataSupport}
      //       formAccount={formAccount}
      //     />
      //   );
      default:
        return null;
    }
  };

  // xử lý api
  const handleSubmitCreateStaffForm = async () => {
    try {
      formAccount.validateFields();
    } catch (errorInfo) {
      console.log("Validation Failed:", errorInfo);
    }
    confirm({
      cancelText: "Hủy",
      okText: "Xác nhận tạo",
      title:
        "Bạn có chắc muốn tạo tài khoản Nhân viên với những thông tin vừa điền?",
      async onOk() {
        try {
          setLoadingSubmit(true);

          const resCreateStaff = await customerService.createStaffAccount(
            session?.user.access_token!,
            {
              name: formAccount.getFieldValue("fullName"),
              userName: formAccount.getFieldValue("email"),
              email: formAccount.getFieldValue("email"),
              phoneNumber: formAccount.getFieldValue("phoneNumber"),
              address: formAccount.getFieldValue("address"),
              gender: formAccount.getFieldValue("gender"),
              dob: formatDobToYYYYMMDD(formAccount.getFieldValue("dob")),
              file: formAccount.getFieldValue("avatar")[0]?.originFileObj,
            }
          );

          toast("Tạo nhân viên thành công!", {
            type: "success" as TypeOptions,
            position: "top-right",
          });
          setStageEnabled({
            1: true,
          });
          setCurrentStage(1);

          formAccount.resetFields();

          if (functionResetListDataAccount) {
            await functionResetListDataAccount();
          }
          onClose();
        } catch (errors) {
          console.log("errors:", errors);
          toast("Có lỗi xảy ra!", {
            type: "error" as TypeOptions,
            position: "top-right",
          });
          showToastMessage(errors);
        } finally {
          setLoadingSubmit(false);
        }
      },
      onCancel() {},
    });
  };

  const showToastMessage = (errors) => {
    let message;
    if (Array.isArray(errors.response.data)) {
      message = errors.response.data.join(", ");
    } else {
      message = errors.response.data;
    }

    toast(message, {
      type: "error" as TypeOptions,
      position: "top-right",
    });
  };

  return (
    <>
      <Modal
        style={{ top: 10 }}
        title={
          <span className="inline-block m-auto">
            Form tạo tài khoản cho Nhân viên
          </span>
        }
        width={900}
        open={open}
        confirmLoading={confirmLoading}
        onCancel={() => {
          onClose();
          setStageEnabled({
            1: true,
          });
          setCurrentStage(1);
          formAccount.resetFields();
        }}
        footer={[
          <div
            key="footer-buttons"
            className="flex justify-end gap-5"
            style={{ marginRight: "18px" }}
          >
            <div
              key="btn-create"
              className="font-semibold btn-continue px-4 py-2 cursor-pointer"
              onClick={handleSubmitCreateStaffForm}
            >
              Khởi tạo
            </div>
          </div>,
        ]}
      >
        <div className="container">
          <div className="w-full flex justify-center">
            <div
              className="stage-header"
              style={{ display: "flex", justifyContent: "center" }}
            >
              {[1].map((stageNum) => (
                <div
                  key={stageNum}
                  className={`stage btn ${
                    stageEnabled[stageNum] ? "" : "disabled"
                  } ${currentStage === stageNum ? "active" : ""}`}
                >
                  {getStageName(stageNum)}
                </div>
              ))}
            </div>
          </div>

          <div className="container py-4">{getStageContent(currentStage)}</div>
        </div>
      </Modal>
    </>
  );
};

export default ModalCreateStaffAccount;

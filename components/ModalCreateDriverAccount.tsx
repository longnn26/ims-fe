import React, { useRef, useState, useEffect } from "react";
import { Button, Input, Modal, message, Checkbox, CheckboxProps } from "antd";
import { Form } from "antd";
import useSelector from "@hooks/use-selector";
import { useSession } from "next-auth/react";
import { SupportType } from "@models/support";
const { confirm } = Modal;
import customerService from "@services/customer";
import identityCardService from "@services/identityCard";
import drivingLicenseService from "@services/drivingLicense";
import { EmergencyStatusEnum, SupportStatusEnum } from "@utils/enum";
import { TypeOptions, toast } from "react-toastify";
import FirstStageCreate from "./stageCreateAccount/FirstStageCreate";
import SecondStageCreate from "./stageCreateAccount/SecondStageCreate";
import ThirdStageCreate from "./stageCreateAccount/ThirdStageCreate";
import { formatDobToYYYYMMDD } from "@utils/helpers";

interface Props {
  open: boolean;
  onClose: () => void;
  dataSupport?: SupportType | undefined;
  onSubmit?: () => void;
  functionResetListDataAccount?: () => Promise<void>;
}

const ModalCreateDriverAccount: React.FC<Props> = (props) => {
  const { onSubmit, open, onClose, dataSupport, functionResetListDataAccount } =
    props;
  const { data: session } = useSession();
  const formAccountRef = useRef(null);
  const [formAccount] = Form.useForm();
  const formIdentityCardRef = useRef(null);
  const [formIdentityCard] = Form.useForm();
  const formDrivingLicenseRef = useRef(null);
  const [formDrivingLicense] = Form.useForm();

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

  //   quản lý trạng thái chuyển trang
  const [currentStage, setCurrentStage] = useState(1);
  const [stageEnabled, setStageEnabled] = useState<Record<number, boolean>>({
    1: true,
    2: false,
    3: false,
  });

  //function xử lý chuyển trang
  const handleBackStage = () => {
    setCurrentStage(currentStage - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleContinueStage = async () => {
    try {
      if (currentStage === 1) {
        await formAccount.validateFields();
      } else if (currentStage === 2) {
        await formIdentityCard.validateFields();
      }

      /////////////////////////////////////////////

      setStageEnabled((prevState) => ({
        ...prevState,
        [currentStage + 1]: true,
      }));

      setCurrentStage(currentStage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (errorInfo) {
      console.log("Validation Failed:", errorInfo);
    }
  };

  const getStageName = (stage: any) => {
    switch (stage) {
      case 1:
        return "Thông tin tài xế";
      case 2:
        return "CCCD";
      case 3:
        return "Bằng lái xe";
      default:
        return "";
    }
  };

  const handleStageClick = async (stage: any) => {
    try {
      if (stage === 2) {
        await formAccount.validateFields();
      } else if (stage === 3) {
        await formIdentityCard.validateFields();
      }

      setStageEnabled((prevState) => ({
        ...prevState,
        [stage]: true,
      }));

      setCurrentStage(stage);
    } catch (errorInfo) {
      console.log("Validation Failed:", errorInfo);
    }
  };

  const getStageContent = (stage: any) => {
    switch (stage) {
      case 1:
        return (
          <FirstStageCreate
            formAccountRef={formAccountRef}
            formAccount={formAccount}
            data={dataSupport}
          />
        );
      case 2:
        return (
          <SecondStageCreate
            formIdentityCardRef={formIdentityCardRef}
            formIdentityCard={formIdentityCard}
            data={dataSupport}
            formAccount={formAccount}
          />
        );
      case 3:
        return (
          <ThirdStageCreate
            formDrivingLicenseRef={formDrivingLicenseRef}
            formDrivingLicense={formDrivingLicense}
            data={dataSupport}
          />
        );
      default:
        return null;
    }
  };

  // xử lý api
  const handleSubmitCreateDriverForm = async () => {
    try {
      formDrivingLicense.validateFields();
    } catch (errorInfo) {
      console.log("Validation Failed:", errorInfo);
    }
    confirm({
      cancelText: "Hủy",
      okText: "Xác nhận tạo",
      title:
        "Bạn có chắc muốn tạo tài khoản tài xế với những thông tin vừa điền?",
      async onOk() {
        try {
          setLoadingSubmit(true);

          const resCreateDriver = await customerService.createDriverAccount(
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

          const resIdentityCard =
            await identityCardService.createIdentityCardByAdmin(
              session?.user.access_token!,
              {
                fullName: formIdentityCard.getFieldValue("fullName"),
                dob: formatDobToYYYYMMDD(formIdentityCard.getFieldValue("dob")),
                gender: formIdentityCard.getFieldValue("gender"),
                nationality: formIdentityCard.getFieldValue("nationality"),
                placeOrigin: formIdentityCard.getFieldValue("placeOrigin"),
                placeResidence:
                  formIdentityCard.getFieldValue("placeResidence"),
                personalIdentification: formIdentityCard.getFieldValue(
                  "personalIdentification"
                ),
                identityCardNumber:
                  formIdentityCard.getFieldValue("identityCardNumber"),
                expiredDate: formatDobToYYYYMMDD(
                  formIdentityCard.getFieldValue("expiredDate")
                ),
              },
              resCreateDriver.id
            );

          await identityCardService.addIdentityCardImageByAdmin(
            session?.user.access_token!,
            {
              identityCardId: resIdentityCard,
              isFront: true,
              file: formIdentityCard.getFieldValue("imageFront")[0]
                .originFileObj,
            }
          );

          await identityCardService.addIdentityCardImageByAdmin(
            session?.user.access_token!,
            {
              identityCardId: resIdentityCard,
              isFront: false,
              file: formIdentityCard.getFieldValue("imageBehind")[0]
                .originFileObj,
            }
          );

          const resCreateDlc =
            await drivingLicenseService.createDrivingLicenseByAdmin(
              session?.user.access_token!,
              {
                drivingLicenseNumber: formDrivingLicense.getFieldValue(
                  "drivingLicenseNumber"
                ),
                type: formDrivingLicense.getFieldValue("type"),
                expiredDate: formatDobToYYYYMMDD(
                  formDrivingLicense.getFieldValue("expiredDate")
                ),
                issueDate: formatDobToYYYYMMDD(
                  formDrivingLicense.getFieldValue("issueDate")
                ),
              },
              resCreateDriver.id
            );

          await drivingLicenseService.addDrivingLicenseImageByAdmin(
            session?.user.access_token!,
            {
              drivingLicenseId: resCreateDlc,
              isFront: true,
              file: formDrivingLicense.getFieldValue("imageFront")[0]
                .originFileObj,
            }
          );

          await drivingLicenseService.addDrivingLicenseImageByAdmin(
            session?.user.access_token!,
            {
              drivingLicenseId: resCreateDlc,
              isFront: false,
              file: formDrivingLicense.getFieldValue("imageBehind")[0]
                .originFileObj,
            }
          );

          toast("Tạo tài xế thành công!", {
            type: "success" as TypeOptions,
            position: "top-right",
          });
          setStageEnabled({
            1: true,
            2: false,
            3: false,
          });
          setCurrentStage(1);

          formAccount.resetFields();
          formIdentityCard.resetFields();
          formDrivingLicense.resetFields();

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
        centered
        title={
          <span className="inline-block m-auto">
            {" "}
            Form tạo tài khoản cho Tài xế
          </span>
        }
        width={900}
        open={open}
        confirmLoading={confirmLoading}
        onCancel={() => {
          onClose();
          setStageEnabled({
            1: true,
            2: false,
            3: false,
          });
          setCurrentStage(1);
          formAccount.resetFields();
          formIdentityCard.resetFields();
          formDrivingLicense.resetFields();
        }}
        footer={[
          <div
            key="footer-buttons"
            className="flex justify-end gap-5"
            style={{ marginRight: "18px" }}
          >
            {currentStage > 1 && (
              <div
                key="btn-back"
                className="font-semibold btn-cancel px-4 py-2 cursor-pointer"
                onClick={handleBackStage}
              >
                Quay lại
              </div>
            )}

            {currentStage < 3 && (
              <div
                key="btn-continue"
                className="font-semibold btn-continue px-4 py-2 cursor-pointer"
                onClick={handleContinueStage}
              >
                Tiếp tục
              </div>
            )}

            {currentStage === 3 && (
              <div
                key="btn-confirm"
                className="font-semibold btn-continue px-4 py-2 cursor-pointer"
                onClick={handleSubmitCreateDriverForm}
              >
                Xác nhận
              </div>
            )}
          </div>,
        ]}
      >
        <div className="container">
          <div className="w-full flex justify-center">
            <div className="stage-header w-3/5">
              {[1, 2, 3].map((stageNum, index) => (
                <div
                  key={index}
                  className={`stage btn ${
                    stageEnabled[stageNum] ? "" : "disabled"
                  } ${currentStage === stageNum ? "active" : ""}`}
                  onClick={() => handleStageClick(stageNum)}
                >
                  {stageNum}. {getStageName(stageNum)}
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

export default ModalCreateDriverAccount;

import React, { useState } from "react";
import { Descriptions, Divider, Modal, Avatar, Rate, Button } from "antd";
import { EmergencyType } from "@models/emergency";
import { categoriesDetail } from "./RequestConstant";
import { CategoriesDetailEnum, RequestStatusEnum } from "@utils/enum";
import { UserOutlined, StarOutlined } from "@ant-design/icons";
import { urlImageLinkHost } from "@utils/api-links";
import {
  convertToVietnamTimeInBooking,
  formatCurrency,
  formatDateTimeToVnFormat,
  removeHyphens,
  translateStatusToVnLanguage,
  translateTypeToVnLanguage,
} from "@utils/helpers";
import requestService from "@services/request";
import { useSession } from "next-auth/react";

import { TransactionType } from "@models/transaction";
import { TypeOptions, toast } from "react-toastify";
const { confirm } = Modal;

interface Props {
  open: boolean;
  onClose: () => void;
  dataRequest: TransactionType | undefined;
  setRequestListData: React.Dispatch<React.SetStateAction<TransactionType[]>>;
}

const ModalRequestDetail: React.FC<Props> = (props) => {
  const { open, dataRequest, onClose, setRequestListData } = props;
  const [selectedCategory, setSelectedCategory] = useState<any>(
    CategoriesDetailEnum.REQUEST_INFO
  );
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const { data: session } = useSession();

  console.log(dataRequest);

  const renderContent = () => {
    switch (selectedCategory) {
      case CategoriesDetailEnum.REQUEST_INFO:
        return (
          <>
            <Descriptions className="px-5" layout="horizontal">
              <Descriptions.Item label="Mã giao dịch">
                {removeHyphens(dataRequest?.id ?? "")}
              </Descriptions.Item>
              <Descriptions.Item label="Loại giao dịch">
                {translateTypeToVnLanguage(
                  dataRequest?.typeWalletTransaction ?? ""
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Số tiền rút">
                {formatCurrency(dataRequest?.totalMoney ?? 0)}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                {translateStatusToVnLanguage(dataRequest?.status ?? "")}
              </Descriptions.Item>
              <Descriptions.Item label="Thời gian tạo">
                {convertToVietnamTimeInBooking(dataRequest?.dateCreated ?? "")}
              </Descriptions.Item>
            </Descriptions>

            <Divider
              className=""
              style={{
                marginTop: "12px",
                borderWidth: "medium",
                borderColor: "#EEEEEE",
              }}
            ></Divider>

            <h3 className="ml-3">Người gửi yêu cầu</h3>
            <div className="flex flex-row px-5 mt-4">
              <div>
                <Avatar
                  shape="square"
                  size={80}
                  src={`${
                    urlImageLinkHost + dataRequest?.linkedAccount?.user?.avatar
                  }`}
                >
                  {dataRequest?.linkedAccount?.user?.name?.charAt(0)}
                </Avatar>
              </div>
              <Descriptions className="px-5" layout="horizontal">
                <Descriptions.Item label="Họ và tên">
                  {dataRequest?.linkedAccount?.user?.name}
                </Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">
                  {dataRequest?.linkedAccount?.user?.phoneNumber}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {dataRequest?.linkedAccount?.user?.email}
                </Descriptions.Item>
                <Descriptions.Item label="Giới tính">
                  {dataRequest?.linkedAccount?.user?.gender}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày sinh">
                  {dataRequest?.linkedAccount?.user?.dob}
                </Descriptions.Item>
                <Descriptions.Item label="Địa chỉ">
                  {dataRequest?.linkedAccount?.user?.address}
                </Descriptions.Item>
              </Descriptions>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Modal
        width={1200}
        open={open}
        onCancel={() => {
          onClose();
          setSelectedCategory(CategoriesDetailEnum.REQUEST_INFO);
        }}
        confirmLoading={confirmLoading}
        footer={
          dataRequest?.status === RequestStatusEnum.Waiting
            ? [
                <>
                  <Button
                    danger
                    className="btn-submit"
                    key="submit"
                    type="text"
                    onClick={async () => {
                      confirm({
                        cancelText: "Hủy",
                        okText: "Xác nhận",
                        title:
                          "Bạn có chắc là muốn từ chối yêu cầu chuyển tiền này?",
                        async onOk() {
                          setLoadingSubmit(true);

                          await requestService
                            .rejectWithdrawFunds(session?.user.access_token!, {
                              withdrawFundsId: dataRequest?.id ?? "",
                            })
                            .then((res) => {
                              setRequestListData((prevData: any) =>
                                prevData.map((item: TransactionType) =>
                                  item.id === dataRequest?.id
                                    ? {
                                        ...item,
                                        status: RequestStatusEnum.Failure,
                                      }
                                    : item
                                )
                              );

                              toast(`Từ chối thành công!`, {
                                type: "success" as TypeOptions,
                                position: "top-right",
                              });
                              onClose();
                            })
                            .catch((errors) => {
                              console.log("errors", errors);
                              toast(`${errors}`, {
                                type: "error" as TypeOptions,
                                position: "top-right",
                              });
                            })
                            .finally(() => {
                              setLoadingSubmit(false);
                            });
                        },
                        onCancel() {},
                      });
                    }}
                  >
                    Từ chối chuyển tiền
                  </Button>

                  <Button
                    className="btn-submit"
                    key="submit"
                    onClick={async () => {
                      confirm({
                        cancelText: "Chưa",
                        okText: "Xác nhận đã chuyển",
                        title:
                          "Bạn có chắc là đã chuyển tiền cho tài khoản này chưa?",
                        async onOk() {
                          setLoadingSubmit(true);
                          await requestService
                            .acceptWithdrawFunds(session?.user.access_token!, {
                              withdrawFundsId: dataRequest?.id ?? "",
                            })
                            .then((res) => {
                              setRequestListData((prevData: any) =>
                                prevData.map((item: TransactionType) =>
                                  item.id === dataRequest?.id
                                    ? {
                                        ...item,
                                        status: RequestStatusEnum.Success,
                                      }
                                    : item
                                )
                              );
                              toast(`Chuyển trạng thái thành công!`, {
                                type: "success" as TypeOptions,
                                position: "top-right",
                              });
                              onClose();
                            })
                            .catch((errors) => {
                              console.log("errors", errors);
                              toast(`${errors}`, {
                                type: "error" as TypeOptions,
                                position: "top-right",
                              });
                            })
                            .finally(() => {
                              setLoadingSubmit(false);
                            });
                        },
                        onCancel() {},
                      });
                    }}
                  >
                    Xác nhận đã chuyển tiền
                  </Button>
                </>,
              ]
            : false
        }
      >
        <div className="flex flex-row gap-3 mb-7">
          {categoriesDetail.map((category) => (
            <p
              key={category.key}
              onClick={() => setSelectedCategory(category.key)}
              className={`cursor-pointer transition relative mx-3 ${
                selectedCategory === category.key ? "font-bold" : ""
              }`}
            >
              {category.label}
              <span
                className={`absolute left-0 bottom-0 top-7 w-full h-0.5 bg-blue-500 transition-transform duration-300 ${
                  selectedCategory === category.key
                    ? "scale-x-100"
                    : "scale-x-0 group-hover:scale-x-100"
                }`}
              ></span>
            </p>
          ))}
        </div>

        {renderContent()}
      </Modal>
    </>
  );
};

export default ModalRequestDetail;

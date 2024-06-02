import React, { useState } from "react";
import { Descriptions, Divider, Modal, Avatar, Rate, Button } from "antd";
import { EmergencyType } from "@models/emergency";
import { categoriesDetail } from "./SupportConstant";
import { CategoriesDetailEnum, RequestStatusEnum } from "@utils/enum";
import { UserOutlined, StarOutlined } from "@ant-design/icons";
import { urlImageLinkHost } from "@utils/api-links";
import {
  convertToVietnamTimeInBooking,
  formatCurrency,
  formatDate,
  formatDateTimeToVnFormat,
  removeHyphens,
  translateStatusToVnLanguage,
  translateTypeToVnLanguage,
} from "@utils/helpers";
import requestService from "@services/request";
import { useSession } from "next-auth/react";

import { TransactionType } from "@models/transaction";
import { TypeOptions, toast } from "react-toastify";
import { SupportType } from "@models/support";
const { confirm } = Modal;

interface Props {
  open: boolean;
  onClose: () => void;
  dataSupport: SupportType | undefined;
}

const ModalSupportDetail: React.FC<Props> = (props) => {
  const { open, dataSupport, onClose } = props;
  const [selectedCategory, setSelectedCategory] = useState<any>(
    CategoriesDetailEnum.SUPPORT_INFO
  );
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const { data: session } = useSession();

  console.log(dataSupport);

  const renderContent = () => {
    switch (selectedCategory) {
      case CategoriesDetailEnum.SUPPORT_INFO:
        return (
          <>
            <Descriptions className="px-5" layout="horizontal">
              <Descriptions.Item label="Người gửi">
                {dataSupport?.fullName}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {dataSupport?.phoneNumber}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ thường trú">
                {dataSupport?.address}
              </Descriptions.Item>
              <Descriptions.Item label="Loại hỗ trợ">
                {translateTypeToVnLanguage(dataSupport?.supportType || "")}
              </Descriptions.Item>

              {dataSupport?.identityCardNumber && (
                <Descriptions.Item label="Số CCCD">
                  {dataSupport.identityCardNumber}
                </Descriptions.Item>
              )}

              {dataSupport?.drivingLicenseNumber !== null &&
                dataSupport?.drivingLicenseNumber !== "" && (
                  <Descriptions.Item label="Loại bằng lái xe">
                    {dataSupport?.drivingLicenseNumber}
                  </Descriptions.Item>
                )}

              {dataSupport?.drivingLicenseType !== null &&
                dataSupport?.drivingLicenseType !== "" && (
                  <Descriptions.Item label="Loại bằng lái xe">
                    {dataSupport?.drivingLicenseType}
                  </Descriptions.Item>
                )}

              {dataSupport?.msgContent !== null &&
                dataSupport?.msgContent !== "" && (
                  <Descriptions.Item label="Nội dung">
                    {dataSupport?.msgContent}
                  </Descriptions.Item>
                )}

              <Descriptions.Item label="Ngày gửi">
                {formatDate(dataSupport?.dateCreated)}
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

            <h3 className="ml-3">Nhân viên đảm nhiệm</h3>

            {dataSupport?.handler ? (
              <div className="flex flex-row px-5 mt-4">
                <div>
                  <Avatar
                    shape="square"
                    size={80}
                    src={`${urlImageLinkHost + dataSupport.handler.avatar}`}
                  >
                    {dataSupport.handler.name?.charAt(0)}
                  </Avatar>
                </div>
                <Descriptions className="px-5" layout="horizontal">
                  <Descriptions.Item label="Họ và tên">
                    {dataSupport.handler.name}
                  </Descriptions.Item>
                  <Descriptions.Item label="Số điện thoại">
                    {dataSupport.handler.phoneNumber}
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">
                    {dataSupport.handler.email}
                  </Descriptions.Item>
                  <Descriptions.Item label="Vai trò">
                    {dataSupport.handler.userName === "Admin"
                      ? "Quản trị viên"
                      : "Nhân viên"}
                  </Descriptions.Item>
                </Descriptions>
              </div>
            ) : (
              <p className="px-5 mt-4">Chưa ai đảm nhiệm</p>
            )}
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
          setSelectedCategory(CategoriesDetailEnum.SUPPORT_INFO);
        }}
        confirmLoading={confirmLoading}
        footer={false}
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

export default ModalSupportDetail;

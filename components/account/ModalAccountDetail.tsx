import React, { useState } from "react";
import { Descriptions, Divider, Modal, Avatar, Rate } from "antd";
import { categoriesDetail } from "./AccountConstant";
import { CategoriesDetailEnum } from "@utils/enum";
import { UserOutlined, StarOutlined } from "@ant-design/icons";
import { urlImageLinkHost } from "@utils/api-links";
import {
  formatCurrency,
  formatDateTimeToVnFormat,
  removeHyphens,
} from "@utils/helpers";
import { User } from "@models/user";

interface Props {
  open: boolean;
  onClose: () => void;
  dataAccount: User | undefined;
}

const ModalAccountDetail: React.FC<Props> = (props) => {
  const { open, dataAccount, onClose } = props;
  const [selectedCategory, setSelectedCategory] = useState<any>(
    CategoriesDetailEnum.ACCOUNT_INFO
  );

  console.log(dataAccount);

  const getCategoryKeysByRole = (role: string) => {
    switch (role) {
      case "Customer":
        return [
          CategoriesDetailEnum.ACCOUNT_INFO,
          CategoriesDetailEnum.IDENTITY_CARD_INFO,
          CategoriesDetailEnum.VEHICLE_INFO,
          CategoriesDetailEnum.LINKED_ACCOUNT_INFO,
        ];
      case "Driver":
        return [
          CategoriesDetailEnum.ACCOUNT_INFO,
          CategoriesDetailEnum.IDENTITY_CARD_INFO,
          CategoriesDetailEnum.DRIVING_LICENSE_INFO,
          CategoriesDetailEnum.LINKED_ACCOUNT_INFO,
        ];
      case "Staff":
        return [
          CategoriesDetailEnum.ACCOUNT_INFO,
          CategoriesDetailEnum.IDENTITY_CARD_INFO,
        ];
      default:
        return [];
    }
  };

  const filteredCategories = categoriesDetail.filter((category) =>
    getCategoryKeysByRole(dataAccount?.role ?? "").includes(category.key as any)
  );

  const renderContent = () => {
    switch (selectedCategory) {
      case CategoriesDetailEnum.ACCOUNT_INFO:
        return (
          <div className="flex flex-row px-5">
            <div>
              <Avatar
                shape="square"
                size={80}
                src={`${urlImageLinkHost + dataAccount?.avatar}`}
              >
                {dataAccount?.name?.charAt(0)}
              </Avatar>
            </div>
            <Descriptions className="px-5" layout="horizontal">
              <Descriptions.Item label="Họ và tên">
                {dataAccount?.name}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {dataAccount?.phoneNumber}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {dataAccount?.email}
              </Descriptions.Item>
              <Descriptions.Item label="Giới tính">
                {dataAccount?.gender}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày sinh">
                {dataAccount?.dob}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ">
                {dataAccount?.address}
              </Descriptions.Item>
              <Descriptions.Item label="Tình trạng">
                {dataAccount?.isActive ? "Đang hoạt động" : "Đã bị ban"}
              </Descriptions.Item>
            </Descriptions>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Modal
        centered
        width={1200}
        open={open}
        footer={false}
        onCancel={() => {
          onClose();
          setSelectedCategory(CategoriesDetailEnum.ACCOUNT_INFO);
        }}
      >
        <div className="flex flex-row gap-3 mb-7">
          {filteredCategories.map((category) => (
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

export default ModalAccountDetail;

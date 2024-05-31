import React, { useState } from "react";
import { Descriptions, Divider, Modal, Avatar, Rate } from "antd";
import { EmergencyType } from "@models/emergency";
import { categoriesDetail } from "./EmergencyConstant";
import { CategoriesDetailEnum } from "@utils/enum";
import { UserOutlined, StarOutlined } from "@ant-design/icons";
import { urlImageLinkHost } from "@utils/api-links";
import {
  formatCurrency,
  formatDateTimeToVnFormat,
  removeHyphens,
} from "@utils/helpers";

interface Props {
  open: boolean;
  onClose: () => void;
  dataEmergency: EmergencyType | undefined;
}

const ModalEmergencyDetail: React.FC<Props> = (props) => {
  const { open, dataEmergency, onClose } = props;
  const [selectedCategory, setSelectedCategory] = useState<any>(
    CategoriesDetailEnum.EMERGENCY_INFO
  );

  console.log(dataEmergency);

  const renderContent = () => {
    switch (selectedCategory) {
      case CategoriesDetailEnum.EMERGENCY_INFO:
        return (
          <>
            <Descriptions className="px-5" layout="horizontal">
              <Descriptions.Item label="Người gửi">
                {dataEmergency?.sender.name}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {dataEmergency?.sender.phoneNumber}
              </Descriptions.Item>
              <Descriptions.Item label="Nơi gửi">
                {dataEmergency?.senderAddress}
              </Descriptions.Item>
              <Descriptions.Item label="Loại khẩn cấp">
                {dataEmergency?.emergencyType}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                {dataEmergency?.status}
              </Descriptions.Item>
              <Descriptions.Item label="Chú thích">
                {dataEmergency?.note}
              </Descriptions.Item>
              {dataEmergency?.isStopTrip && (
                <Descriptions.Item label="Lý do hủy chuyến ngay">
                  {dataEmergency?.bookingCancelReason}
                </Descriptions.Item>
              )}
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

            <div className="flex flex-row px-5 mt-4">
              <div>
                <Avatar
                  shape="square"
                  size={80}
                  icon={<UserOutlined />}
                  src={`${urlImageLinkHost + dataEmergency?.handler.avatar}`}
                />
              </div>
              <Descriptions className="px-5" layout="horizontal">
                <Descriptions.Item label="Họ và tên">
                  {dataEmergency?.handler.name}
                </Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">
                  {dataEmergency?.handler.phoneNumber}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {dataEmergency?.handler.email}
                </Descriptions.Item>
                <Descriptions.Item label="Vai trò">Nhân viên</Descriptions.Item>
              </Descriptions>
            </div>
          </>
        );
      case CategoriesDetailEnum.BOOKING_INFO:
        return (
          <>
            <Descriptions className="px-5" layout="horizontal" column={2}>
              <Descriptions.Item label="Mã chuyến đi" className="px-3">
                {removeHyphens(dataEmergency?.booking?.id ?? "")}
              </Descriptions.Item>

              <Descriptions.Item
                label="Thời gian bắt đầu chuyến"
                className="px-3"
              >
                {formatDateTimeToVnFormat(
                  dataEmergency?.booking?.dateCreated ?? ""
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Điểm đón khách" className="px-3">
                {dataEmergency?.booking?.searchRequest?.pickupAddress}
              </Descriptions.Item>
              <Descriptions.Item label="Điểm trả khách" className="px-3">
                {dataEmergency?.booking?.searchRequest?.dropOffAddress}
              </Descriptions.Item>

              <Descriptions.Item label="Hình thức" className="px-3">
                {dataEmergency?.booking?.searchRequest?.bookingType}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái" className="px-3">
                {dataEmergency?.booking?.status}
              </Descriptions.Item>
              <Descriptions.Item
                label="Phương thức thanh toán"
                className="px-3"
              >
                {dataEmergency?.booking?.searchRequest?.bookingPaymentMethod}
              </Descriptions.Item>
              <Descriptions.Item label="Giá cuốc" className="px-3">
                {formatCurrency(
                  dataEmergency?.booking?.searchRequest?.price ?? 0
                )}
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

            <h3 className="ml-3 mb-5">Thông tin chiếc xe</h3>

            <Descriptions className="px-5" layout="horizontal" column={2}>
              <Descriptions.Item label="Biển số xe" className="px-3">
                {
                  dataEmergency?.booking?.searchRequest?.bookingVehicle
                    ?.licensePlate
                }
              </Descriptions.Item>
              <Descriptions.Item label="Hãng xe" className="px-3">
                {dataEmergency?.booking?.searchRequest?.bookingVehicle?.brand}
              </Descriptions.Item>
              <Descriptions.Item label="Mẫu xe" className="px-3">
                {dataEmergency?.booking?.searchRequest?.bookingVehicle?.model}
              </Descriptions.Item>
              <Descriptions.Item label="Màu xe" className="px-3">
                {dataEmergency?.booking?.searchRequest?.bookingVehicle?.color}
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

            <h3 className="ml-3 mb-5">Ảnh checkin</h3>

            <div className="ml-8">
              <p style={{ color: "#00000073" }}>
                Ảnh khách hàng trước chuyến đi:
              </p>

            </div>

            <div className="ml-8">
              <p style={{ color: "#00000073" }}>Ảnh xe rước chuyến đi:</p>
            </div>
          </>
        );
      case CategoriesDetailEnum.CUSTOMER_INFO:
        return (
          <div className="flex flex-row px-5">
            <div>
              <Avatar
                shape="square"
                size={80}
                icon={<UserOutlined />}
                src={`${
                  urlImageLinkHost +
                  dataEmergency?.booking?.searchRequest?.customer?.avatar
                }`}
              />
            </div>
            <Descriptions className="px-5" layout="horizontal">
              <Descriptions.Item label="Họ và tên">
                {dataEmergency?.booking?.searchRequest?.customer?.name}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {dataEmergency?.booking?.searchRequest?.customer?.phoneNumber}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {dataEmergency?.booking?.searchRequest?.customer?.email}
              </Descriptions.Item>
              <Descriptions.Item label="Giới tính">
                {dataEmergency?.booking?.searchRequest?.customer?.gender}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày sinh">
                {dataEmergency?.booking?.searchRequest?.customer?.dob}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ">
                {dataEmergency?.booking?.searchRequest?.customer?.address}
              </Descriptions.Item>
              <Descriptions.Item label="Tình trạng">
                {dataEmergency?.booking?.searchRequest?.customer?.isActive
                  ? "Đang hoạt động"
                  : "Đã bị ban"}
              </Descriptions.Item>
            </Descriptions>
          </div>
        );
      case CategoriesDetailEnum.DRIVER_INFO:
        return (
          <div className="flex flex-row px-5">
            <div>
              <Avatar
                shape="square"
                size={80}
                icon={<UserOutlined />}
                src={`${
                  urlImageLinkHost + dataEmergency?.booking?.driver?.avatar
                }`}
              />
              <div className="flex items-center justify-center mt-2">
                <Rate
                  disabled
                  allowHalf
                  style={{ fontSize: 14, marginInlineEnd: "0px" }}
                  defaultValue={dataEmergency?.booking?.driver?.star}
                />
              </div>
            </div>
            <Descriptions className="px-5" layout="horizontal">
              <Descriptions.Item label="Họ và tên">
                {dataEmergency?.booking?.driver?.name}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {dataEmergency?.booking?.driver?.phoneNumber}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {dataEmergency?.booking?.driver?.email}
              </Descriptions.Item>
              <Descriptions.Item label="Giới tính">
                {dataEmergency?.booking?.driver?.gender}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày sinh">
                {dataEmergency?.booking?.driver?.dob}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ">
                {dataEmergency?.booking?.driver?.address}
              </Descriptions.Item>
              <Descriptions.Item label="Tình trạng">
                {dataEmergency?.booking?.driver?.isActive
                  ? "Đang hoạt động"
                  : "Đã bị ban"}
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
          setSelectedCategory(CategoriesDetailEnum.EMERGENCY_INFO);
        }}
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

export default ModalEmergencyDetail;

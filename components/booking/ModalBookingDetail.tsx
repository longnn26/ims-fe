import React, { useState } from "react";
import { Avatar, Descriptions, Divider, Modal, Rate } from "antd";
import { BookingType } from "@models/booking";
import {
  formatCurrency,
  formatDateTimeToVnFormat,
  removeHyphens,
} from "@utils/helpers";
import { CategoriesDetailEnum } from "@utils/enum";
import { categoriesDetail } from "./BookingConstant";
import { urlImageLinkHost } from "@utils/api-links";
import { UserOutlined, StarOutlined } from "@ant-design/icons";

interface Props {
  open: boolean;
  onClose: () => void;
  dataBooking: BookingType | undefined;
}

const ModalBookingDetail: React.FC<Props> = (props) => {
  const { open, dataBooking, onClose } = props;
  const [selectedCategory, setSelectedCategory] = useState<any>(
    CategoriesDetailEnum.BOOKING_INFO
  );

  const renderContent = () => {
    switch (selectedCategory) {
      case CategoriesDetailEnum.BOOKING_INFO:
        return (
          <>
            <Descriptions className="px-5" layout="horizontal" column={2}>
              <Descriptions.Item label="Mã chuyến đi" className="px-3">
                {removeHyphens(dataBooking?.id ?? "")}
              </Descriptions.Item>

              <Descriptions.Item
                label="Thời gian bắt đầu chuyến"
                className="px-3"
              >
                {formatDateTimeToVnFormat(dataBooking?.dateCreated ?? "")}
              </Descriptions.Item>
              <Descriptions.Item label="Điểm đón khách" className="px-3">
                {dataBooking?.searchRequest?.pickupAddress}
              </Descriptions.Item>
              <Descriptions.Item label="Điểm trả khách" className="px-3">
                {dataBooking?.searchRequest?.dropOffAddress}
              </Descriptions.Item>

              <Descriptions.Item label="Hình thức" className="px-3">
                {dataBooking?.searchRequest?.bookingType}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái" className="px-3">
                {dataBooking?.status}
              </Descriptions.Item>
              <Descriptions.Item
                label="Phương thức thanh toán"
                className="px-3"
              >
                {dataBooking?.searchRequest?.bookingPaymentMethod}
              </Descriptions.Item>
              <Descriptions.Item label="Giá cuốc" className="px-3">
                {formatCurrency(dataBooking?.searchRequest?.price ?? 0)}
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
                {dataBooking?.searchRequest?.bookingVehicle?.licensePlate}
              </Descriptions.Item>
              <Descriptions.Item label="Hãng xe" className="px-3">
                {dataBooking?.searchRequest?.bookingVehicle?.brand}
              </Descriptions.Item>
              <Descriptions.Item label="Mẫu xe" className="px-3">
                {dataBooking?.searchRequest?.bookingVehicle?.model}
              </Descriptions.Item>
              <Descriptions.Item label="Màu xe" className="px-3">
                {dataBooking?.searchRequest?.bookingVehicle?.color}
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
                src={`${
                  urlImageLinkHost +
                  dataBooking?.searchRequest?.customer?.avatar
                }`}
              >
                {dataBooking?.searchRequest?.customer?.name?.charAt(0)}
              </Avatar>
            </div>
            <Descriptions className="px-5" layout="horizontal">
              <Descriptions.Item label="Họ và tên">
                {dataBooking?.searchRequest?.customer?.name}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {dataBooking?.searchRequest?.customer?.phoneNumber}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {dataBooking?.searchRequest?.customer?.email}
              </Descriptions.Item>
              <Descriptions.Item label="Giới tính">
                {dataBooking?.searchRequest?.customer?.gender}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày sinh">
                {dataBooking?.searchRequest?.customer?.dob}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ">
                {dataBooking?.searchRequest?.customer?.address}
              </Descriptions.Item>
              <Descriptions.Item label="Tình trạng">
                {dataBooking?.searchRequest?.customer?.isActive
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
                src={`${urlImageLinkHost + dataBooking?.driver?.avatar}`}
              >
                {dataBooking?.driver?.name?.charAt(0)}
              </Avatar>
              <div className="flex items-center justify-center mt-2">
                <Rate
                  disabled
                  allowHalf
                  style={{ fontSize: 14, marginInlineEnd: "0px" }}
                  defaultValue={dataBooking?.driver?.star}
                />
              </div>
            </div>
            <Descriptions className="px-5" layout="horizontal">
              <Descriptions.Item label="Họ và tên">
                {dataBooking?.driver?.name}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {dataBooking?.driver?.phoneNumber}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {dataBooking?.driver?.email}
              </Descriptions.Item>
              <Descriptions.Item label="Giới tính">
                {dataBooking?.driver?.gender}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày sinh">
                {dataBooking?.driver?.dob}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ">
                {dataBooking?.driver?.address}
              </Descriptions.Item>
              <Descriptions.Item label="Tình trạng">
                {dataBooking?.driver?.isActive ? "Đang hoạt động" : "Đã bị ban"}
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

export default ModalBookingDetail;

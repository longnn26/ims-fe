import React, { useEffect, useState } from "react";
import { Avatar, Descriptions, Divider, Image, Modal, Rate } from "antd";
import { BookingType, ImageBookingType } from "@models/booking";
import {
  formatCurrency,
  formatDateTimeToVnFormat,
  removeHyphens,
  translateBookingInfoTOVnLanguage,
} from "@utils/helpers";
import { CategoriesDetailEnum } from "@utils/enum";
import { categoriesDetail } from "./BookingConstant";
import { urlImageLinkHost } from "@utils/api-links";
import { UserOutlined, StarOutlined } from "@ant-design/icons";
import bookingService from "@services/booking";
import { useSession } from "next-auth/react";
import StatusCell from "@components/table/StatusCell";

interface Props {
  open: boolean;
  onClose: () => void;
  dataBooking: BookingType | undefined;
}

const ModalBookingDetail: React.FC<Props> = (props) => {
  const { open, dataBooking, onClose } = props;
  // console.log("dataBooking",dataBooking);
  const [selectedCategory, setSelectedCategory] = useState<any>(
    CategoriesDetailEnum.BOOKING_INFO
  );
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  const [listCheckInBookingImg, setListCheckInBookingImg] =
    useState<ImageBookingType[]>();
  const [listCheckOutBookingImg, setListCheckOutBookingImg] =
    useState<ImageBookingType[]>();

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
                {translateBookingInfoTOVnLanguage(
                  dataBooking?.searchRequest?.bookingType ?? ""
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái" className="px-3">
                <StatusCell status={dataBooking?.status ?? ""} />
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

            {listCheckInBookingImg?.length != 0 && (
              <>
                <Divider
                  className=""
                  style={{
                    marginTop: "12px",
                    borderWidth: "medium",
                    borderColor: "#EEEEEE",
                  }}
                ></Divider>
                <h3 className="ml-3 mb-5">Ảnh checkin</h3>
                <div className="flex flex-row px-5 justify-center items-center">
                  {listCheckInBookingImg?.map((image, index) => (
                    <div
                      key={index}
                      style={{ marginRight: 20, textAlign: "center" }}
                    >
                      <Image
                        src={`${urlImageLinkHost}${image.imageUrl}`}
                        alt={bookingImageTypeText[image.bookingImageType]}
                        style={{ width: 200, height: "auto" }}
                      />
                      <div>{bookingImageTypeText[image.bookingImageType]}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
            {listCheckOutBookingImg?.length != 0 && (
              <>
                <Divider
                  className=""
                  style={{
                    marginTop: "12px",
                    borderWidth: "medium",
                    borderColor: "#EEEEEE",
                  }}
                ></Divider>
                <h3 className="ml-3 mb-5">Ảnh checkout</h3>
                <div className="flex flex-row px-5 justify-center items-center">
                  {listCheckOutBookingImg?.map((image, index) => (
                    <div
                      key={index}
                      style={{ marginRight: 20, textAlign: "center" }}
                    >
                      <Image
                        src={`${urlImageLinkHost}${image.imageUrl}`}
                        alt={bookingImageTypeText[image.bookingImageType]}
                        style={{ width: 200, height: "auto" }}
                      />
                      <div>{bookingImageTypeText[image.bookingImageType]}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
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

  const bookingImageTypeText = {
    Customer: "Ảnh khách hàng",
    Front: "Ảnh xe mặt trước",
    Behind: "Ảnh xe mặt sau",
    Left: "Ảnh xe mặt trái",
    Right: "Ảnh xe mặt phải",
  };

  const getBookingImgListData = async () => {
    setLoading(true);
    await bookingService
      .getAllCheckInBookingImage(session?.user.access_token!, dataBooking?.id)
      .then((res) => {
        setListCheckInBookingImg(res);
        console.log("res: ", res);
        setLoading(false);
      })
      .catch((errors) => {
        console.log("errors get list checkin booking img", errors);
      })
      .finally(() => {
        setLoading(false);
      });

    await bookingService
      .getAllCheckOutBookingImage(session?.user.access_token!, dataBooking?.id)
      .then((res) => {
        setListCheckOutBookingImg(res);
        console.log("res: ", res);
        setLoading(false);
      })
      .catch((errors) => {
        console.log("errors get list checkout booking img", errors);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    dataBooking && getBookingImgListData();
  }, [dataBooking]);

  return (
    <>
      <Modal
        centered
        width={1200}
        open={open}
        footer={false}
        onCancel={() => {
          onClose();
          setSelectedCategory(CategoriesDetailEnum.BOOKING_INFO);
          setListCheckInBookingImg([]);
          setListCheckOutBookingImg([]);
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

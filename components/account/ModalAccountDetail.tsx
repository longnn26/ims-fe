import React, { useEffect, useState } from "react";
import {
  Descriptions,
  Divider,
  Modal,
  Avatar,
  Rate,
  Image,
  Button,
  Input,
  DatePicker,
  Select,
} from "antd";
import { categoriesDetail } from "./AccountConstant";
import { CategoriesDetailEnum } from "@utils/enum";
import { urlImageLinkHost } from "@utils/api-links";
import { User } from "@models/user";
import { useSession } from "next-auth/react";
import accountService from "@services/customer";
import {
  IdentityCardImageModel,
  IdentityCardModel,
} from "@models/identityCard";
import { convertDatePicker, translateGenderToVietnamese } from "@utils/helpers";
import identityCardService from "@services/identityCard";
import drivingLicenseService from "@services/drivingLicense";
import {
  DrivingLicenseCardModel,
  DrivingLicenseImageCard,
} from "@models/drivingLicense";
import moment from "moment"; // Import moment for date formatting
import { dateFormat } from "@utils/constants";

const { Option } = Select;

interface Props {
  open: boolean;
  onClose: () => void;
  dataAccount: User | undefined;
}

const ModalAccountDetail: React.FC<Props> = (props) => {
  const { open, dataAccount, onClose } = props;
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<any>(
    CategoriesDetailEnum.ACCOUNT_INFO
  );
  const [identityCard, setIdentityCard] = useState<IdentityCardModel | null>(
    null
  );
  const [listIdentityCardImage, setListIdentityCardImage] =
    useState<IdentityCardImageModel[]>();

  const [drivingLicense, setDrivingLicense] =
    useState<DrivingLicenseCardModel | null>(null);

  const [listDrivingLicenseImage, setListDrivingLicenseImage] =
    useState<DrivingLicenseImageCard[]>();

  const [editMode, setEditMode] = useState(false);

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
        return [CategoriesDetailEnum.ACCOUNT_INFO];
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
              {editMode ? (
                <>
                  <Descriptions.Item label="Họ và tên">
                    <Input defaultValue={dataAccount?.name} />
                  </Descriptions.Item>
                  <Descriptions.Item label="Số điện thoại">
                    <Input defaultValue={dataAccount?.phoneNumber} />
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">
                    <Input defaultValue={dataAccount?.email} />
                  </Descriptions.Item>
                  <Descriptions.Item label="Giới tính">
                    <Select defaultValue={dataAccount?.gender}>
                      <Option value="Male">Nam</Option>
                      <Option value="Female">Nữ</Option>
                      <Option value="Other">Khác</Option>
                    </Select>
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngày sinh">
                    <DatePicker format="YYYY-MM-DD" />
                  </Descriptions.Item>
                  <Descriptions.Item label="Địa chỉ">
                    <Input defaultValue={dataAccount?.address} />
                  </Descriptions.Item>
                  <Descriptions.Item label="Tình trạng">
                    <Select
                      defaultValue={
                        dataAccount?.isActive ? "Đang hoạt động" : "Đã bị ban"
                      }
                    >
                      <Option value={true}>Đang hoạt động</Option>
                      <Option value={false}>Đã bị ban</Option>
                    </Select>
                  </Descriptions.Item>
                </>
              ) : (
                <>
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
                </>
              )}
            </Descriptions>
          </div>
        );

      // Similar updates for other cases
      case CategoriesDetailEnum.IDENTITY_CARD_INFO:
        return identityCard !== null || identityCard !== undefined ? (
          <>
            <div className="flex flex-row px-5">
              <Descriptions className="px-5" layout="horizontal">
                <Descriptions.Item label="Số CCCD">
                  {editMode ? (
                    <Input defaultValue={identityCard?.identityCardNumber} />
                  ) : (
                    identityCard?.identityCardNumber
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Họ và tên">
                  {editMode ? (
                    <Input defaultValue={identityCard?.fullName} />
                  ) : (
                    identityCard?.fullName
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Giới tính">
                  {editMode ? (
                    <Select defaultValue={identityCard?.gender}>
                      <Option value="Male">Nam</Option>
                      <Option value="Female">Nữ</Option>
                      <Option value="Other">Khác</Option>
                    </Select>
                  ) : (
                    translateGenderToVietnamese(identityCard?.gender ?? "")
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày sinh">
                  {editMode ? (
                    <DatePicker
                      defaultValue={convertDatePicker(
                        identityCard?.dob ?? "",
                        dateFormat
                      )}
                      format="YYYY-MM-DD"
                    />
                  ) : (
                    identityCard?.dob
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Quốc tịch">
                  {editMode ? (
                    <Input defaultValue={identityCard?.nationality} />
                  ) : (
                    identityCard?.nationality
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Quê quán">
                  {editMode ? (
                    <Input defaultValue={identityCard?.placeOrigin} />
                  ) : (
                    identityCard?.placeOrigin
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Địa chỉ thường trú">
                  {editMode ? (
                    <Input defaultValue={identityCard?.placeResidence} />
                  ) : (
                    identityCard?.placeResidence
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày hết hạn">
                  {editMode ? (
                    <DatePicker
                      defaultValue={convertDatePicker(
                        identityCard?.expiredDate ?? "",
                        dateFormat
                      )}
                      format="YYYY-MM-DD"
                    />
                  ) : (
                    identityCard?.expiredDate
                  )}
                </Descriptions.Item>
              </Descriptions>
            </div>

            <Divider
              className=""
              style={{
                marginTop: "12px",
                borderWidth: "medium",
                borderColor: "#EEEEEE",
              }}
            ></Divider>

            <h3 className="ml-3">Ảnh CCCD</h3>
            <div className="flex flex-row justify-center px-5 mt-4">
              {listIdentityCardImage?.map((image, index) => (
                <div
                  key={index}
                  style={{ marginRight: 20, textAlign: "center" }}
                >
                  <Image
                    src={`data:image/png;base64,${image.imageUrl}`}
                    alt={image.isFront ? "Ảnh mặt trước" : "Ảnh mặt sau"}
                    style={{ width: 300, height: 150, objectFit: "cover" }}
                  />
                  <div>{image.isFront ? "Ảnh mặt trước" : "Ảnh mặt sau"}</div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="px-5">Người dùng chưa cập nhập</p>
        );

      // Similar updates for other cases
      case CategoriesDetailEnum.DRIVING_LICENSE_INFO:
        return drivingLicense !== null || drivingLicense !== undefined ? (
          <>
            <div className="flex flex-row px-5">
              <Descriptions className="px-5" layout="horizontal">
                <Descriptions.Item label="Số GPLX">
                  {editMode ? (
                    <Input
                      defaultValue={drivingLicense?.drivingLicenseNumber}
                    />
                  ) : (
                    drivingLicense?.drivingLicenseNumber
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Loại bằng">
                  {editMode ? (
                    <Input defaultValue={drivingLicense?.type} />
                  ) : (
                    drivingLicense?.type
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày phát hành">
                  {editMode ? (
                    <DatePicker
                      defaultValue={convertDatePicker(
                        drivingLicense?.issueDate ?? "",
                        dateFormat
                      )}
                      format="YYYY-MM-DD"
                    />
                  ) : (
                    drivingLicense?.issueDate
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày hết hạn">
                  {editMode ? (
                    <DatePicker
                      defaultValue={convertDatePicker(
                        drivingLicense?.expiredDate ?? "",
                        dateFormat
                      )}
                      format="YYYY-MM-DD"
                    />
                  ) : (
                    drivingLicense?.expiredDate
                  )}
                </Descriptions.Item>
              </Descriptions>
            </div>

            <Divider
              className=""
              style={{
                marginTop: "12px",
                borderWidth: "medium",
                borderColor: "#EEEEEE",
              }}
            ></Divider>

            <h3 className="ml-3">Ảnh bằng lái</h3>
            <div className="flex flex-row justify-center px-5 mt-4">
              {listDrivingLicenseImage?.map((image, index) => (
                <div
                  key={index}
                  style={{ marginRight: 20, textAlign: "center" }}
                >
                  <Image
                    src={`data:image/png;base64,${image.imageUrl}`}
                    alt={image.isFront ? "Ảnh mặt trước" : "Ảnh mặt sau"}
                    style={{ width: 300, height: 150, objectFit: "cover" }}
                  />
                  <div>{image.isFront ? "Ảnh mặt trước" : "Ảnh mặt sau"}</div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="px-5">Người dùng chưa cập nhập</p>
        );

      default:
        return null;
    }
  };

  const handleCategoryClick = async (key) => {
    console.log("key: ", key);
    setSelectedCategory(key);

    if (key === "IdentityCardInfo") {
      setLoading(true);
      try {
        const res = await identityCardService.getIdentityCard(
          session?.user.access_token!,
          dataAccount?.id ?? ""
        );
        setIdentityCard(res);

        const resGetIdentityImg =
          await identityCardService.getIdentityCardImages(
            session?.user.access_token!,
            res?.id ?? ""
          );
        console.log("resGetIdentityImg", resGetIdentityImg);
        setListIdentityCardImage(resGetIdentityImg);
      } catch (errors) {
        console.log("errors get identity", errors);
      } finally {
        setLoading(false);
      }
    } else if (key === "DrivingLicenseInfo") {
      setLoading(true);
      try {
        const resDlc = await drivingLicenseService.getDrivingLicense(
          session?.user.access_token!,
          dataAccount?.id ?? ""
        );
        console.log("res dlc: ", resDlc);
        setDrivingLicense(resDlc[0]);

        const resGetDlcImg = await drivingLicenseService.getDrivingLicenseImage(
          session?.user.access_token!,
          resDlc[0]?.id ?? ""
        );
        setListDrivingLicenseImage(resGetDlcImg);
      } catch (errors) {
        console.log("errors get DrivingLicenseInfo", errors);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (open) {
      handleCategoryClick(CategoriesDetailEnum.ACCOUNT_INFO);
    }
  }, [open]);

  useEffect(() => {
    if (open && selectedCategory !== CategoriesDetailEnum.ACCOUNT_INFO) {
      handleCategoryClick(selectedCategory);
    }
  }, [selectedCategory]);

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  return (
    <>
      <Modal
        centered
        width={1200}
        open={open}
        footer={
          dataAccount?.role?.includes("Driver")
            ? [
                <Button
                  className="btn-submit"
                  key="submit"
                  onClick={toggleEditMode}
                >
                  {editMode ? "Lưu" : "Chỉnh sửa thông tin"}
                </Button>,
              ]
            : false
        }
        onCancel={() => {
          onClose();
          setEditMode(false);
          setSelectedCategory(CategoriesDetailEnum.ACCOUNT_INFO);
          setIdentityCard(null);
        }}
      >
        <div className="flex flex-row gap-3 mb-7">
          {filteredCategories.map((category) => (
            <p
              key={category.key}
              onClick={() => handleCategoryClick(category.key)}
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

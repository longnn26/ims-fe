import React from "react";
import { Descriptions, Divider, Modal } from "antd";
import { EmergencyType } from "@models/emergency";

interface Props {
  open: boolean;
  onClose: () => void;
  dataEmergency: EmergencyType | undefined;
}

const ModalBookingDetail: React.FC<Props> = (props) => {
  const { open, dataEmergency, onClose } = props;

  return (
    <>
      <Modal
        title={<span className="inline-block m-auto">Chi tiết</span>}
        width={1200}
        open={open}
        footer={false}
        onCancel={() => {
          onClose();
        }}
      >
        <Divider
          orientation="left"
          plain
          style={{
            margin: "10px 12px",
            borderWidth: "medium",
            borderColor: "#EEEEEE",
          }}
        >
          <div className="flex flex-row gap-3">
            <h3>Thông tin khẩn cấp</h3>
            <h3>Thông tin chuyến đi</h3>
          </div>
        </Divider>
        <Descriptions className="px-5 pt-3" layout="horizontal">
          <>
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
            <Descriptions.Item label="Tình trạng chuyến đi">
              {dataEmergency?.booking.status}
            </Descriptions.Item>
          </>
        </Descriptions>
      </Modal>
    </>
  );
};

export default ModalBookingDetail;

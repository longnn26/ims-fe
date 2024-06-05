import React, { useRef, useState, useEffect } from "react";
import { Button, Input, Modal, message, Checkbox, CheckboxProps } from "antd";
import { Form } from "antd";
import { useSession } from "next-auth/react";
import { EmergencyType } from "@models/emergency";
const { confirm } = Modal;
import emergencyService from "@services/emergency";
import { updateEmergencyStatus } from "@slices/emergency";
import useDispatch from "@hooks/use-dispatch";

interface Props {
  open: boolean;
  onClose: () => void;
  dataEmergency: EmergencyType | undefined;
  onSubmit?: () => void;
}

const ModalCancelBookingImmediately: React.FC<Props> = (props) => {
  const formRef = useRef(null);
  const { data: session } = useSession();
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const { onSubmit, open, onClose, dataEmergency } =
    props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

  const disabled = async () => {
    var result = false;
    try {
      await form.validateFields();
    } catch (errorInfo) {
      result = true;
    }
    return result;
  };

  return (
    <>
      <Modal
        title={
          <span className="inline-block m-auto">
            Form hủy chuyến ngay lập tức
          </span>
        }
        width={700}
        open={open}
        confirmLoading={confirmLoading}
        onCancel={() => {
          onClose();

          form.resetFields();
        }}
        footer={[
          <Button
            className="btn-submit"
            key="submit"
            onClick={async () => {
              if (!(await disabled()))
                confirm({
                  cancelText: "Hủy",
                  okText: "Xác nhận",
                  title:
                    "Bạn có chắc là hủy chuyến ngay lập tức cho chuyến đi này?",
                  async onOk() {
                    setLoadingSubmit(true);

                    await emergencyService
                      .changeToSolvedStatus(session?.user.access_token!, {
                        emergencyId: dataEmergency?.id || "",
                        solution: dataEmergency?.solution || "",
                        isStopTrip: true,
                        bookingCancelReason: form.getFieldValue(
                          "bookingCancelReason"
                        ),
                      })
                      .then((res) => {
                        message.success("Thay đổi trạng thái thành công!", 1.5);

                        dispatch(
                          updateEmergencyStatus({
                            id: dataEmergency?.id ?? "",
                            isStopTrip: true,
                          })
                        );

                        form.resetFields();
                        onClose();
                      })
                      .catch((errors) => {
                        message.error(errors.response.data, 1.5);
                      })
                      .finally(() => {
                        setLoadingSubmit(false);
                      });
                  },
                  onCancel() {},
                });
            }}
          >
            Xác nhận
          </Button>,
        ]}
      >
        <div className="relative -left-16 flex justify-center flex-col gap-4 m-auto">
          <Form
            ref={formRef}
            form={form}
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 16 }}
            style={{ width: "100%" }}
          >
            <Form.Item
              name="bookingCancelReason"
              label="Lý do hủy chuyến"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập lý do hủy chuyến",
                },
                { type: "string" },
              ]}
              style={{ marginLeft: "12px", marginRight: "12px" }}
            >
              <Input.TextArea
                placeholder="Vui lòng nhập lý do hủy chuyến"
                className="h-9"
              />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default ModalCancelBookingImmediately;

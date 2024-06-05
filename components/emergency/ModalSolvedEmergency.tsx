import React, { useRef, useState, useEffect } from "react";
import { Button, Input, Modal, message, Checkbox, CheckboxProps } from "antd";
import { Form } from "antd";
import useSelector from "@hooks/use-selector";
import { useSession } from "next-auth/react";
import { EmergencyType } from "@models/emergency";
const { confirm } = Modal;
import emergencyService from "@services/emergency";
import { EmergencyStatusEnum } from "@utils/enum";
import {
  updateHavingNotiEmergencyStatus,
  removeFirstDataEmergency,
  updateEmergencyStatusToSolved,
} from "@slices/emergency";
import useDispatch from "@hooks/use-dispatch";
import { setStaffIsFreeStatus } from "@slices/staff";

interface Props {
  open: boolean;
  onClose: () => void;
  dataEmergency: EmergencyType | undefined;
  onSubmit: () => void;
  setEmergencyListData: React.Dispatch<React.SetStateAction<EmergencyType[]>>;
}

const ModalSolvedEmergency: React.FC<Props> = (props) => {
  const formRef = useRef(null);
  const dispatch = useDispatch();

  const { data: session } = useSession();
  const [form] = Form.useForm();
  const { onSubmit, open, onClose, dataEmergency, setEmergencyListData } =
    props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [isStopTrip, setIsStopTrip] = useState<boolean>(false);
  const { dataEmergencyListInQueue, havingNotiEmergency } = useSelector(
    (state) => state.emergency
  );
  const { isFree } = useSelector((state) => state.staff);

  const disabled = async () => {
    var result = false;
    try {
      await form.validateFields();
    } catch (errorInfo) {
      result = true;
    }
    return result;
  };

  const onChangeCheckBoxStopTrip: CheckboxProps["onChange"] = (e) => {
    setIsStopTrip(e.target.checked);
  };

  return (
    <>
      <Modal
        title={
          <span className="inline-block m-auto">Form giải quyết vấn đề</span>
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
                  title: "Bạn có chắc là đã giải quyết khẩn cấp này rồi chứ?",
                  async onOk() {
                    setLoadingSubmit(true);

                    await emergencyService
                      .changeToSolvedStatus(session?.user.access_token!, {
                        emergencyId: dataEmergency?.id || "",
                        solution: form.getFieldValue("solution"),
                        isStopTrip: isStopTrip,
                        bookingCancelReason: form.getFieldValue(
                          "bookingCancelReason"
                        ),
                      })
                      .then((res) => {
                        onSubmit();
                        message.success("Thay đổi trạng thái thành công!", 1.5);
                        dispatch(removeFirstDataEmergency());
                        dispatch(setStaffIsFreeStatus(true));
                        dispatch(updateHavingNotiEmergencyStatus(false));
                        dispatch(
                          updateEmergencyStatusToSolved(dataEmergency?.id ?? "")
                        );

                        setEmergencyListData((prevData: any) =>
                          prevData.map((item: EmergencyType) =>
                            item.id === dataEmergency?.id
                              ? {
                                  ...item,
                                  status: EmergencyStatusEnum.Solved,
                                  isStopTrip: isStopTrip,
                                }
                              : item
                          )
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
              name="solution"
              label="Cách giải quyết"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập cách giải quyết",
                },
                { type: "string" },
              ]}
              style={{ marginLeft: "12px", marginRight: "12px" }}
            >
              <Input.TextArea
                placeholder="Vui lòng nhập cách giải quyết"
                className="h-9"
              />
            </Form.Item>
            <Form.Item
              name="isStopTrip"
              label="Dừng chuyến ngay"
              rules={[{ type: "boolean" }]}
              style={{ marginLeft: "12px", marginRight: "12px" }}
              valuePropName="isStopTrip"
            >
              <Checkbox
                checked={isStopTrip}
                onChange={onChangeCheckBoxStopTrip}
              />
            </Form.Item>
            {isStopTrip && (
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
            )}
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default ModalSolvedEmergency;

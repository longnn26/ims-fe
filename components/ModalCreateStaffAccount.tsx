import React, { useRef, useState, useEffect } from "react";
import { Button, Input, Modal, message, Checkbox, CheckboxProps } from "antd";
import { Form } from "antd";
import useSelector from "@hooks/use-selector";
import { useSession } from "next-auth/react";
import { SupportType } from "@models/support";
const { confirm } = Modal;
import supportService from "@services/support";
import { EmergencyStatusEnum, SupportStatusEnum } from "@utils/enum";
import { TypeOptions, toast } from "react-toastify";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit?: () => void;
}

const ModalCreateStaffAccount: React.FC<Props> = (props) => {
  const formRef = useRef(null);
  const { data: session } = useSession();
  const [form] = Form.useForm();
  const { onSubmit, open, onClose } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [isStopTrip, setIsStopTrip] = useState<boolean>(false);

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
          <span className="inline-block m-auto">Tạo tài khoản tài xế</span>
        }
        width={1100}
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
                    "Bạn có chắc là tạm thời không thể giải quyết đơn hỗ trợ này?",
                  async onOk() {
                    setLoadingSubmit(true);

                    // await supportService
                    //   .changeToCantSolvedStatus(session?.user.access_token!, {
                       
                    //   })
                    //   .then((res) => {
                       

                    //     toast(`Đánh dấu tạm thời chưa giải quyết thành công!`, {
                    //       type: "success" as TypeOptions,
                    //       position: "top-right",
                    //     });
                    //   })
                    //   .catch((errors) => {
                    //     toast(`${errors.response.data}`, {
                    //       type: "error" as TypeOptions,
                    //       position: "top-right",
                    //     });
                    //     console.log("errors to change support status", errors);
                    //   })
                    //   .finally(() => {
                    //     onClose();
                    //     setLoadingSubmit(false);
                    //   });
                  },
                  onCancel() {},
                });
            }}
          >
            Gửi
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
              name="note"
              label="Lý do: "
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập lý do!",
                },
                { type: "string" },
              ]}
              className="mx-3"
            >
              <Input.TextArea
                placeholder="Vui lòng nhập lý do"
                className="h-9"
              />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default ModalCreateStaffAccount;

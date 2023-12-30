import React, { useEffect, useRef, useState } from "react";
import { Button, Input, Modal, Select, message } from "antd";
import { Form } from "antd";
import { SACreateModel } from "@models/serverAllocation";
import useSelector from "@hooks/use-selector";
import { ParamGet } from "@models/base";
import { Customer } from "@models/customer";
import customerService from "@services/customer";
import { useSession } from "next-auth/react";
import { areInArray, parseJwt } from "@utils/helpers";
import serverAllocationService from "@services/serverAllocation";
import { ROLE_CUSTOMER } from "@utils/constants";
const { confirm } = Modal;
const { Option } = Select;

interface Props {
  open: boolean;
  onClose: () => void;
  // loadingSubmit: boolean;
  onSubmit: (isClose: boolean) => void;
  customerParamGet?: ParamGet;
  setCustomerParamGet?: (value: ParamGet) => void;
}

const ModalCreate: React.FC<Props> = (props) => {
  const formRef = useRef(null);
  const [form] = Form.useForm();
  const { onSubmit, open, onClose, customerParamGet, setCustomerParamGet } =
    props;
  const { data: session, update: sessionUpdate } = useSession();

  const [confirmLoading, setConfirmLoading] = useState(false);
  const { customerData } = useSelector((state) => state.serverAllocation);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [pageSizeCus, setPageSizeCus] = useState<number>(6);
  const [totalPageCus, setTotalPageCus] = useState<number>(2);
  const [pageIndexCus, setPageIndexCus] = useState<number>(0);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [openModalCreate, setOpenModalCreate] = useState<boolean | undefined>(
    undefined
  );

  const disabled = async () => {
    var result = false;
    try {
      await form.validateFields();
    } catch (errorInfo) {
      result = true;
    }
    return result;
  };

  const getMoreCustomer = async () => {
    await customerService
      .getData(session?.user.access_token!, {
        PageIndex: pageIndexCus + 1,
        PageSize: pageSizeCus,
      } as ParamGet)
      .then(async (data) => {
        setTotalPageCus(data.totalPage);
        setPageIndexCus(data.pageIndex);
        setCustomers([...customers, ...data.data]);
      });
  };

  useEffect(() => {
    session && getMoreCustomer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  return (
    <>
      <Modal
        title={
          <span className="inline-block m-auto">Create server allocation</span>
        }
        open={openModalCreate === undefined ? open : openModalCreate}
        confirmLoading={confirmLoading}
        onCancel={() => {
          onClose();
          setOpenModalCreate(undefined);
          form.resetFields();
        }}
        footer={[
          <Button
            // loading={loadingSubmit}
            className="btn-submit"
            key="submit"
            onClick={async () => {
              if (!(await disabled()))
                confirm({
                  title: "Do you want to save?",
                  async onOk() {
                    const data = {
                      name: form.getFieldValue("name"),
                      serialNumber: form.getFieldValue("serialNumber"),
                      power: form.getFieldValue("power"),
                      note: form.getFieldValue("note"),
                    } as SACreateModel;
                    setLoadingSubmit(true);
                    // Gọi hàm getCustomerServerData với id của người dùng
                    await serverAllocationService
                      .createServerAllocation(
                        session?.user.access_token!,
                        data
                      )
                      .then(() => {
                        message.success("Create successfully!");
                        form.resetFields();
                        setOpenModalCreate(undefined);
                        onClose();
                      })
                      .catch((errors) => {
                        message.error(errors.response.data)
                        setOpenModalCreate(true);
                      })
                      .finally(() => {
                        setLoadingSubmit(false);
                      })
                  },
                  onCancel() {},
                });
            }}
          >
            Submit
          </Button>,
        ]}
      >
        <div className="flex max-w-md flex-col gap-4 m-auto">
          <Form
            ref={formRef}
            form={form}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ width: "100%" }}
          >
            <Form.Item
              name="name"
              label="Server Name"
              rules={[{ required: true }]}
            >
              <Input placeholder="Server Name" allowClear />
            </Form.Item>
            <Form.Item
              name="serialNumber"
              label="Serial Number"
              rules={[{ required: true }]}
            >
              <Input placeholder="Serial Number" allowClear />
            </Form.Item>
            <Form.Item
              name="power"
              label="Power"
              rules={[
                {
                  required: true,
                },
                {
                  pattern: new RegExp(/^[0-9]+$/),
                  message: "Power must be a number",
                },
              ]}
            >
              <Input placeholder="Power" allowClear />
            </Form.Item>
            <Form.Item name="note" label="Note">
              <Input placeholder="Note" allowClear />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default ModalCreate;

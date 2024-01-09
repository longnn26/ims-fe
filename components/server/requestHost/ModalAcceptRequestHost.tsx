import { ParamGet } from "@models/base";
import { User } from "@models/user";
import requestHost from "@services/requestHost";
import authService from "@services/user";
import { Button, Form, Input, Modal, Select, message } from "antd";
import { useSession } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";
const { confirm } = Modal;
const { Option } = Select;

interface Props {
  open: boolean;
  onClose: () => void;
  getData: () => void;
  requestHostId: number;
}

const ModalAcceptRequestHost: React.FC<Props> = (props) => {
  const formRef = useRef(null);
  const [form] = Form.useForm();
  const { open, onClose, requestHostId, getData } = props;
  const { data: session, update: sessionUpdate } = useSession();

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [userTech, setUserTech] = useState<User[]>([]);
  const [pageSizeCus, setPageSizeCus] = useState<number>(6);
  const [totalPageCus, setTotalPageCus] = useState<number>(2);
  const [pageIndexCus, setPageIndexCus] = useState<number>(0);

  const disabled = async () => {
    var result = false;
    try {
      await form.validateFields();
    } catch (errorInfo) {
      result = true;
    }
    return result;
  };

  const getMoreUserTech = async () => {
    await authService
      .getUserTechData(session?.user.access_token!, {
        PageIndex: pageIndexCus + 1,
        PageSize: pageSizeCus,
      } as ParamGet)
      .then(async (data) => {
        setTotalPageCus(data.totalPage);
        setPageIndexCus(data.pageIndex);
        setUserTech([...userTech, ...data.data]);
      });
  };

  useEffect(() => {
    session && getMoreUserTech();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  return (
    <>
      <Modal
        title={<span className="inline-block m-auto">Accept IP Request</span>}
        open={open}
        confirmLoading={confirmLoading}
        onCancel={() => {
          onClose();
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
                  title: "Do you want to accept?",
                  async onOk() {
                    await requestHost
                      .acceptRequestHost(
                        session?.user.access_token!,
                        requestHostId + "",
                        form.getFieldValue("saleNote")
                      )
                      .then((res) => {
                        message.success("Accept IP Request successfully!", 1.5);
                        getData();
                        onClose();
                      })
                      .catch((errors) => {
                        message.error(errors.response.data, 1.5);
                      })
                      .finally(() => {});
                    form.resetFields();
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
            {/* <Form.Item
              name="userTechId"
              label="Technical Staff"
              labelAlign="right"
              rules={[{ required: true, message: "Technical staff not empty" }]}
            >
              <Select
                labelInValue
                allowClear
                listHeight={160}
                onPopupScroll={async (e: any) => {
                  const { target } = e;
                  if (
                    (target as any).scrollTop + (target as any).offsetHeight ===
                    (target as any).scrollHeight
                  ) {
                    if (pageIndexCus < totalPageCus) {
                      getMoreUserTech();
                    }
                  }
                }}
              >
                {userTech.map((l, index) => (
                  <Option value={l.id} label={l?.fullname} key={index}>
                    {l.fullname}
                  </Option>
                ))}
              </Select>
            </Form.Item> */}

            <Form.Item
              name="saleNote"
              label="Sale Staff Note"
              rules={[{ required: true }]}
            >
              <Input placeholder="Sale Staff Note" allowClear />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default ModalAcceptRequestHost;

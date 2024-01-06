import React, { useRef, useState } from "react";
import { Button, Input, Modal, Select, Space, Spin, message } from "antd";
import { Form } from "antd";
import { IpSubnetCreateModel } from "@models/ipSubnet";
import { CloseOutlined } from "@ant-design/icons";
import ipSubnetService from "@services/ipSubnet";
import { useSession } from "next-auth/react";
import ipAddress from "@services/ipAddress";
import { IpAddress } from "@models/ipAddress";
const { confirm } = Modal;
const { Option } = Select;

interface Props {
    record: IpAddress | undefined;
    onClose: () => void;
    onSubmit: () => void;
}

const ModalBlock: React.FC<Props> = (props) => {
    const formRef = useRef(null);
    const [form] = Form.useForm();
    const { record, onClose, onSubmit } = props;
    const { data: session } = useSession();

    const [confirmLoading, setConfirmLoading] = useState(false);
    const [loading, setLoading] = useState(false);

    const disabled = async () => {
        var result = false;
        try {
            await form.validateFields();
        } catch (errorInfo) {
            result = true;
        }
        return result;
    };

    const blockIp = async (reason: string) => {
        setLoading(true);
        await ipAddress.blockIp(
            session?.user.access_token!,
            reason,
            record?.id!
        ).then((res) => {
            message.success("Block IP successfully!", 1.5);
            onSubmit();
            form.resetFields();
        }).catch((errors) => {
            message.error(errors.response.data, 1.5);
        }).finally(() => {
            setLoading(false);
        })
    };

    return (
        <>
            <Modal
                title={<span className="inline-block m-auto">Block IP</span>}
                open={Boolean(record)}
                confirmLoading={confirmLoading}
                onCancel={() => {
                    onClose();
                    form.resetFields();
                }}
                footer={[
                    <Button
                        disabled={loading}
                        loading={confirmLoading}
                        className="btn-submit"
                        key="submit"
                        onClick={async () => {
                            if (!(await disabled()))
                                confirm({
                                    title: "Do you want to save?",
                                    async onOk() {
                                        blockIp(
                                            form.getFieldValue("reason")
                                        );
                                    },
                                    onCancel() { },
                                });
                        }}
                    >
                        Submit
                    </Button>,
                ]}
            >
                <Spin spinning={loading}>
                    <div className="flex max-w-md flex-col gap-4 m-auto">
                        <Form
                            ref={formRef}
                            form={form}
                            style={{ width: "100%" }}
                            layout="vertical"
                        >
                            <Form.Item
                                name="ipAddresss"
                                label="Ip Addresss"
                                initialValue={record?.address}
                            >
                                <Input readOnly />
                            </Form.Item>
                            <Form.Item name="reason" label="Reason" rules={[{ required: true, max: 2000 }]}>
                                <Input.TextArea autoSize={{ minRows: 1, maxRows: 6 }} placeholder="Reason" allowClear />
                            </Form.Item>
                        </Form>
                    </div>
                </Spin>
            </Modal>
        </>
    );
};

export default ModalBlock;

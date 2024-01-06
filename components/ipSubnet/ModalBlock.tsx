import React, { useEffect, useRef, useState } from "react";
import { Button, Input, Modal, Select, Space, Spin, message } from "antd";
import { Form } from "antd";
import { IpSubnet, IpSubnetCreateModel } from "@models/ipSubnet";
import { CloseOutlined } from "@ant-design/icons";
import ipSubnetService from "@services/ipSubnet";
import { useSession } from "next-auth/react";
import ipAddress from "@services/ipAddress";
import { IpAddress, IpAddressParamGet } from "@models/ipAddress";
const { confirm } = Modal;
const { Option } = Select;

interface Props {
    subnetId: string;
    open: boolean;
    onClose: () => void;
    onSubmit: () => void;
}

const ModalBlock: React.FC<Props> = (props) => {
    const formRef = useRef(null);
    const [form] = Form.useForm();
    const { subnetId, open, onClose, onSubmit } = props;
    const { data: session } = useSession();

    const [pageSize, setPageSize] = useState<number>(6);
    const [totalPageCus, setTotalPageCus] = useState<number>(2);
    const [pageIndexCus, setPageIndexCus] = useState<number>(0);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [ipAddresses, setIpAddresses] = useState<IpAddress[]>([]);

    const disabled = async () => {
        var result = false;
        try {
            await form.validateFields();
        } catch (errorInfo) {
            result = true;
        }
        return result;
    };

    const blockIp = async (reason: string, id: number[]) => {
        setLoading(true);
        await ipAddress.blockIp(
            session?.user.access_token!,
            reason,
            id
        ).then((res) => {
            message.success("Block IPs successfully!", 1.5);
            onSubmit();
            form.resetFields();
        }).catch((errors) => {
            message.error(errors.response.data, 1.5);
        }).finally(() => {
            setLoading(false);
        })
    };

    const setFieldsValueInitial = async () => {
        var subnetDetail = "";
        await ipSubnetService
            .getDetail(session?.user.access_token!, subnetId)
            .then(async (res) => {
                subnetDetail = `${res?.firstOctet!}.${res?.secondOctet!}.${res?.thirdOctet!}.${res?.fourthOctet!}/${res?.prefixLength!}`
            });
        if (formRef.current)
            form.setFieldsValue({
                subnet: subnetDetail
            });
    };

    const getMoreIp = async () => {
        await ipAddress
            .getData(session?.user.access_token!, {
                PageIndex: pageIndexCus + 1,
                PageSize: pageSize,
                IsBlocked: false,
                SubnetId: parseInt(subnetId),
                Purpose: ["Host"]
            } as unknown as IpAddressParamGet)
            .then(async (data) => {
                setTotalPageCus(data.totalPage);
                setPageIndexCus(data.pageIndex);
                setIpAddresses([...ipAddresses, ...data.data]);
            });
    };

    useEffect(() => {
        session && getMoreIp();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session]);

    useEffect(() => {
        // refresh after submit for fileList
        if (subnetId && formRef.current) {
            setFieldsValueInitial();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    return (
        <>
            <Modal
                title={<span className="inline-block m-auto">Block IPs</span>}
                open={open}
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
                                    title: "Do you want to block these IPs?",
                                    async onOk() {
                                        blockIp(
                                            form.getFieldValue("reason"),
                                            form.getFieldValue("ids")
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
                <Spin spinning={loading} tip="Blocking IPs..." size="large">
                    <div className="flex max-w-md flex-col gap-4 m-auto">
                        <Form
                            ref={formRef}
                            form={form}
                            style={{ width: "100%" }}
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 20 }}
                            name="dynamic_form_complex"
                        >
                            <Form.Item
                                name="subnet"
                                label="Subnet"
                            >
                                <Input readOnly />
                            </Form.Item>
                            <Form.Item name="reason" label="Reason" rules={[{ required: true, max: 2000 }]}>
                                <Input.TextArea autoSize={{ minRows: 1, maxRows: 6 }} placeholder="Reason" allowClear />
                            </Form.Item>
                            <Form.Item
                                name="ids"
                                label="IP Addresses"
                                rules={[{ required: true, message: "Please select at least an IP Address" }]}
                            >
                                <Select
                                    mode="multiple"
                                    placeholder="Please select IPs to blocks"
                                    allowClear
                                    listHeight={160}
                                    onPopupScroll={async (e: any) => {
                                        const { target } = e;
                                        if (
                                            (target as any).scrollTop + (target as any).offsetHeight === (target as any).scrollHeight
                                        ) {
                                            if (pageIndexCus < totalPageCus) {
                                                getMoreIp();
                                            }
                                        }
                                    }}
                                >
                                    {ipAddresses.map((l, index) => (
                                        <Option key={l.id} value={l.id}>{`${l.address}`}</Option>
                                    ))}

                                </Select>
                            </Form.Item>
                        </Form>
                    </div>
                </Spin>
            </Modal>
        </>
    );
};

export default ModalBlock;

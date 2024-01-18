import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Button,
  Input,
  Modal,
  Select,
  Space,
  Spin,
  Tabs,
  TabsProps,
  message,
} from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { Form } from "antd";
import {
  RequestExpandUpdateModel,
  RequestExpand,
  SuggestLocation,
  RequestedLocation,
} from "@models/requestExpand";
import { useSession } from "next-auth/react";
import { Location, LocationParamGet } from "@models/location";
import locationService from "@services/location";
import areaService from "@services/area";
import requestExpandService from "@services/requestExpand";
import { Area, AreaData } from "@models/area";
import { ParamGet } from "@models/base";
import { Rack } from "@models/rack";
import { BsFillHddNetworkFill } from "react-icons/bs";
import { error } from "console";
import { useRouter } from "next/router";

const { confirm } = Modal;
const { Option } = Select;

interface Props {
  requestExpand: RequestExpand;
  suggestLocation?: SuggestLocation;
  onClose: () => void;
  onSubmit: () => void;
  onSaveLocation: (data: RequestedLocation) => void;
  open: boolean;
}

const ModalUpdate: React.FC<Props> = (props) => {
  const formRef = useRef(null);
  const router = useRouter();
  const { data: session } = useSession();
  const [form] = Form.useForm();
  const {
    onSubmit,
    requestExpand,
    onClose,
    onSaveLocation,
    open,
  } = props;

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [paramGet, setParamGet] = useState<LocationParamGet>({
    PageIndex: 0,
    PageSize: 6,
  } as LocationParamGet);
  const [totalPage, setTotalPage] = useState<number>(2);
  const [selectedLocation, setSelectedLocation] = useState<number>();
  const [locationList, setLocationList] = useState<Location[]>([]);
  const [rackParamGet, setRackParamGet] = useState<ParamGet>({
    PageIndex: 0,
    PageSize: 6,
  } as ParamGet);
  const [rackList, setRackList] = useState<Rack[]>([]);
  const [rackTotalPage, setRackTotalPage] = useState<number>(2);
  const [selectedRack, setSelectedRack] = useState<number>();
  const [areaList, setAreaList] = useState<Area[]>([]);
  const [selectedArea, setSelectedArea] = useState<number>();
  const [loading, setLoading] = useState<boolean>(false);
  const [suggestLocation, setSuggestLocation] = useState<SuggestLocation>();

  const disabled = async () => {
    var result = false;
    try {
      await form.validateFields();
    } catch (errorInfo) {
      result = true;
    }
    return result;
  };

  const setFieldsValueInitial = () => {
    if (formRef.current)
      form.setFieldsValue({
        id: requestExpand.id,
        size: requestExpand.size,
        techNote: requestExpand.techNote,
      });
  };

  const getMoreArea = async () => {
    await areaService
      .getAllArea(session?.user.access_token!)
      .then(async (data) => {
        setAreaList(data);
      });
  };

  const getMoreRack = async (areaId: number) => {
    rackParamGet.PageIndex += 1;
    await areaService
      .getRackDataById(session?.user.access_token!, areaId.toString(), {
        ...rackParamGet,
      })
      .then(async (data) => {
        setRackTotalPage(data.totalPage);
        rackParamGet.PageIndex = data.pageIndex;
        setRackList([...rackList, ...data.data]);
      });
  };

  const getMoreLocation = async (rackId: number) => {
    paramGet.PageIndex += 1;
    await locationService
      .getData(session?.user.access_token!, {
        ...paramGet,
        RackId: rackId,
        Size: form.getFieldValue("size"),
      })
      .then(async (data) => {
        setTotalPage(data.totalPage);
        paramGet.PageIndex = data.pageIndex;
        setLocationList([...locationList, ...data.data]);
      });
  };

  const assignLocation = async (locationId: number) => {
    setLoading(true);
    await requestExpandService
      .saveLocation(session?.user.access_token!, requestExpand.id, {
        rackId: selectedRack,
        startPosition: locationId,
      } as RequestedLocation)
      .then((res) => {
        message.success("Assign server to rack successfully!", 1.5);
        form.resetFields();
        onClose();
      })
      .catch((errors) => {
        message.error(errors.response.data, 1.5);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const updateData = async (data: RequestExpandUpdateModel) => {
    await requestExpandService
      .updateData(session?.user.access_token!, data)
      .then(async (res) => {
        message.success("Update successfully!", 1.5);
        await requestExpandService
          .getDetail(
            session?.user.access_token!,
            router.query.requestExpandId + ""
          )
          .then(async (res) => {
              await requestExpandService
                .getSuggestLocation(
                  session?.user.access_token!,
                  res?.id!
                )
                .then((res) => {
                  setSuggestLocation(res);
                })
                .catch((e) => {});
          });
      })
      .catch((errors) => {
        message.error(errors.response.data, 1.5);
      });
  };

  useEffect(() => {
    if (session) {
      setFieldsValueInitial();
      getMoreArea();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (selectedArea) {
      getMoreRack(selectedArea);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedArea]);

  useEffect(() => {
    if (selectedRack) {
      getMoreLocation(selectedRack);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRack]);

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Information",
      children: (
        <>
          <div className="flex max-w-md flex-col gap-4 m-auto">
            <Form
              ref={formRef}
              form={form}
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ width: "100%" }}
            >
              <Form.Item
                name="size"
                label="Size (U)"
                rules={[
                  { required: true },
                  {
                    pattern: new RegExp(/^[0-9]+$/),
                    message: "Size must be a number greater than 0",
                  },
                ]}
              >
                <Input placeholder="Size" allowClear />
              </Form.Item>
              <Form.Item name="techNote" label="Technical Note">
                <Input placeholder="Technical Note" allowClear />
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button
                  // loading={loadingSubmit}
                  className="btn-submit"
                  key="submit"
                  onClick={async () => {
                    if (!(await disabled()))
                      confirm({
                        title: "Do you want to save?",
                        async onOk() {
                          updateData({
                            id: requestExpand.id,
                            size: Number.parseInt(form.getFieldValue("size")),
                            techNote: form.getFieldValue("techNote"),
                          } as RequestExpandUpdateModel);
                          // form.resetFields();
                        },
                        onCancel() {},
                      });
                  }}
                >
                  Update
                </Button>
              </Form.Item>
            </Form>
          </div>
        </>
      ),
    },
    {
      key: "2",
      label: "Location",
      children: (
        <>
          <Spin
            spinning={loading}
            tip="Assigning server to rack..."
            size="large"
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              {Boolean(suggestLocation) && (
                <Alert
                  message="Suggest location"
                  description={`${suggestLocation?.area.name}${
                    suggestLocation?.rack.row! + 1
                  } - ${suggestLocation?.rack.column! + 1} start from U${
                    suggestLocation?.position !== undefined
                      ? suggestLocation.position + 1
                      : ""
                  }`}
                  type="success"
                  showIcon
                  action={
                    <Button
                      size="small"
                      type="text"
                      icon={<SaveOutlined />}
                      onClick={() => {
                        onSaveLocation({
                          rackId: suggestLocation?.rack.id!,
                          startPosition: suggestLocation?.position!,
                        });
                      }}
                    >
                      Save
                    </Button>
                  }
                />
              )}
              {Boolean(requestExpand?.requestedLocation) && (
                <Alert
                  message="Location"
                  description={`${requestExpand.chosenLocation}`}
                  type="info"
                  showIcon
                />
              )}
              <Space.Compact style={{ width: "100%" }}>
                <div
                  className="flex-grow"
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <span className="mt-4" style={{ fontWeight: 500 }}>
                    Select another start location
                  </span>
                  <div className="flex flex-grow m-2">
                    <span className="mt-1 mr-2">Area: </span>
                    <Select
                      placeholder="Please select a rack area"
                      labelInValue
                      listHeight={160}
                      style={{ width: "100%" }}
                      filterOption={(inputValue, option) => {
                        return Boolean(
                          option?.label?.toString().includes(inputValue)
                        );
                      }}
                      onSelect={(value) => {
                        rackParamGet.PageIndex = 0;
                        setRackList([]);
                        setSelectedArea(value.value);
                      }}
                    >
                      {areaList.map((l, index) => (
                        <Option value={l.id} label={`${l?.name}`} key={index}>
                          {`${l?.name}`}
                        </Option>
                      ))}
                    </Select>
                  </div>
                  <div className="flex flex-grow m-2">
                    <span className="mt-1 mr-2">Rack: </span>
                    <Select
                      placeholder="Please select a rack area"
                      labelInValue
                      listHeight={160}
                      style={{ width: "100%" }}
                      filterOption={(inputValue, option) => {
                        return Boolean(
                          option?.label?.toString().includes(inputValue)
                        );
                      }}
                      onPopupScroll={async (e: any) => {
                        const { target } = e;
                        if (
                          (target as any).scrollTop +
                            (target as any).offsetHeight ===
                          (target as any).scrollHeight
                        ) {
                          if (rackParamGet.PageIndex < rackTotalPage) {
                            getMoreRack(selectedArea!);
                          }
                        }
                      }}
                      onSelect={(value) => {
                        paramGet.PageIndex = 0;
                        setLocationList([]);
                        setSelectedRack(value.value);
                      }}
                    >
                      {rackList.map((l, index) => (
                        <Option
                          value={l.id}
                          label={`${l?.area.name}${l.row + 1} - ${
                            l.column + 1
                          }`}
                          key={index}
                        >
                          {`${l?.area.name}${l.row + 1} - ${l.column + 1}`}
                        </Option>
                      ))}
                    </Select>
                  </div>
                  <div className="flex flex-grow m-2">
                    <span className="mt-1 mr-2" style={{ width: "19%" }}>
                      Start Position:{" "}
                    </span>
                    <Select
                      labelInValue
                      placeholder="Select a start position"
                      listHeight={160}
                      style={{ width: "80%" }}
                      onPopupScroll={async (e: any) => {
                        const { target } = e;
                        if (
                          (target as any).scrollTop +
                            (target as any).offsetHeight ===
                          (target as any).scrollHeight
                        ) {
                          if (paramGet.PageIndex < totalPage) {
                            getMoreLocation(selectedRack!);
                          }
                        }
                      }}
                      onSelect={(value) => {
                        setSelectedLocation(value.value);
                      }}
                    >
                      {locationList.map((l, index) => (
                        <Option
                          value={l.position}
                          label={`${l?.rack.area.name}${l?.rack.row + 1} - ${
                            l?.rack.column + 1
                          } U${l?.position + 1}`}
                          key={index}
                        >
                          {`${l?.rack.area.name}${l?.rack.row + 1} - ${
                            l?.rack.column + 1
                          } U${l?.position + 1}`}
                        </Option>
                      ))}
                    </Select>
                  </div>
                </div>
              </Space.Compact>{" "}
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                {selectedLocation !== undefined && (
                  <Button
                    loading={confirmLoading}
                    type="primary"
                    disabled={loading}
                    onClick={() => {
                      confirm({
                        title: "Do you want to save?",
                        async onOk() {
                          assignLocation(selectedLocation);
                        },
                        onCancel() {},
                      });
                    }}
                  >
                    Assign
                  </Button>
                )}
              </div>
            </Space>
          </Spin>
        </>
      ),
    },
  ];

  return (
    <>
      <Modal
        title={
          <span className="inline-block m-auto">
            Update Server Allocation Request
          </span>
        }
        open={open}
        confirmLoading={confirmLoading}
        onCancel={() => {
          onClose();
        }}
        footer={[]}
      >
        <Tabs defaultActiveKey="1" items={items} />
      </Modal>
    </>
  );
};

export default ModalUpdate;

"use client";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { Button, Input, Modal, Table, Switch, TimePicker } from "antd";
import { useSession } from "next-auth/react";
import { ConfigurationType } from "@models/configuration";
import configurationService from "@services/configuration";
import carService from "@services/car";
import {
  anotherOptionConfigurationPrice,
  translateConfigurationPriceToVietnamese,
} from "@utils/helpers";
import { CiEdit } from "react-icons/ci";
import { FiSave } from "react-icons/fi";
import { MdOutlineCancel } from "react-icons/md";
import { TypeOptions, toast } from "react-toastify";
import dayjs, { Dayjs } from "dayjs";
import ModalManageBrandVehicle from "@components/configuration/ModalManageBrandVehicle";
import { BrandCarType, ModelCarType } from "@models/car";
import ModalManageModelVehicle from "@components/configuration/ModalManageModelVehicle";

const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});
const { confirm } = Modal;
const { Column } = Table;

const Configuration: React.FC = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editableData, setEditableData] = useState<any>(null);
  const [dataSource, setDataSource] = useState<any>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

  const [tmpStartTime, setTmpStartTime] = useState<Dayjs | null>(null);
  const [tmpEndTime, setTmpEndTime] = useState<Dayjs | null>(null);

  const [tmpMinutesTime, setTmpMinutesTime] = useState<Dayjs | null>(null);

  //load data config
  const getConfigurationPriceData = async () => {
    setLoading(true);
    await configurationService
      .getAllConfigurationByAdmin(session?.user.access_token!)
      .then((res: ConfigurationType) => {
        setLoading(false);
        const dataSource = res
          ? [
              {
                key: "1",
                type: translateConfigurationPriceToVietnamese(
                  "baseFareFirst3km"
                ),
                price: res?.baseFareFirst3km?.price,
                isPercent: res?.baseFareFirst3km?.isPercent,
              },
              {
                key: "2",
                type: translateConfigurationPriceToVietnamese(
                  "fareFerAdditionalKm"
                ),
                price: res?.fareFerAdditionalKm?.price,
                isPercent: res?.fareFerAdditionalKm?.isPercent,
              },
              {
                key: "3",
                type: translateConfigurationPriceToVietnamese("driverProfit"),
                price: res?.driverProfit?.price,
                isPercent: res?.driverProfit?.isPercent,
              },
              {
                key: "4",
                type: translateConfigurationPriceToVietnamese("appProfit"),
                price: res?.appProfit?.price,
                isPercent: res?.appProfit?.isPercent,
              },
              {
                key: "5",
                type: translateConfigurationPriceToVietnamese("peakHours"),
                price: res?.peakHours?.price,
                isPercent: res?.peakHours?.isPercent,
                optionName: "time",
                optionValue: res?.peakHours?.time,
              },
              {
                key: "6",
                type: translateConfigurationPriceToVietnamese("nightSurcharge"),
                price: res?.nightSurcharge?.price,
                isPercent: res?.nightSurcharge?.isPercent,
                optionName: "time",
                optionValue: res?.nightSurcharge?.time,
              },
              {
                key: "7",
                type: translateConfigurationPriceToVietnamese(
                  "waitingSurcharge"
                ),
                price: res?.waitingSurcharge?.price,
                isPercent: res?.waitingSurcharge?.isPercent,
                optionName: "perMinutes",
                optionValue: res?.waitingSurcharge?.perMinutes,
              },
              {
                key: "8",
                type: translateConfigurationPriceToVietnamese("weatherFee"),
                price: res?.weatherFee?.price,
                isPercent: res?.weatherFee?.isPercent,
              },
              {
                key: "9",
                type: translateConfigurationPriceToVietnamese(
                  "customerCancelFee"
                ),
                price: res?.customerCancelFee?.price,
                isPercent: res?.customerCancelFee?.isPercent,
              },
              {
                key: "10",
                type: translateConfigurationPriceToVietnamese("searchRadius"),
                price: "",
                isPercent: "",
                optionName: "distance",
                optionValue: res?.searchRadius?.distance,
              },
            ]
          : [];
        setDataSource(dataSource);
      })
      .catch((errors) => {
        console.log("errors get configuration", errors);
      })
      .finally(() => {
        setLoading(false);
      });

    setLoading(true);
    await carService
      .getAllBrand(session?.user.access_token!)
      .then((res) => {
        setLoading(false);
        setDataBrandList(res);
      })
      .catch((errors) => {
        console.log("errors get all brand", errors);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const convertEditableDataToConfiguration = (
    editableData: any
  ): any | null => {
    const { key, ...rest } = editableData;
    switch (key) {
      case "1":
        return {
          baseFareFirst3km: rest,
        };
      case "2":
        return {
          fareFerAdditionalKm: rest,
        };
      case "3":
        return {
          driverProfit: rest,
        };
      case "4":
        return {
          appProfit: rest,
        };
      case "5":
        return {
          peakHours: {
            ...rest,
            time: rest.optionValue,
          },
        };
      case "6":
        return {
          nightSurcharge: {
            ...rest,
            time: rest.optionValue,
          },
        };
      case "7":
        return {
          waitingSurcharge: {
            ...rest,
            perMinutes: parseInt(rest.optionValue),
          },
        };
      case "8":
        return {
          weatherFee: rest,
        };
      case "9":
        return {
          customerCancelFee: rest,
        };
      default:
        return null;
    }
  };

  const convertMinutesToDayjs = (minutes: number): dayjs.Dayjs => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return dayjs()
      .set("hour", hours)
      .set("minute", remainingMinutes)
      .startOf("minute");
  };

  const editConfig = (record: any) => {
    console.log(record);
    setEditingKey(record.key);
    setEditableData({ ...record });

    if (record.optionName === "time") {
      if (!tmpStartTime || !tmpEndTime) {
        const optionValues = (record.optionValue || "")?.split("-");
        const startTime = optionValues[0];
        const endTime = optionValues[1];
        setTmpStartTime(startTime ? dayjs(startTime, "HH:mm") : null);
        setTmpEndTime(endTime ? dayjs(endTime, "HH:mm") : null);
      }
    }

    if (record.optionName === "perMinutes") {
      setTmpMinutesTime(convertMinutesToDayjs(record.optionValue));
    }
  };

  const saveConfig = () => {
    const newData = dataSource.map((item) => {
      if (item.key === editingKey) {
        return { ...editableData };
      }
      return item;
    });

    const optionValue = `${tmpStartTime?.format("HH:mm")}-${tmpEndTime?.format(
      "HH:mm"
    )}`;

    console.log("editableData", editableData);
    console.log("newData", newData);

    confirm({
      cancelText: "Hủy",
      okText: "Xác nhận",
      title: "Bạn có chắc là muốn thay đổi cấu hình này?",
      async onOk() {
        setLoadingSubmit(true);

        await configurationService
          .updatePriceConfigurationByAdmin(
            session?.user.access_token!,
            convertEditableDataToConfiguration({ ...editableData, optionValue })
          )
          .then((res) => {
            setEditableData({
              ...editableData,
              optionValue: optionValue,
            });

            toast(`Cập nhập cấu hình thành công!`, {
              type: "success" as TypeOptions,
              position: "top-right",
            });

            setDataSource(newData);

            setEditingKey(null);
          })
          .catch((errors) => {
            console.log("errors", errors);
            toast(`${errors}`, {
              type: "error" as TypeOptions,
              position: "top-right",
            });
          })
          .finally(() => {
            setLoadingSubmit(false);
          });
      },
      onCancel() {
        setEditingKey(null);
      },
    });
  };

  const cancelConfig = () => {
    setEditingKey(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setEditableData({ ...editableData, [field]: e.target.value });
  };

  const handleStartTimeChange = (time: Dayjs | null) => {
    setTmpStartTime(time);

    const optionValue = `${time?.format("HH:mm")}-${tmpEndTime?.format(
      "HH:mm"
    )}`;

    setEditableData({
      ...editableData,
      optionValue: optionValue,
    });
  };

  const handleEndTimeChange = (time: Dayjs | null) => {
    setTmpEndTime(time);

    const optionValue = `${tmpStartTime?.format("HH:mm")}-${time?.format(
      "HH:mm"
    )}`;

    setEditableData({
      ...editableData,
      optionValue: optionValue,
    });
  };

  const handleMinuteTimeChange = (time: Dayjs | null) => {
    setTmpMinutesTime(time);

    setEditableData({
      ...editableData,
      optionValue: time?.format("mm"),
    });
  };

  const handleSwitchChange = (checked: boolean) => {
    setEditableData({ ...editableData, isPercent: checked });
  };

  // xử lý config brand và model car
  const [openModalManageBrand, setOpenModalManageBrand] =
    useState<boolean>(false);
  const [openModalManageModel, setOpenModalManageModel] =
    useState<boolean>(false);

  const [dataBrandList, setDataBrandList] = useState<BrandCarType[]>([]);

  useEffect(() => {
    session && getConfigurationPriceData();
  }, [session]);

  return (
    <AntdLayoutNoSSR
      content={
        <>
          <div className="mb-4 bg-[#f8f9fa]/10 border border-gray-200 rounded-lg shadow-lg shadow-[#e7edf5]/50">
            <div className="mx-1 my-4 flex gap-4">
              <Button
                key="btn-brand"
                onClick={() => {
                  setOpenModalManageBrand(true);
                }}
              >
                Các hãng xe hiện có
              </Button>
              <Button
                key="btn-model"
                onClick={() => {
                  setOpenModalManageModel(true);
                }}
              >
                Các mẫu xe hiện có
              </Button>
            </div>

            <h3 className="mx-1 my-4">Bảng cấu hình</h3>
            <Table dataSource={dataSource} loading={loading}>
              <Column
                width={"20%"}
                title="Loại giá"
                dataIndex="type"
                key="type"
                render={(text, record: any) =>
                  editingKey === record.key ? (
                    <Input
                      value={editableData.type}
                      onChange={(e) => handleInputChange(e, "type")}
                    />
                  ) : (
                    text
                  )
                }
              />
              <Column
                width={"20%"}
                title="Tính tiền"
                dataIndex="price"
                key="price"
                render={(text, record: any) =>
                  record.price !== null &&
                  record.price !== "" &&
                  record.price !== undefined ? (
                    editingKey === record.key ? (
                      <Input
                        value={editableData.price}
                        onChange={(e) => handleInputChange(e, "price")}
                      />
                    ) : (
                      text
                    )
                  ) : null
                }
              />

              <Column
                width={"15%"}
                title="Tính theo phần trăm"
                dataIndex="isPercent"
                key="isPercent"
                render={(text, record: any) =>
                  record.isPercent !== "" &&
                  record.isPercent !== null &&
                  record.isPercent !== undefined ? (
                    editingKey === record.key ? (
                      <Switch
                        checked={editableData.isPercent}
                        onChange={handleSwitchChange}
                      />
                    ) : (
                      <Switch checked={record.isPercent} disabled />
                    )
                  ) : null
                }
              />

              <Column
                width={"25%"}
                title="Cấu hình khác"
                key="option"
                render={(_, record: any) =>
                  editingKey === record.key &&
                  editableData.optionName &&
                  editableData.optionValue ? (
                    <>
                      {editableData.optionName === "time" ? (
                        <>
                          <TimePicker
                            value={tmpStartTime}
                            onChange={handleStartTimeChange}
                            format="HH:mm"
                            style={{ marginRight: 8 }}
                            placeholder="Bắt đầu"
                          />
                          <TimePicker
                            value={tmpEndTime}
                            onChange={handleEndTimeChange}
                            format="HH:mm"
                            placeholder="Kết thúc"
                          />
                        </>
                      ) : editableData.optionName === "distance" ? (
                        <Input
                          value={editableData.optionValue}
                          onChange={(e) => handleInputChange(e, "optionValue")}
                        />
                      ) : (
                        <TimePicker
                          value={tmpMinutesTime}
                          onChange={handleMinuteTimeChange}
                          placeholder="Chọn phút"
                          format="mm"
                        />
                      )}
                    </>
                  ) : record.optionName && record.optionValue ? (
                    `${anotherOptionConfigurationPrice(record.optionName)}: ${
                      record.optionValue
                    }`
                  ) : null
                }
              />

              <Column
                title="Thao tác"
                key="action"
                render={(_, record: any) =>
                  editingKey === record.key ? (
                    <>
                      <Button onClick={saveConfig} type="link">
                        <FiSave className="w-5 h-5" />
                      </Button>
                      <Button onClick={cancelConfig} type="link">
                        <MdOutlineCancel className="w-5 h-5" />
                      </Button>
                    </>
                  ) : (
                    record.key !== "10" && (
                      <Button onClick={() => editConfig(record)} type="link">
                        <CiEdit className="w-5 h-5" />
                      </Button>
                    )
                  )
                }
              />
            </Table>

            <ModalManageBrandVehicle
              open={openModalManageBrand}
              onClose={() => {
                setOpenModalManageBrand(false);
              }}
              dataBrandList={dataBrandList}
              setDataBrandList={setDataBrandList}
              onSubmit={() => {}}
            />

            <ModalManageModelVehicle
              open={openModalManageModel}
              onClose={() => {
                setOpenModalManageModel(false);
              }}
              dataBrandList={dataBrandList}
              setDataBrandList={setDataBrandList}
              onSubmit={() => {}}
            />
          </div>
        </>
      }
    />
  );
};

export default Configuration;

"use client";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { Button, Input, Modal, Table, Switch } from "antd";
import { useSession } from "next-auth/react";
import { ConfigurationType } from "@models/configuration";
import configurationService from "@services/configuration";
import {
  anotherOptionConfigurationPrice,
  translateConfigurationPriceToVietnamese,
} from "@utils/helpers";
import { CiEdit } from "react-icons/ci";
import { FiSave } from "react-icons/fi";
import { MdOutlineCancel } from "react-icons/md";
import { TypeOptions, toast } from "react-toastify";

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

  const editConfig = (record: any) => {
    console.log();
    setEditingKey(record.key);
    setEditableData({ ...record });
  };

  const saveConfig = () => {
    const newData = dataSource.map((item) => {
      if (item.key === editingKey) {
        return { ...editableData };
      }
      return item;
    });

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
            convertEditableDataToConfiguration(editableData)
          )
          .then((res) => {
            convertEditableDataToConfiguration;
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

  const handleSwitchChange = (checked: boolean) => {
    setEditableData({ ...editableData, isPercent: checked });
  };

  useEffect(() => {
    session && getConfigurationPriceData();
  }, [session]);

  return (
    <AntdLayoutNoSSR
      content={
        <>
          <div className="mb-4 bg-[#f8f9fa]/10 border border-gray-200 rounded-lg shadow-lg shadow-[#e7edf5]/50">
            <Table dataSource={dataSource} loading={loading}>
              <Column
                width={"20%"}
                title="Loại giá"
                dataIndex="type"
                key="type"
              />
              <Column
                width={"20%"}
                title="Tính tiền"
                dataIndex="price"
                key="price"
                render={(text, record: any) =>
                  editingKey === record.key ? (
                    <Input
                      value={editableData.price}
                      onChange={(e) => handleInputChange(e, "price")}
                    />
                  ) : (
                    text
                  )
                }
              />
              <Column
                width={"20%"}
                title="Tính theo phần trăm"
                dataIndex="isPercent"
                key="isPercent"
                render={(text, record: any) =>
                  editingKey === record.key ? (
                    <Switch
                      checked={editableData.isPercent}
                      onChange={handleSwitchChange}
                    />
                  ) : (
                    <Switch checked={record.isPercent} disabled />
                  )
                }
              />
              <Column
                width={"20%"}
                title="Cấu hình khác"
                key="option"
                render={(_, record: any) =>
                  editingKey === record.key &&
                  editableData.optionName &&
                  editableData.optionValue ? (
                    <Input
                      value={editableData.optionValue}
                      onChange={(e) => handleInputChange(e, "optionValue")}
                    />
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
                    <Button onClick={() => editConfig(record)} type="link">
                      <CiEdit className="w-5 h-5" />
                    </Button>
                  )
                }
              />
            </Table>
          </div>
        </>
      }
    />
  );
};

export default Configuration;

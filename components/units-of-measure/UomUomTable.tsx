"use client";

import useSelector from "@hooks/use-selector";
import {
  Checkbox,
  Input,
  TableColumnsType,
  Select,
  message,
  Button,
  Space,
  Tooltip,
  Popconfirm,
} from "antd";
import { Table } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import useDispatch from "@hooks/use-dispatch";
import uomUomServices from "@services/uomUom";
import {
  UomUomCreate,
  UomUomInfo,
  UomUomUpdateFactor,
  UomUomUpdateInfo,
  UomUomUpdateType,
} from "@models/uomUom";
import { getUomUoms } from "@slices/uomUom";
import { useEffect, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
interface Props {
  accessToken: string;
  categoryId: string;
}

interface DataType {
  key: React.Key;
  id: string;
  name: string;
  categoryId: string;
  uomType: string;
  rounding: number;
  active: boolean;
  ratio: number;
}

const UomUomTable: React.FC<Props> = (props) => {
  const dispatch = useDispatch();
  const { accessToken, categoryId } = props;
  const { data: uomUomData, loading } = useSelector((state) => state.uomUom);
  const [data, setData] = useState<DataType[]>([]);

  const updateUomUomInfo = async (data: UomUomUpdateInfo) => {
    await uomUomServices
      .updateUomUomInfo(accessToken, data)
      .then(() => {
        dispatch(
          getUomUoms({
            token: accessToken,
            uomCategoryId: categoryId,
          })
        );
      })
      .catch((error) => {
        message.error(error?.response?.data);
      });
  };
  const updateUomUomFactor = async (data: UomUomUpdateFactor) => {
    await uomUomServices
      .updateUomUomFactor(accessToken, data)
      .then(() => {
        dispatch(
          getUomUoms({
            token: accessToken,
            uomCategoryId: categoryId,
          })
        );
      })
      .catch((error) => {
        message.error(error?.response?.data);
      });
  };
  const updateUomUomType = async (data: UomUomUpdateType) => {
    await uomUomServices
      .updateUomUomType(accessToken, data)
      .then(() => {
        dispatch(
          getUomUoms({
            token: accessToken,
            uomCategoryId: categoryId,
          })
        );
      })
      .catch((error) => {
        message.error(error?.response?.data);
      });
  };
  const handleBlur = async (
    event: React.FocusEvent<HTMLInputElement>,
    type: string,
    record: DataType
  ) => {
    const newValue = event.target.value;
    switch (type) {
      case "name":
        if (newValue !== record.name) {
          await updateUomUomInfo({
            id: record.id,
            name: newValue,
          } as UomUomUpdateInfo);
        }
        break;
      case "rounding":
        if (Number.parseFloat(newValue) !== record.rounding) {
          await updateUomUomInfo({
            id: record.id,
            rounding: Number.parseFloat(newValue),
          } as UomUomUpdateInfo);
        }
        break;
      case "factor":
        if (Number.parseFloat(newValue) !== record.ratio) {
          await updateUomUomFactor({
            id: record.id,
            factor: Number.parseFloat(newValue),
          } as UomUomUpdateFactor);
        }
        break;
      default:
        break;
    }
  };
  const handleActiveChange = async (e, record: DataType) => {
    const newValue = e.target.checked;
    if (newValue !== record.active) {
      await updateUomUomInfo({
        id: record.id,
        active: newValue,
      } as UomUomUpdateInfo);
    }
  };
  const handleUomTypeChange = async (newValue: string, record: DataType) => {
    if (newValue !== record.uomType) {
      await updateUomUomType({
        id: record.id,
        uomType: newValue,
      } as UomUomUpdateType);
    }
  };
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    key: React.Key,
    field: string
  ) => {
    const newData = data.map((item) => {
      if (item.key === key) {
        return { ...item, [field]: event.target.value };
      }
      return item;
    });
    setData(newData);
  };
  const createUomUom = async () => {
    await uomUomServices
      .createUomUom(accessToken, {
        categoryId: categoryId,
      } as UomUomCreate)
      .then(() => {
        dispatch(
          getUomUoms({
            token: accessToken,
            uomCategoryId: categoryId,
          })
        );
      })
      .catch((error) => {
        message.error(error?.response?.data);
      });
  };
  const deleteUomUom = async (record: DataType) => {
    await uomUomServices
      .deleteUomUom(accessToken, record.id)
      .then(() => {
        dispatch(
          getUomUoms({
            token: accessToken,
            uomCategoryId: categoryId,
          })
        );
      })
      .catch((error) => {
        message.error(error?.response?.data);
      });
  };
  const columns: TableColumnsType<DataType> = [
    {
      title: "Name",
      key: "name",
      width: "20%",
      fixed: true,
      render: (record: DataType) => (
        <>
          <Input
            required
            style={{ cursor: "pointer" }}
            placeholder="Name"
            variant="borderless"
            defaultValue={record.name}
            onBlur={(event) => {
              handleBlur(event, "name", record);
            }}
          />
        </>
      ),
    },
    {
      title: "Type",
      key: "uomType",
      // width: "20%",
      render: (record: DataType) => (
        <Select
          variant="borderless"
          value={record.uomType}
          // style={{ width: 120 }}
          onChange={(value) => {
            handleUomTypeChange(value, record);
          }}
          options={[
            {
              value: "Smaller",
              label: "Smaller than the reference Unit of Measure",
            },
            {
              value: "Bigger",
              label: "Bigger than the reference Unit of Measure",
            },
            {
              value: "Reference",
              label: "Reference Unit of Measure for this category",
            },
          ]}
        />
      ),
    },
    {
      title: "Ratio",
      key: "ratio",
      width: "15%",
      render: (record: DataType) => (
        <>
          <Input
            type="number"
            style={{ cursor: "pointer" }}
            required
            placeholder="Ratio"
            variant="borderless"
            defaultValue={record.ratio}
            value={record.ratio}
            onBlur={(event) => {
              handleBlur(event, "factor", record);
            }}
            onChange={(event) => handleInputChange(event, record.key, "ratio")}
          />
        </>
      ),
    },
    {
      title: "Rounding",
      key: "rounding",
      width: "15%",
      render: (record: DataType) => (
        <>
          <Input
            type="number"
            style={{ cursor: "pointer" }}
            required
            placeholder="Rounding"
            variant="borderless"
            defaultValue={record.rounding}
            onBlur={(event) => {
              handleBlur(event, "rounding", record);
            }}
            onChange={(event) =>
              handleInputChange(event, record.key, "rounding")
            }
          />
        </>
      ),
    },
    {
      title: "Active",
      key: "active",
      width: "5%",
      render: (record: DataType) => (
        <>
          <Checkbox
            defaultChecked={record.active}
            onChange={(event) => handleActiveChange(event, record)}
          ></Checkbox>
        </>
      ),
    },
    {
      // title: "Action",
      key: "operation",
      width: "15%",
      render: (record: DataType) => (
        <Space wrap>
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => deleteUomUom(record)}
          >
            <AiFillDelete className="cursor-pointer" />
          </Popconfirm>
        </Space>
      ),
    },
  ];
  useEffect(() => {
    if (uomUomData) {
      const newData: DataType[] = uomUomData.map((item) => ({
        key: item.id,
        id: item.id,
        name: item.name,
        uomType: item.uomType,
        categoryId: item.categoryId,
        ratio: item.ratio,
        rounding: item.rounding,
        active: item.active,
      }));
      setData(newData);
    }
  }, [uomUomData]);

  return (
    <>
      <Table
        loading={loading}
        columns={columns}
        dataSource={data}
        bordered
        // scroll={{ x: 1300 }}
        pagination={false}
      />
      <Button
        type="dashed"
        onClick={createUomUom}
        style={{ width: "100%", marginTop: "20px" }}
        icon={<PlusOutlined />}
      >
        Add line
      </Button>
    </>
  );
};

export default UomUomTable;

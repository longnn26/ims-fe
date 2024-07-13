"use client";

import useSelector from "@hooks/use-selector";
import { Checkbox, Input, TableColumnsType, Select, message } from "antd";
import { Table } from "antd";
import useDispatch from "@hooks/use-dispatch";
import uomUomServices from "@services/uomUom";
import {
  UomUomUpdateFactor,
  UomUomUpdateInfo,
  UomUomUpdateType,
} from "@models/uomUom";
import { getUomUoms } from "@slices/uomUom";
import { useEffect, useState } from "react";
interface Props {
  accessToken: string;
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
  const { accessToken } = props;
  const { data: uomUomData, loading } = useSelector((state) => state.uomUom);
  const [data, setData] = useState<DataType[]>([]);

  const updateUomUomInfo = async (
    data: UomUomUpdateInfo,
    uomCategoryId: string
  ) => {
    await uomUomServices
      .updateUomUomInfo(accessToken, data)
      .then(() => {
        dispatch(
          getUomUoms({
            token: accessToken,
            uomCategoryId: uomCategoryId,
          })
        );
      })
      .catch((error) => {
        message.error(error?.response?.data);
      });
  };
  const updateUomUomFactor = async (
    data: UomUomUpdateFactor,
    uomCategoryId: string
  ) => {
    await uomUomServices
      .updateUomUomFactor(accessToken, data)
      .then(() => {
        dispatch(
          getUomUoms({
            token: accessToken,
            uomCategoryId: uomCategoryId,
          })
        );
      })
      .catch((error) => {
        message.error(error?.response?.data);
      });
  };
  const updateUomUomType = async (
    data: UomUomUpdateType,
    uomCategoryId: string
  ) => {
    await uomUomServices
      .updateUomUomType(accessToken, data)
      .then(() => {
        dispatch(
          getUomUoms({
            token: accessToken,
            uomCategoryId: uomCategoryId,
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
          await updateUomUomInfo(
            { id: record.id, name: newValue } as UomUomUpdateInfo,
            record.categoryId
          );
        }
        break;
      case "rounding":
        if (Number.parseFloat(newValue) !== record.rounding) {
          await updateUomUomInfo(
            {
              id: record.id,
              rounding: Number.parseFloat(newValue),
            } as UomUomUpdateInfo,
            record.categoryId
          );
        }
        break;
      case "factor":
        if (Number.parseFloat(newValue) !== record.ratio) {
          await updateUomUomFactor(
            {
              id: record.id,
              factor: Number.parseFloat(newValue),
            } as UomUomUpdateFactor,
            record.categoryId
          );
        }
        break;
      default:
        break;
    }
  };
  const handleActiveChange = async (e, record: DataType) => {
    const newValue = e.target.checked;
    if (newValue !== record.active) {
      await updateUomUomInfo(
        { id: record.id, active: newValue } as UomUomUpdateInfo,
        record.categoryId
      );
    }
  };
  const handleUomTypeChange = async (newValue: string, record: DataType) => {
    if (newValue !== record.uomType) {
      await updateUomUomType(
        { id: record.id, uomType: newValue } as UomUomUpdateType,
        record.categoryId
      );
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

  const columns: TableColumnsType<DataType> = [
    {
      title: "Name",
      key: "name",
      width: "15%",
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
      width: "20%",
      render: (record: DataType) => (
        <Select
          variant="borderless"
          value={record.uomType}
          style={{ width: 120 }}
          onChange={(value) => {
            handleUomTypeChange(value, record);
          }}
          options={[
            { value: "Smaller", label: "Smaller" },
            { value: "Bigger", label: "Bigger" },
            { value: "Reference", label: "Reference" },
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
      render: (record: DataType) => (
        <>
          <Checkbox
            defaultChecked={record.active}
            onChange={(event) => handleActiveChange(event, record)}
          ></Checkbox>
        </>
      ),
    },

    // {
    //   title: "Action",
    //   key: "operation",
    //   render: (record: UomCategory) => (
    //     <Space wrap>
    //       <Tooltip title="Delete" color={"black"}>
    //         <Button onClick={() => {}}>
    //           <AiFillDelete />
    //         </Button>
    //       </Tooltip>
    //     </Space>
    //   ),
    // },
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
        scroll={{ x: 1300 }}
        pagination={false}
      />
    </>
  );
};

export default UomUomTable;

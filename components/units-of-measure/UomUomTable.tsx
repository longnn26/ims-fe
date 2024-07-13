"use client";

import useSelector from "@hooks/use-selector";
import { Checkbox, Input, TableColumnsType } from "antd";
import { Table } from "antd";
import useDispatch from "@hooks/use-dispatch";
import uomUomServices from "@services/uomUom";
import { UomUomUpdateFactor, UomUomUpdateInfo } from "@models/uomUom";
import { getUomUoms } from "@slices/uomUom";

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
      .catch((error) => {});
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
      .catch((error) => {});
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
  const handleOnChange = async (e, record: DataType) => {
    const newValue = e.target.checked;
    if (newValue !== record.active) {
      await updateUomUomInfo(
        { id: record.id, active: newValue } as UomUomUpdateInfo,
        record.categoryId
      );
    }
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
      dataIndex: "uomType",
      key: "uomType",
      width: "20%",
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
            onBlur={(event) => {
              handleBlur(event, "factor", record);
            }}
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
            onChange={(event) => handleOnChange(event, record)}
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

  const data: DataType[] = [];
  for (let i = 0; i < uomUomData?.length; ++i) {
    data.push({
      key: uomUomData[i].id,
      id: uomUomData[i].id,
      name: uomUomData[i].name,
      uomType: uomUomData[i].uomType,
      categoryId: uomUomData[i].categoryId,
      ratio: uomUomData[i].ratio,
      rounding: uomUomData[i].rounding,
      active: uomUomData[i].active,
    });
  }

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

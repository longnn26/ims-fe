/* eslint-disable @next/next/no-img-element */
"use client";

import useSelector from "@hooks/use-selector";
import Image from "next/image";
import { dateAdvFormat } from "@utils/constants";
import { Col, Divider, Row, TableColumnsType } from "antd";
import { Area } from "@models/area";
import { useRouter } from "next/router";
import { Rack, RowInArea } from "@models/rack";

interface Props {
  area: Area;
  onEdit: (data: Rack) => void;
  // onDelete: (data: Area) => void;
}

interface DataType {
  key: React.Key;
  id: number;
  name: string;
  rowCount: number;
  columnCount: number;
  dateCreated: string;
  dateUpdated: string;
}

const style: React.CSSProperties = { background: "#0092ff", padding: "8px 0" };

const RackRender: React.FC<Props> = (props) => {
  const { area, onEdit } = props;
  const router = useRouter();
  const { rackData } = useSelector((state) => state.area);
  var rowList = [] as RowInArea[];
  for (let index = 0; index < area?.rowCount; index++) {
    rowList.push({ id: index + 1, data: [] } as RowInArea);
  }
  rackData.data.forEach((rack) => {
    rowList.forEach((row) => {
      if (row.id === rack.row) {
        row.data?.push(rack);
      }
    });
  });

  // const columns: TableColumnsType<DataType> = [
  //   {
  //     title: "Id",
  //     dataIndex: "id",
  //     key: "id",
  //     fixed: "left",
  //     render: (text) => (
  //       <a className="text-[#b75c3c] hover:text-[#ee4623]">{text}</a>
  //     ),
  //     onCell: (record, rowIndex) => {
  //       return {
  //         onClick: (ev) => {
  //           router.push(`/area/${record.id}`);
  //         },
  //       };
  //     },
  //   },
  //   {
  //     title: "Name",
  //     dataIndex: "name",
  //     key: "name",
  //     onCell: (record, rowIndex) => {
  //       return {
  //         onClick: (ev) => {
  //           router.push(`/area/${record.id}`);
  //         },
  //       };
  //     },
  //   },
  //   {
  //     title: "Row Count",
  //     dataIndex: "rowCount",
  //     key: "rowCount",
  //     onCell: (record, rowIndex) => {
  //       return {
  //         onClick: (ev) => {
  //           router.push(`/area/${record.id}`);
  //         },
  //       };
  //     },
  //   },
  //   {
  //     title: "Column Count",
  //     dataIndex: "columnCount",
  //     key: "columnCount",
  //     onCell: (record, rowIndex) => {
  //       return {
  //         onClick: (ev) => {
  //           router.push(`/area/${record.id}`);
  //         },
  //       };
  //     },
  //   },
  //   {
  //     title: "Date Created",
  //     dataIndex: "dateCreated",
  //     key: "dateCreated",
  //     onCell: (record, rowIndex) => {
  //       return {
  //         onClick: (ev) => {
  //           router.push(`/area/${record.id}`);
  //         },
  //       };
  //     },
  //   },
  //   {
  //     title: "Date Updated",
  //     dataIndex: "dateUpdated",
  //     key: "dateUpdated",
  //     onCell: (record, rowIndex) => {
  //       return {
  //         onClick: (ev) => {
  //           router.push(`/area/${record.id}`);
  //         },
  //       };
  //     },
  //   },
  //   {
  //     title: "Action",
  //     key: "operation",
  //     render: (record: Area) => (
  //       <Space wrap>
  //         <Tooltip title="Edit" color={"black"}>
  //           <Button onClick={() => onEdit(record)}>
  //             <BiEdit />
  //           </Button>
  //         </Tooltip>
  //         <Tooltip title="Delete" color={"black"}>
  //           <Button onClick={() => onDelete(record)}>
  //             <AiFillDelete />
  //           </Button>
  //         </Tooltip>
  //       </Space>
  //     ),
  //   },
  // ];

  // const data: DataType[] = [];
  // for (let i = 0; i < areaData?.data?.length; ++i) {
  //   data.push({
  //     key: areaData?.data[i].id,
  //     id: areaData?.data[i].id,
  //     name: areaData?.data[i].name,
  //     rowCount: areaData?.data[i].rowCount,
  //     columnCount: areaData?.data[i].columnCount,
  //     dateCreated: moment(areaData?.data[i].dateCreated).format(dateAdvFormat),
  //     dateUpdated: moment(areaData?.data[i].dateUpdated).format(dateAdvFormat),
  //   });
  // }

  return (
    <>
      {rowList.map((rowItem, index) => (
        <div key={index}>
          <Divider orientation="center">
            <div className="p-1 font-bold ">
              {area.name} {rowItem.id}
            </div>
          </Divider>
          <Row gutter={16}>
            {rowItem.data.map((item, i) => (
              <Col
                key={i}
                className="gutter-row !flex !justify-center cursor-pointer"
                span={Math.ceil(24 / area.columnCount)}
                onClick={() => onEdit(item)}
              >
                <div className="text-[#ee4623] font-bold text-center w-2/3 px-2 h-10 flex items-center justify-center relative">
                  <img
                    className="absolute opacity-20 w-2/3 h-auto"
                    src="/images/cabinet-icon.jpeg"
                    alt="cabinet"
                  />
                  <p className="relative">
                    {" "}
                    {area.name}
                    {item.row} - {item.column}
                  </p>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      ))}
    </>
  );
};

export default RackRender;

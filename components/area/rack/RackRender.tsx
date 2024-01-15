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
  const { getAllRackData } = useSelector((state) => state.area);
  var rowList = [] as RowInArea[];
  for (let index = 0; index < area?.rowCount; index++) {
    rowList.push({ id: index, data: [] } as RowInArea);
  }
  getAllRackData?.forEach((rack) => {
    rowList.forEach((row) => {
      if (row.id === rack.row) {
        row.data?.push(rack);
      }
    });
  });

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
                // onClick={() => onEdit(item)}
                onClick={() => router.push(`rack/${item.id}`)}
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
                    {item.row + 1} - {item.column + 1}
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

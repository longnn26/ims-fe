"use client";

import useSelector from "@hooks/use-selector";
import {
  Button,
  Card,
  Col,
  message,
  Popconfirm,
  Row,
  Space,
  TableColumnsType,
} from "antd";
import { useRouter } from "next/router";
import useDispatch from "@hooks/use-dispatch";
import { getStockPickingTypes } from "@slices/stockPickingType";
import { useMemo } from "react";
const { Meta } = Card;

interface Props {
  accessToken: string;
}

interface DataType {
  key: React.Key;
  id: string;
  name: string;
  completeName: string;
  usage: string;
  totalPickingReady: number;
}

const StockPickingTypeTable: React.FC<Props> = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { accessToken } = props;
  const { data: stockPickingTypeData, loading } = useSelector(
    (state) => state.stockPickingType
  );
  const predefinedColors = ["#4a819e", "#e8bb1d", "#ee2d2d"];

  const getRandomColor = () => {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
  };
  const warehouseColors = useMemo(() => {
    const colors: { [key: string]: string } = {};
    const uniqueWarehouses = Array.from(
      new Set(stockPickingTypeData.map((spt) => spt.warehouse.id))
    );
    uniqueWarehouses.forEach((warehouseId, index) => {
      if (index < predefinedColors.length) {
        colors[warehouseId] = predefinedColors[index];
      } else {
        colors[warehouseId] = getRandomColor();
      }
    });

    return colors;
  }, [stockPickingTypeData]);

  return (
    <>
      <div style={{ padding: "20px" }}>
        <Row gutter={[16, 16]}>
          {stockPickingTypeData.map((spt, index) => (
            <Col key={index} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                title={spt.name}
                style={{
                  borderWidth: "3px",
                  borderLeft: `4px solid ${warehouseColors[spt.warehouse.id]}`,
                  borderRadius: "2px",
                }}
              >
                <Meta
                  title={
                    <>
                      <Button type="primary">
                        {`${spt.totalPickingReady} To Process`}{" "}
                      </Button>
                    </>
                  }
                  description={spt.warehouse.name}
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
};

export default StockPickingTypeTable;

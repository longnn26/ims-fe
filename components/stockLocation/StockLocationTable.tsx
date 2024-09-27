"use client";

import useSelector from "@hooks/use-selector";
import {
  Button,
  Drawer,
  Input,
  message,
  Pagination,
  Popconfirm,
  Popover,
  Space,
  TableColumnsType,
  Tooltip,
} from "antd";
import { FaQrcode } from "react-icons/fa";
import { Table, QRCode } from "antd";
import { useRouter } from "next/router";
import { AiFillDelete } from "react-icons/ai";
import stockLocationServices from "@services/stockLocation";
import useDispatch from "@hooks/use-dispatch";
import { getProductCategories } from "@slices/productCategory";
import { getStockLocations } from "@slices/stockLocation";
import { FaBoxes, FaSearch } from "react-icons/fa";
import { useState } from "react";
import StockQuantLocationTable from "./StockQuantLocationTable";
import {
  setPageIndex as setPageIndexStockQuantLocation,
  setPageSize as setPageSizeStockQuantLocation,
  setSearchText as setSearchTextStockQuantLocation,
} from "@slices/stockQuantLocation";
interface Props {
  accessToken: string;
}

interface DataType {
  key: React.Key;
  id: string;
  name: string;
  completeName: string;
  usage: string;
  hasStockQuant?: boolean;
}

const StockLocationTable: React.FC<Props> = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { accessToken } = props;
  const { data: stockLocationData, loading } = useSelector(
    (state) => state.stockLocation
  );

  const {
    data: dataStockQuantLocation,
    pageIndex: pageIndexStockQuantLocation,
    pageSize: pageSizeStockQuantLocation,
    totalSize: totalSizeStockQuantLocation,
    searchText: searchTextStockQuantLocation,
  } = useSelector((state) => state.stockQuantLocation);
  const [stockQuantLocationId, setStockQuantLocationId] = useState<
    string | undefined
  >();
  const deleteStockLocation = async (record: DataType) => {
    await stockLocationServices
      .deleteStockLocation(accessToken, record.id)
      .then(() => {
        dispatch(
          getStockLocations({
            token: accessToken,
          })
        );
      })
      .catch((error) => {
        message.error(error?.response?.data);
      });
  };
  const columns: TableColumnsType<DataType> = [
    {
      title: "Location",
      render: (record: DataType) => (
        <span
          className={`${
            record.usage === "Internal" ? "text-[#d23f3a]" : "text-[#578699]"
          }  `}
        >
          {record.completeName}
        </span>
      ),
    },
    {
      title: "Location Type",
      align: "center",
      render: (record: DataType) => (
        <span
          className={`${
            record.usage === "Internal" ? "text-[#d23f3a]" : "text-[#578699]"
          }  `}
        >
          {record.usage}
        </span>
      ),
    },
    {
      // title: "Location Type",
      align: "center",
      render: (record: DataType) => (
        <>
          {Boolean(record.hasStockQuant) ? (
            <Space wrap onClick={(e) => e.stopPropagation()}>
              <Tooltip key="variant" title={`View Stock Quantity`}>
                <Button
                  shape="circle"
                  type="dashed"
                  onClick={() => {
                    setStockQuantLocationId(record?.id);
                  }}
                >
                  <FaBoxes />
                </Button>
              </Tooltip>
            </Space>
          ) : undefined}
        </>
      ),
    },
    {
      title: "QrCode",
      width: "10%",
      align: "center",
      render: (record: DataType) => (
        <>
          <Popover content={<QRCode value={record.id} bordered={false} />}>
            {/* <Button type="primary">Show QrCode</Button> */}
            <FaQrcode />
          </Popover>{" "}
        </>
      ),
    },
    {
      key: "operation",
      align: "center",
      width: "15%",
      render: (record: DataType) => (
        <Space wrap onClick={(e) => e.stopPropagation()}>
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => {
              deleteStockLocation(record);
            }}
          >
            <AiFillDelete className="cursor-pointer" />
          </Popconfirm>
        </Space>
      ),
    },
  ];
  const data: DataType[] = [];
  for (let i = 0; i < stockLocationData?.length; ++i) {
    data.push({
      key: stockLocationData[i].id,
      id: stockLocationData[i].id,
      name: stockLocationData[i].name,
      completeName: stockLocationData[i].completeName,
      usage: stockLocationData[i].usage,
      hasStockQuant: stockLocationData[i].hasStockQuant,
    });
  }
  return (
    <>
      <Table
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              router.push(`/locations/${record?.id}`);
            },
          };
        }}
        className="custom-table"
        loading={loading}
        columns={columns}
        dataSource={data}
        bordered
        // scroll={{ x: 1300 }}
        pagination={false}
      />
      <Drawer
        width={850}
        closable
        destroyOnClose
        title={<p>Stock Quantity</p>}
        placement="right"
        open={Boolean(stockQuantLocationId)}
        onClose={() => setStockQuantLocationId(undefined)}
      >
        <div className="flex justify-start">
          <Input
            prefix={<FaSearch />}
            className="input-search-drawer"
            placeholder="Search Product does not contain words in brackets"
            defaultValue={searchTextStockQuantLocation}
            onPressEnter={(event) => {
              dispatch(setSearchTextStockQuantLocation(event.target["value"]));
            }}
          />
        </div>
        <StockQuantLocationTable
          locationId={stockQuantLocationId!}
          accessToken={accessToken}
        />
        {dataStockQuantLocation?.length > 0 && (
          <Pagination
            className="text-end m-4"
            current={pageIndexStockQuantLocation}
            pageSize={pageSizeStockQuantLocation}
            total={totalSizeStockQuantLocation}
            showSizeChanger
            onShowSizeChange={(current, pageSize) => {
              dispatch(setPageIndexStockQuantLocation(pageSize));
            }}
            onChange={(page) => {
              dispatch(setPageSizeStockQuantLocation(page));
            }}
          />
        )}
      </Drawer>
    </>
  );
};

export default StockLocationTable;

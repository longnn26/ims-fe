"use client";

import useSelector from "@hooks/use-selector";
import { Divider, Table, TableColumnsType } from "antd";
import { useRouter } from "next/router";

interface Props {
  typeGet: string;
  serverAllocationId?: string;
  urlOncell?: string;
}

interface DataType {
  key: React.Key;
  id: number;
  address: string;
  assignmentType: string;
  capacity: number;
}

const IpAddressTable: React.FC<Props> = (props) => {
  const { urlOncell, typeGet } = props;
  const router = useRouter();
  const { ipAdressData } = useSelector((state) => state.requestHost);
  const { serverIpAdressData } = useSelector((state) => state.serverAllocation);

  var listData =
    typeGet == "RequestHost"
      ? ipAdressData
      : typeGet == "ServerAllocation"
      ? serverIpAdressData
      : serverIpAdressData;

  const columns: TableColumnsType<DataType> = [
    { title: "Address", dataIndex: "address", key: "address" },
    {
      title: "Assignment Type",
      key: "assignmentType",
      render: (record) => (
        <p className="">
          {record.assignmentType === "Additional"
            ? "IP"
            : record.assignmentType}
        </p>
      ),
    },
    {
      title: "Capacity",
      dataIndex: "capacity",
      key: "capacity",
      render: (text, record) => {
        // Chuyển đổi dữ liệu từ "0.1" sang "100 MB" và từ "1" sang "1 GB"
        const capacityValue = parseFloat(text);
        const formattedCapacity =
          capacityValue < 1
            ? `${capacityValue * 1000} Mbps`
            : `${capacityValue > 0 ? `${capacityValue} Gbps` : ""}`;

        return <span>{formattedCapacity}</span>;
      },
    },
  ];

  const data: DataType[] = [];
  for (let i = 0; i < listData?.data?.length; ++i) {
    data.push({
      key: listData?.data[i].id,
      id: listData?.data[i].id,
      address: listData?.data[i].address,
      assignmentType: listData?.data[i].assignmentType,
      capacity: listData?.data[i].capacity!,
    });
  }

  return (
    <div className="shadow m-5">
      <Divider orientation="left" plain>
        <h3>Ip Address</h3>
      </Divider>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        // className="cursor-pointer"
      />
    </div>
  );
};

export default IpAddressTable;

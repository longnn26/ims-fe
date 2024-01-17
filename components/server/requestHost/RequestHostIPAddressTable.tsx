import useSelector from "@hooks/use-selector";
import { RequestHost } from "@models/requestHost";
import { Descriptions, Divider, Table, TableColumnsType, Tag } from "antd";
import React from "react";

interface Props {
  requestHostDetail: RequestHost;
}

interface DataType {
  key: React.Key;
  id: number;
  capacity: number;
  address: string;
}

const RequestHostIPAddressTable: React.FC<Props> = (props) => {
  const { requestHostDetail } = props;

  const columns: TableColumnsType<DataType> = [
    // {
    //   title: "No",
    //   dataIndex: "id",
    //   key: "id",
    //   fixed: "left",
    //   render: (text) => (
    //     <p className="text-[#b75c3c] hover:text-[#ee4623]">{text}</p>
    //   ),
    // },
    { title: "Address", dataIndex: "address", key: "address" },
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
  for (let i = 0; i < requestHostDetail?.ipAddresses?.length; ++i) {
    data.push({
      key: requestHostDetail?.ipAddresses[i].ipAddress.id,
      id: requestHostDetail?.ipAddresses[i].ipAddress.id,
      address: requestHostDetail?.ipAddresses[i].ipAddress.address,
      capacity: requestHostDetail?.ipAddresses[i].capacity,
    });
  }

  return (
    <div className="shadow m-5">
      <Divider orientation="left" plain>
        <h3>IP Addresses of Request</h3>
      </Divider>
      <Table
        columns={columns}
        dataSource={data}
        // scroll={{ x: 1300 }}
        pagination={false}
        // className="cursor-pointer"
      />
    </div>
  );
};

export default RequestHostIPAddressTable;

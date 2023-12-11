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
    {
      title: "No",
      dataIndex: "id",
      key: "id",
      fixed: "left",
      render: (text) => (
        <p className="text-[#b75c3c] hover:text-[#ee4623]">{text}</p>
      ),
    },
    { title: "Address", dataIndex: "address", key: "address" },
    {
      title: "Assignment Type",
      key: "assignmentType",
      render: (record) => (
        <p className="">{record.assignmentType === "Additional" ? "IP" : record.assignmentType}</p>
      ),
    },
    // {
    //   title: "Action",
    //   key: "operation",
    //   render: (record: RequestHost) => (
    //     <Space wrap>
    //       <Tooltip title="View detail" color={"black"}>
    //         <Button
    //           onClick={() =>
    //             router.push(`${urlOncell}/requestHost/${record.id}`)
    //           }
    //         >
    //           <BiSolidCommentDetail />
    //         </Button>
    //       </Tooltip>
    //     </Space>
    //   ),
    // },
  ];

  const data: DataType[] = [];
  for (let i = 0; i < listData?.data?.length; ++i) {
    data.push({
      key: listData?.data[i].id,
      id: listData?.data[i].id,
      address: listData?.data[i].address,
      assignmentType: listData?.data[i].assignmentType,
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
        scroll={{ x: 1300 }}
        pagination={false}
        // className="cursor-pointer"
      />
    </div>
  );
};

export default IpAddressTable;
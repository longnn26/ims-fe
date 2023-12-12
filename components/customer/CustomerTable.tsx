"use client";

import useSelector from "@hooks/use-selector";
import { dateAdvFormat } from "@utils/constants";
import { TableColumnsType } from "antd";
import { Button, Space, Table, Tooltip } from "antd";
import { BiEdit, BiSolidCommentDetail } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import moment from "moment";
import { Customer } from "@models/customer";
import { useRouter } from "next/router";

interface Props {
  onEdit: (data: Customer) => void;
  onDelete: (data: Customer) => void;
}

interface DataType {
  key: React.Key;
  id: number;
  companyName: string;
  address: string;
  taxNumber: string;
  email: string;
  phoneNumber: string;
  isDeleted: boolean;
  dateCreated: string;
  dateUpdated: string;
}

const CustomerTable: React.FC<Props> = (props) => {
  const { onEdit, onDelete } = props;
  const router = useRouter();
  const { customerDataLoading, customerData } = useSelector(
    (state) => state.customer
  );

  const columns: TableColumnsType<DataType> = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      fixed: "left",
    },
    { title: "Company Name", dataIndex: "companyName", key: "companyName" },
    { title: "Address", dataIndex: "address", key: "address" },
    { title: "Tax number", dataIndex: "taxNumber", key: "taxNumber" },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    { title: "Phone number", dataIndex: "phoneNumber", key: "phoneNumber" },
    { title: "Status",
      key: "isDeleted",
      render: (record: Customer) => (
        `${record.isDeleted != true ? "Active" : "Removed"}`
      ),
    },
    { title: "Date Created", dataIndex: "dateCreated", key: "dateCreated" },
    { title: "Date Updated", dataIndex: "dateUpdated", key: "dateUpdated" },
    {
      title: "Action",
      key: "operation",
      render: (record: Customer) => (
        <Space wrap>
           <Tooltip title="View detail" color={"black"}>
            <Button onClick={() => router.push(`/customer/${record.id}`)}>
              <BiSolidCommentDetail />
            </Button>
          </Tooltip>
          <Tooltip title="Edit" color={"black"}>
            <Button onClick={() => onEdit(record)}>
              <BiEdit />
            </Button>
          </Tooltip>
          <Tooltip title="Delete" color={"black"}>
            <Button onClick={() => onDelete(record)}>
              <AiFillDelete />
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const data: DataType[] = [];
  for (let i = 0; i < customerData?.data?.length; ++i) {
    data.push({
      key: customerData?.data[i].id,
      id: customerData?.data[i].id,
      companyName: customerData?.data[i].companyName,
      address: customerData?.data[i].address,
      taxNumber: customerData?.data[i].taxNumber,
      email: customerData?.data[i].email,
      phoneNumber: customerData?.data[i].phoneNumber,
      isDeleted: customerData?.data[i].isDeleted,
      dateCreated: moment(customerData?.data[i].dateCreated).format(
        dateAdvFormat
      ),
      dateUpdated: moment(customerData?.data[i].dateUpdated).format(
        dateAdvFormat
      ),
    });
  }

  return (
    <>
      <Table
        loading={customerDataLoading}
        columns={columns}
        dataSource={data}
        scroll={{ x: 1300 }}
        pagination={false}
      />
    </>
  );
};

export default CustomerTable;

"use client";

import useSelector from "@hooks/use-selector";
import { ROLE_SALES, dateAdvFormat } from "@utils/constants";
import { TableColumnsType } from "antd";
import { Button, Space, Table, Tooltip } from "antd";
import { BiEdit, BiSolidCommentDetail } from "react-icons/bi";
import { CiSquareMinus, CiSquarePlus } from "react-icons/ci";
import { AiFillDelete } from "react-icons/ai";
import moment from "moment";
import { Contacts, Customer } from "@models/customer";
import { useRouter } from "next/router";
import { areInArray } from "@utils/helpers";
import { useSession } from "next-auth/react";

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
  representor: string;
  representorPosition: string;
  contractNumber: string;
  isDeleted: boolean;
  dateCreated: string;
  dateUpdated: string;
  contacts: Contacts[];
}

const CustomerTable: React.FC<Props> = (props) => {
  const { onEdit, onDelete } = props;
  const { data: session } = useSession();

  const router = useRouter();
  const { customerDataLoading, customerData } = useSelector(
    (state) => state.customer
  );

  const nestedRowRender = (data: DataType) => {
    const contacts = data.contacts;

    if (!contacts || contacts.length === 0) {
      return null; // No contacts to display
    } else {
      const nestedColumns = [
        { title: "Contacts" },
        { title: "Name", dataIndex: "name", key: "name" },
        { title: "Position", dataIndex: "position", key: "position" },
        { title: "Email", dataIndex: "email", key: "email" },
        { title: "Phone Number", dataIndex: "phoneNumber", key: "phoneNumber" },
      ];

      const nestedData = data.contacts.map((des, index) => ({
        key: index,
        name: data.contacts[index].name,
        position: data.contacts[index].position,
        email: data.contacts[index].email,
        phoneNumber: data.contacts[index].phoneNumber,
      }));

      return (
        <Table
          columns={nestedColumns}
          dataSource={nestedData}
          pagination={false}
        />
      );
    }
  };

  const columns: TableColumnsType<DataType> = [
    {
      title: "Company Name",
      dataIndex: "companyName",
      key: "companyName",
      fixed: "left",
    },
    { title: "Address", dataIndex: "address", key: "address" },
    { title: "Tax number", dataIndex: "taxNumber", key: "taxNumber" },
    {
      title: "Contract Number",
      dataIndex: "contractNumber",
      key: "contractNumber",
    },
    { title: "Representor", dataIndex: "representor", key: "representor" },
    {
      title: "Position",
      dataIndex: "representorPosition",
      key: "representorPosition",
    },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone number", dataIndex: "phoneNumber", key: "phoneNumber" },
    {
      title: "Status",
      key: "isDeleted",
      render: (record: Customer) =>
        `${record.isDeleted != true ? "Active" : "Removed"}`,
    },
    { title: "Date Created", dataIndex: "dateCreated", key: "dateCreated" },
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
          {areInArray(session?.user.roles!, ROLE_SALES) && (
            <>
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
            </>
          )}
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
      representor: customerData?.data[i].representor,
      representorPosition: customerData.data[i].representorPosition,
      contacts: customerData.data[i].contacts,
      contractNumber: customerData.data[i].contractNumber,
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
        expandable={{
          expandedRowRender: nestedRowRender,
          rowExpandable: (record) => (record.contacts ? true : false),
        }}
      />
    </>
  );
};

export default CustomerTable;

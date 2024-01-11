"use client";

import useSelector from "@hooks/use-selector";
import { ROLE_SALES, dateAdvFormat } from "@utils/constants";
import { Badge, TableColumnsType } from "antd";
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
  id: string;
  companyName: string;
  address: string;
  taxNumber: string;
  email: string;
  phoneNumber: string;
  representator: string;
  representatorPosition: string;
  contractNumber: string;
  isDeleted: boolean;
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

  const columns: TableColumnsType<DataType> = [    
    {
      title: "Contract Number",
      dataIndex: "contractNumber",
      key: "contractNumber",
      render(contractNumber: string) {
        return <div>{`${contractNumber}/HĐ - QTSC`} </div>;
      },
    },
    {
      title: "Company Name",
      dataIndex: "companyName",
      key: "companyName",
      fixed: "left",
    },
    { title: "Tax number", dataIndex: "taxNumber", key: "taxNumber" },
    { title: "Address", dataIndex: "address", key: "address" },
    // {
    //   title: "Status",
    //   key: "isDeleted",
    //   render: (record: Customer) => (
    //     <>
    //       {record.isDeleted != true ? (
    //         <Badge status="success" text="Actice" />
    //       ) : (
    //         <Badge status="error" text="Removed" />
    //       )}
    //       `
    //     </>
    //   ),
    // },
    // { title: "Date Created", dataIndex: "dateCreated", key: "dateCreated" },
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
      representator: customerData?.data[i].representator,
      representatorPosition: customerData.data[i].representatorPosition,
      contacts: customerData.data[i].contacts,
      contractNumber: customerData.data[i].contractNumber,
      isDeleted: customerData?.data[i].isDeleted,
      // dateCreated: moment(customerData?.data[i].dateCreated).format(
      //   dateAdvFormat
      // ),
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
        className="shadow m-5"
        pagination={false}
      />
    </>
  );
};

export default CustomerTable;

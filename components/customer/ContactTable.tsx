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
    contacts: Contacts[];
  onEdit: (data: Customer) => void;
  onDelete: (data: Customer) => void;
}

interface DataType {
  key: React.Key;
  name: string;
  position: string;
  phoneNumber: string;
  email: string;
  forAppointment: boolean;
  cccd: string;
}

const ContactTable: React.FC<Props> = (props) => {
  const { onEdit, onDelete, contacts } = props;
  const { data: session } = useSession();

  const router = useRouter();
  const { customerDataLoading, customerData } = useSelector(
    (state) => state.customer
  );

  const columns: TableColumnsType<DataType> = [    
    {
      title: "Information Type",
      key: "forAppointment",
      render(record: DataType) {
        return <div>{`${record.forAppointment === true ? `Permission to visit DC` : `Informative contact`}`} </div>;
      },
    },
    { title: "Full Name", dataIndex: "name", key: "name" },
    { title: "Citizen  Identification", dataIndex: "cccd", key: "cccd" },
    { title: "Phone Number", dataIndex: "phoneNumber", key: "phoneNumber" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Position", dataIndex: "position", key: "position" },
  ];

    const data: DataType[] = [];
    for (let i = 0; i < contacts?.length; ++i) {
        data.push({
            key: i,
            name: contacts[i].name,
            position: contacts[i].position,
            phoneNumber: contacts[i].phoneNumber,
            email: contacts[i].email,
            forAppointment: contacts[i].forAppointment,
            cccd: contacts[i].cccd,
        });
    }

  return (
    <>
      <Table
        loading={customerDataLoading}
        columns={columns}
        dataSource={data}
        className="shadow"
        pagination={false}
      />
    </>
  );
};

export default ContactTable;

"use client";

import useSelector from "@hooks/use-selector";
import { TableColumnsType, Tag } from "antd";
import { Button, Space, Table, Tooltip } from "antd";
import { useRouter } from "next/router";
import { Contacts } from "@models/customer";

interface Props {
    customerContact: Contacts[];
}

interface DataType {
  key: React.Key;
  name: string;
  position: string;
  phoneNumber: string;
  email: string;
  forAppointment: boolean;
}

const ContactsTable: React.FC<Props> = (props) => {
  const { customerContact } = props;
  const router = useRouter();
  const { customerDataLoading, customerData } = useSelector((state) => state.customer);

  const columns: TableColumnsType<DataType> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      fixed: "left",
    },
    { title: "Position", dataIndex: "position", key: "position" },
    { title: "Phone Number", dataIndex: "phoneNumber", key: "phoneNumber" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Là thông tin để", key: "forAppointment",
        render: (record: Contacts) => (
            `${record.forAppointment === true ? "Liên hệ" : "Đăng kí ra vào DC"}`
        ),
    },
  ];

  const data: DataType[] = [];
  for (let i = 0; i < customerData?.data?.length; ++i) {
    data.push({
      key: i,
      name: customerContact[i].name,
      position: customerContact[i].position,
      phoneNumber: customerContact[i].phoneNumber,
      email: customerContact[i].email,
      forAppointment: customerContact[i].forAppointment,
    });
  }

  return (
    <div className="shadow m-5">
      <Table
        loading={customerDataLoading}
        columns={columns}
        dataSource={data}
        scroll={{ x: 500 }}
        pagination={false}
      />
    </div>
  );
};

export default ContactsTable;

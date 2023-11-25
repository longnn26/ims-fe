"use client";

import useSelector from "@hooks/use-selector";
import { dateAdvFormat, requestUpgradeStatus } from "@utils/constants";
import { Divider, TableColumnsType, Tag } from "antd";
import { Button, Space, Table, Tooltip } from "antd";
import { BiEdit, BiSolidCommentDetail } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import moment from "moment";
import { RequestUpgrade } from "@models/requestUpgrade";
import { useRouter } from "next/router";
import { ComponentObj } from "@models/component";

interface Props {
  typeGet?: string;
  serverAllocationId?: string;
  urlOncell?: string;
  onEdit: (data: RequestUpgrade) => void;
  onDelete: (data: RequestUpgrade) => void;
}

interface DataType {
  key: React.Key;
  id: number;
  information: string;
  status: string;
  capacity: number;
  serverAllocationId: number;
  componentId: number;
  component: ComponentObj;
  dateCreated: string;
  dateUpdated: string;
}

const RequestUpgradeTable: React.FC<Props> = (props) => {
  const { onEdit, onDelete, urlOncell, typeGet } = props;
  const router = useRouter();
  const { requestUpgradeDataLoading, requestUpgradeData } = useSelector(
    (state) => state.requestUpgrade
  );
  const { requestUpgradeData: rUDataOfAppointment } = useSelector(
    (state) => state.appointment
  );

  var listData =
    typeGet == "All"
      ? requestUpgradeData
      : typeGet == "ByAppointmentId"
      ? rUDataOfAppointment
      : requestUpgradeData;

  const columns: TableColumnsType<DataType> = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      fixed: "left",
      render: (text) => (
        <p className="text-[#b75c3c] hover:text-[#ee4623]">{text}</p>
      ),
      // onCell: (record, rowIndex) => {
      //   return {
      //     onClick: (ev) => {
      //       router.push(`${urlOncell}/requestUpgrade/${record.id}`);
      //     },
      //   };
      // },
    },
    {
      title: "Component",
      key: "component",
      render: (record: RequestUpgrade) => (
        <p>{`${record.component?.name} - ${record.component?.unit} - ${record.component?.type}`}</p>
      ),
    },
    { title: "Information", dataIndex: "information", key: "information" },
    { title: "Capacity", dataIndex: "capacity", key: "capacity" },
    {
      title: "Status",
      // dataIndex: "status",
      key: "status",
      render: (record: RequestUpgrade) => {
        var statusData = requestUpgradeStatus.find(
          (_) => _.value === record.status
        );
        return (
          <Tag className=" w-2/3 text-center" color={statusData?.color}>
            {statusData?.value}
          </Tag>
        );
      },
    },
    { title: "Date Created", dataIndex: "dateCreated", key: "dateCreated" },
    { title: "Date Updated", dataIndex: "dateUpdated", key: "dateUpdated" },
    {
      title: "Action",
      key: "operation",
      render: (record: RequestUpgrade) => (
        <Space wrap>
          <Tooltip title="View detail" color={"black"}>
            <Button
              onClick={() =>
                router.push(`${urlOncell}/requestUpgrade/${record.id}`)
              }
            >
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
  for (let i = 0; i < listData?.data?.length; ++i) {
    data.push({
      key: listData?.data[i].id,
      id: listData?.data[i].id,
      information: listData?.data[i].information,
      component: listData?.data[i].component,
      capacity: listData?.data[i].capacity,
      serverAllocationId: listData?.data[i].serverAllocationId,
      componentId: listData?.data[i].componentId,
      status: listData?.data[i].status,
      dateCreated: moment(listData?.data[i].dateCreated).format(dateAdvFormat),
      dateUpdated: moment(listData?.data[i].dateUpdated).format(dateAdvFormat),
    });
  }

  return (
    <div className="shadow m-5">
      <Divider orientation="left" plain>
        <h3>Request Upgrade</h3>
      </Divider>
      <Table
        loading={requestUpgradeDataLoading}
        columns={columns}
        dataSource={data}
        scroll={{ x: 1300 }}
        pagination={false}
        // className="cursor-pointer"
      />
    </div>
  );
};

export default RequestUpgradeTable;

"use client";

import useSelector from "@hooks/use-selector";
import { RequestExpand } from "@models/requestExpand";
import { RequestUpgrade } from "@models/requestUpgrade";
import { dateAdvFormat, requestUpgradeStatus } from "@utils/constants";
import {
  Button,
  Divider,
  Space,
  Table,
  TableColumnsType,
  Tag,
  Tooltip,
} from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import { AiFillDelete } from "react-icons/ai";
import { BiEdit, BiSolidCommentDetail } from "react-icons/bi";

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
  customerExpectation: string;
  expandSize: string;
  status: string;
  isRemoved: string;
  dateCreated: string;
  dateUpdated: string;
}

const RequestExpandTable: React.FC<Props> = (props) => {
  const { onEdit, onDelete, urlOncell, typeGet } = props;
  const router = useRouter();
  const { requestExpandDataLoading, requestExpandData } = useSelector(
    (state) => state.requestExpand
  );
  const { requestUpgradeData: rUDataOfAppointment } = useSelector(
    (state) => state.appointment
  );

  const columns: TableColumnsType<DataType> = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      fixed: "left",
      render: (text) => (
        <p className="text-[#b75c3c] hover:text-[#ee4623]">{text}</p>
      ),
    },
    {
      title: "Customer's expectation",
      key: "customerExpectation",
      dataIndex: "customerExpectation",
    },
    { title: "Expand size (U)", dataIndex: "expandSize", key: "expandSize" },
    {
      title: "Status",
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
    {
      title: "IsRemoved",
      key: "isRemoved",
      render: (record: RequestExpand) => {
        return Boolean(record.removalStatus === "Success") ? (
          <p>Removed</p>
        ) : (
          <p>Activating</p>
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
  for (let i = 0; i < requestExpandData?.data?.length; ++i) {
    data.push({
      key: requestExpandData?.data[i].id,
      id: requestExpandData?.data[i].id,
      customerExpectation: requestExpandData?.data[i].note,
      expandSize: requestExpandData?.data[i].size,
      isRemoved: requestExpandData?.data[i].removalStatus,
      status: requestExpandData?.data[i].status,
      dateCreated: moment(requestExpandData?.data[i].dateCreated).format(
        dateAdvFormat
      ),
      dateUpdated: moment(requestExpandData?.data[i].dateUpdated).format(
        dateAdvFormat
      ),
    });
  }

  return (
    <div className="shadow m-5">
      <Divider orientation="left" plain>
        <h3>Request Expand</h3>
      </Divider>
      <Table
        loading={requestExpandDataLoading}
        columns={columns}
        dataSource={data}
        scroll={{ x: 1300 }}
        pagination={false}
        // className="cursor-pointer"
      />
    </div>
  );
};

export default RequestExpandTable;

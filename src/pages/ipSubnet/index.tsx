"use client";
import dynamic from "next/dynamic";
import { Pagination, Tabs, TabsProps, Tree } from "antd";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import React from "react";
import { ParamGet, ParamGetWithId } from "@models/base";
import useDispatch from "@hooks/use-dispatch";
import useSelector from "@hooks/use-selector";
// import { getIpSubnetData } from "@slices/ipSubnet";
import {
  // IpSubnetCreateModel,
  // IpSubnet as IpSubnetObj,
  // IpSubnetData,
  IpSubnet,
} from "@models/ipSubnet";
import { Button, Modal } from "antd";
// import IpSubnetTable from "@components/ipSubnet/IpSubnetTable";
import ModalCreate from "@components/ipSubnet/ModalCreate";
import ipSubnetService from "@services/ipSubnet";
import type { DataNode, DirectoryTreeProps } from "antd/es/tree";
import { useRouter } from "next/router";
import { areInArray } from "@utils/helpers";
import { ROLE_TECH } from "@utils/constants";
import SearchComponent from "@components/SearchComponent";
import IpSubnetDetailInfor from "@components/ipSubnet/IpSubnetDetail";
import IpAddressTable from "@components/ipSubnet/IpAddressTable";
import { DownOutlined } from "@ant-design/icons";
import { getIpAddressData } from "@slices/ipSubnet";
import { IpAddress, IpAddressParamGet } from "@models/ipAddress";
import ModalBlock from "@components/ipSubnet/ModalBlock";
import ModalUnblock from "@components/ipSubnet/ModalUnblock";

const { TreeNode } = Tree;

const AntdLayoutNoSSR = dynamic(() => import("@layout/AntdLayout"), {
  ssr: false,
});

const { confirm } = Modal;

const IpSubnet: React.FC = () => {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const { ipSubnetData, ipSubnetDataLoading } = useSelector(
    (state) => state.ipSubnet
  );

  const router = useRouter();

  const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);
  const [openModalBlock, setOpenModalBlock] = useState<boolean>(false);
  const [openModalUnblock, setOpenModalUnblock] = useState<boolean>(false);
  const [paramGet, setParamGet] = useState<ParamGet>({
    PageIndex: 1,
    PageSize: 7,
  } as ParamGet);
  const [ipAddressParamGet, setIpAddressParamGet] = useState<IpAddressParamGet>(
    {
      PageIndex: 1,
      PageSize: 4,
    } as unknown as IpAddressParamGet
  );
  const { ipAddressData } = useSelector((state) => state.ipSubnet);
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [ipSubnetSelected, setIpSubnetSelected] = useState<
    string | undefined
  >();
  const [ipSubnetDetail, setIpSubnetDetail] = useState<IpSubnet>();
  const [ipAddressBlock, setIpAddressBlock] = useState<IpAddress | undefined>(
    undefined
  );
  const [status, setStatus] = useState<boolean>();

  const onSelect: DirectoryTreeProps["onSelect"] = async (keys, info) => {
    var data = info.selectedNodes[0] as DataNode;
    setIpSubnetSelected(data.id);

    getDetail(data.id!.toString());
  };

  const getDetail = async (ipSubnetId: string) => {
    await ipSubnetService
      .getDetail(session?.user.access_token!, ipSubnetId)
      .then(async (res) => {
        setIpSubnetDetail(res);
      });
    ipAddressParamGet.SubnetId = parseInt(ipSubnetId);
    ipAddressParamGet.Address = undefined;
    dispatch(
      getIpAddressData({
        token: session?.user.access_token!,
        paramGet: { ...ipAddressParamGet, IsAvailable: status },
      })
    );
  };

  const getData = async () => {
    await ipSubnetService
      .getDataTree(session?.user.access_token!)
      .then((res) => {
        const treeMap = new Map<string, DataNode>();
        res?.forEach((i) => {
          const node: DataNode = {
            id: i.id.toString(),
            title: `${i.firstOctet}.${i.secondOctet}.${i.thirdOctet}.${i.fourthOctet}/${i.prefixLength}`,
            name: `${i.firstOctet}.${i.secondOctet}.${i.thirdOctet}.${i.fourthOctet}/${i.prefixLength}`,
            key: i.id.toString(),
            parentId: i?.parentNetworkId?.toString(),
            children: [],
          };

          if (i.fourthOctet === 0) {
            treeMap.set(node.title, node);
          } else {
            const parentKey = `${i.firstOctet}.${i.secondOctet}.${i.thirdOctet}.0/${i.prefixLength}`;
            const parentNode = treeMap.get(parentKey);
            if (parentNode) {
              parentNode.children?.push(node);
            }
          }
        });
        // Convert the treeMap values to an array
        const data = Array.from(treeMap.values());
        setTreeData(data);
      });
  };

  useEffect(() => {
    if (session) {
      getData();
    }
  }, [session, paramGet]);

  useEffect(() => {
    if (session) {
      dispatch(
        getIpAddressData({
          token: session?.user.access_token!,
          paramGet: { ...ipAddressParamGet, IsAvailable: status },
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, ipAddressParamGet]);

  useEffect(() => {
    if (session) {
      ipSubnetService
        .getDetail(
          session?.user.access_token!,
          ipAddressData.data.at(0)?.ipSubnetId + ""
        )
        .then(async (res) => {
          setIpSubnetDetail(res);
        });
    }
  }, [session, ipAddressData]);

  useEffect(() => {
    dispatch(
      getIpAddressData({
        token: session?.user.access_token!,
        paramGet: { ...ipAddressParamGet, IsAvailable: status },
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const handleChange = (value) => {
    switch (value) {
      case "0":
        setStatus(undefined);
        break;
      case "1":
        setStatus(true);
        break;
      case "2":
        setStatus(false);
        break;
    };
  };

  const items: TabsProps["items"] = [
    {
      key: "0",
      label: "All",
    },
    {
      key: "1",
      label: "Available",
    },
    {
      key: "2",
      label: "Unavailable",
    }
  ];

  return (
    <AntdLayoutNoSSR
      content={
        <>
          {areInArray(session?.user.roles!, ROLE_TECH) && (
            <>
              <div className="flex flex-col mb-4 p-2 bg-[#f8f9fa]/10 border border-gray-200 rounded-lg shadow-lg shadow-[#e7edf5]/50">
                <div className="flex justify-between p-2">
                  <Button
                    type="primary"
                    htmlType="submit"
                    onClick={() => {
                      setOpenModalCreate(true);
                    }}
                  >
                    Create
                  </Button>
                  <div>
                    {ipAddressData && ipAddressData.data.filter(
                      (l) => l.purpose === "Host" && l.blocked === false
                    ).length > 0 && (
                        <Button
                          type="primary"
                          className="mr-2"
                          htmlType="submit"
                          onClick={() => {
                            setOpenModalBlock(true);
                          }}
                        >
                          Block IPs
                        </Button>
                      )}
                    {ipAddressData && ipAddressData.data.filter((l) => l.blocked === true)
                      .length > 0 && (
                        <Button
                          type="primary"
                          htmlType="submit"
                          onClick={() => {
                            setOpenModalUnblock(true);
                          }}
                        >
                          Unblock IPs
                        </Button>
                      )}
                  </div>
                </div>
                <div className="flex p-2">
                  <SearchComponent
                    placeholder="Search IP Address: 192.0.0.115"
                    setSearchValue={async (value) => {
                      setIpAddressParamGet({
                        SubnetId: undefined,
                        Address: value,
                        PageIndex: 1,
                        PageSize: 4,
                      } as IpAddressParamGet);
                    }}
                  />
                </div>
              </div>

              <ModalCreate
                open={openModalCreate}
                onClose={() => setOpenModalCreate(false)}
                onRefresh={() => {
                  getData();
                }}
              />
              <div className="flex justify-between mb-4 p-2 bg-[#f8f9fa]/10">
                <div className="mt-4" style={{ flex: 1 }}>
                  <Tree
                    showLine={true}
                    switcherIcon={<DownOutlined />}
                    onSelect={onSelect}
                    treeData={treeData}
                    selectedKeys={[ipSubnetSelected!]}
                    style={{ maxHeight: "70vh", overflowY: "auto" }}
                  />
                </div>
                <div className="flex-grow">
                  <IpSubnetDetailInfor
                    ipSubnetDetail={
                      ipSubnetDetail ? ipSubnetDetail : getDetail("1")
                    }
                  />
                  <Tabs className="m-5" defaultActiveKey="0" items={items} centered
                    onTabClick={(value) => handleChange(value)}
                  />
                  <IpAddressTable
                    onEdit={(record) => { }}
                    onDelete={async (record) => { }}
                    onBlock={(record) => {
                      setIpAddressBlock(record);
                    }}
                  />
                  {ipAddressData?.totalPage > 0 && (
                    <Pagination
                      className="text-end m-4"
                      current={ipAddressParamGet?.PageIndex}
                      pageSize={ipAddressData?.pageSize ?? 10}
                      total={ipAddressData?.totalSize}
                      showTotal={(total) => `Total ${total} IP Addresses`}
                      showSizeChanger={false}
                      showQuickJumper
                      onChange={(page, pageSize) => {
                        setIpAddressParamGet({
                          ...ipAddressParamGet,
                          PageIndex: page,
                          PageSize: pageSize,
                        });
                      }}
                    />
                  )}
                </div>
              </div>
              <ModalBlock
                subnetId={ipSubnetSelected!}
                open={openModalBlock}
                onClose={() => setOpenModalBlock(false)}
                onSubmit={() => {
                  setOpenModalBlock(false);
                  getDetail(ipSubnetSelected!);
                }}
              />

              <ModalUnblock
                subnetId={ipSubnetSelected ? ipSubnetSelected : "1"}
                open={openModalUnblock}
                onClose={() => setOpenModalUnblock(false)}
                onSubmit={() => {
                  setOpenModalUnblock(false);
                  getDetail(ipSubnetSelected!);
                }}
              />
            </>
          )}
        </>
      }
    />
  );
};

export default IpSubnet;

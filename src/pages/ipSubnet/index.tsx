"use client";
import dynamic from "next/dynamic";
import { Tree } from "antd";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import React from "react";
import { ParamGet } from "@models/base";
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
  const [paramGet, setParamGet] = useState<ParamGet>({
    PageIndex: 1,
    PageSize: 7,
  } as ParamGet);

  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [ipSubnetSelected, setIpSubnetSelected] = useState<
    string | undefined
  >();

  const onSelect: DirectoryTreeProps["onSelect"] = (keys, info) => {
    var data = info.selectedNodes[0] as DataNode;
    router.push(`ipSubnet/${data.id}`);
    setIpSubnetSelected(data.id);
  };

  const recursiveChildrensTree = (children: IpSubnet[]) => {
    var result = [] as DataNode[];
    children.forEach((i) => {
      result.push({
        id: i.id.toString(),
        title: `${i.firstOctet}.${i.secondOctet}.${i.thirdOctet}.${i.fourthOctet}/${i.prefixLength}`,
        name: `${i.firstOctet}.${i.secondOctet}.${i.thirdOctet}.${i.fourthOctet}/${i.prefixLength}`,
        key: i.id.toString(),
        dateCreated: i.dateCreated,
        dataUpdated: i.dateUpdated,
        parentId: i.parentNetworkId.toString(),
        children: recursiveChildrensTree(i.children),
      });
    });
    return result;
  };

  const getData = async () => {
    // dispatch(
    //   getIpSubnetData({
    //     token: session?.user.access_token!,
    //     paramGet: { ...paramGet },
    //   })
    // ).then(({ payload }) => {
    //   var res = payload as IpSubnetData;
    //   if (res.totalPage < paramGet.PageIndex && res.totalPage != 0) {
    //     setParamGet({ ...paramGet, PageIndex: res.totalPage });
    //   }
    // });
    await ipSubnetService
      .getDataTree(session?.user.access_token!)
      .then((res) => {
        var result = [] as DataNode[];
        res?.forEach((i) => {
          result.push({
            id: i.id.toString(),
            title: `${i.firstOctet}.${i.secondOctet}.${i.thirdOctet}.${i.fourthOctet}/${i.prefixLength}`,
            name: `${i.firstOctet}.${i.secondOctet}.${i.thirdOctet}.${i.fourthOctet}/${i.prefixLength}`,
            key: i.id.toString(),
            dateCreated: i.dateCreated,
            dataUpdated: i.dateUpdated,
            parentId: i?.parentNetworkId?.toString(),
            children: recursiveChildrensTree(i.children),
          });
        });
        setTreeData([...result]);
      });
  };

  useEffect(() => {
    session && getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, paramGet]);
  return (
    <AntdLayoutNoSSR
      content={
        <>
          {areInArray(session?.user.roles!, ROLE_TECH) && (
            <>
              <div className="flex justify-between mb-4 p-2 bg-[#f8f9fa]/10 border border-gray-200 rounded-lg shadow-lg shadow-[#e7edf5]/50">
                <Button
                  type="primary"
                  htmlType="submit"
                  onClick={() => {
                    setOpenModalCreate(true);
                  }}
                >
                  Create
                </Button>
                <SearchComponent
                  placeholder="Search Name, Description..."
                  setSearchValue={(value) =>
                    setParamGet({ ...paramGet, SearchValue: value })
                  }
                />
              </div>

              <ModalCreate
                open={openModalCreate}
                onClose={() => setOpenModalCreate(false)}
                onRefresh={() => {
                  getData();
                }}
              />
              {/* <IpSubnetTable
            onEdit={(record) => {}}
            onDelete={async (record) => {}}
          /> */}
              <div className="p-3">
                <Tree
                  showLine={true}
                  onSelect={onSelect}
                  treeData={treeData}
                  selectedKeys={[ipSubnetSelected!]}
                />
              </div>
              {/* {ipSubnetData.totalPage > 0 && (
            <Pagination
              className="text-end m-4"
              current={paramGet.PageIndex}
              pageSize={ipSubnetData.pageSize ?? 10}
              total={ipSubnetData.totalSize}
              onChange={(page, pageSize) => {
                setParamGet({
                  ...paramGet,
                  PageIndex: page,
                  PageSize: pageSize,
                });
              }}
            />
          )} */}
            </>
          )}
        </>
      }
    />
  );
};

export default IpSubnet;

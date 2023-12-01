"use client";

import RackTable from "@components/area/rack/RackRender";
import useDispatch from "@hooks/use-dispatch";
import useSelector from "@hooks/use-selector";
import { getAllRackData } from "@slices/area";
import { Collapse, CollapseProps } from "antd";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

interface Props {}

const AreaCollap: React.FC<Props> = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const { areaDataLoading, getAllAreaData } = useSelector(
    (state) => state.area
  );

  const items: CollapseProps["items"] = [];
  for (let i = 0; i < getAllAreaData.length; ++i) {
    items.push({
      key: getAllAreaData[i].id,
      label: `Area ${getAllAreaData[i].name}`,
      children: <RackTable area={getAllAreaData[i]!} onEdit={(record) => {}} />,
      onClick: () => {
        dispatch(
          getAllRackData({
            token: session?.user.access_token!,
            id: getAllAreaData[i].id + "",
          })
        );
      },
    });
  }

  return (
    <>
      <Collapse className="m-5" accordion items={items} />
    </>
  );
};

export default AreaCollap;

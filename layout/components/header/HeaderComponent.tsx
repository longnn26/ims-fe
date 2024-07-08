/* eslint-disable @next/next/no-img-element */
"use client";
import React, { Children, useEffect, useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Layout, Button, theme, Badge, Divider } from "antd";
import useSelector from "@hooks/use-selector";
import {
  setCollapsed,
} from "@slices/global";
import useDispatch from "@hooks/use-dispatch";
import { signOut, useSession } from "next-auth/react";
import { Dropdown, Space, Avatar, MenuProps } from "antd";
import { useRouter } from "next/router";
import Head from "next/head";
import { IoMdNotifications } from "react-icons/io";
import signalR from "@signalR/hub";
import notificationService from "@services/notification";
import userService from "@services/user";
import { Notification } from "@models/notification";
import InfiniteScroll from "react-infinite-scroll-component";
import moment from "moment";
import { FaDotCircle } from "react-icons/fa";
import { parseJwt } from "@utils/helpers";

const { Header } = Layout;

interface Props {}

const HeaderComponent: React.FC<Props> = (props) => {
  const { data: session, update: sessionUpdate } = useSession();
  const router = useRouter();
  const dispatch = useDispatch();
  const { collapsed, labelHeader } = useSelector((state) => state.global);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  // const [pageSizeNoti, setPageSizeNoti] = useState<number>(6);
  // const [totalPageNoti, setTotalPageNoti] = useState<number>(2);
  // const [pageIndexNoti, setPageIndexNoti] = useState<number>(0);
  const [newNotifyCount, setNewNotifyCount] = useState<number>(
    session?.user.currenNoticeCount!
  );

  const getNotifications = async () => {
    await notificationService
      .getNotifications(
        session?.user.access_token!
        //   , {
        //   PageSize: pageSizeNoti,
        //   PageIndex: pageIndexNoti + 1,
        // } as ParamGet
      )
      .then(async (data) => {
        // setTotalPageNoti(data.totalPage);
        // setPageIndexNoti(data.pageIndex);
        // setNotifications([...notifications, ...data.data]);
        setNotifications([...notifications, ...data]);
      });
  };

  const seenCurrenNoticeCount = async () => {
    await userService
      .seenCurrentNoticeCount(session?.user.access_token!)
      .then(async (data) => {
        setNewNotifyCount(0);
        const newSession = {
          ...session,
          user: {
            ...session?.user,
            currenNoticeCount: 0,
          },
        };
        await sessionUpdate({ ...newSession });
      });
  };

  const seenNotification = async (id: number) => {
    await notificationService
      .seenNotifications(session?.user.access_token!, id)
      .then((data) => {
        var noti = notifications.findIndex((_) => _.id == data);
        notifications[noti].seen = true;
        setNotifications([...notifications]);
      });
  };

  const handleNotification = async (notification: Notification) => {
    // console.log("noti:", notification);
    switch (notification.data.key) {
      case "Receive":
        // var model = JSON.parse(
        //   notification.data.value
        // ) as ServerAllocationParseJson;
        // router.push(`/account/${model.id}`);
        break;
      default:
        break;
    }
  };

  const items: MenuProps["items"] = [
    {
      label: (
        <span
          onClick={() => {
            router.push(`profile`);
          }}
        >
          {session?.user.roles.includes("Customer")
            ? parseJwt(session.user.access_token).Email
            : session?.user.name}
        </span>
      ),
      key: "0",
    },

    {
      type: "divider",
    },
    {
      label: (
        <span
          onClick={() => {
            signOut();
          }}
        >
          Logout
        </span>
      ),
      key: "2",
    },
  ];

  // useEffect(() => {
  //   // session && getNotifications();
  // }, [session]);

  // useEffect(() => {
  //   if (session != null) {
  //     const newConnection = signalR.connectionServer(session.user.access_token);
  //     newConnection
  //       .start()
  //       .then(() => {
  //         newConnection.on("newNotify", async (data: any) => {
  //           // if (showNotification) {
  //           var list = notifications.reverse();
  //           list.push(data);
  //           setNotifications(list.reverse());
  //           // }
  //           toast(
  //             <div
  //               id="toast-notification"
  //               className="w-full max-w-xs p-4 text-gray-900 bg-white"
  //               role="alert"
  //               onClick={() => handleNotification(data)}
  //             >
  //               <div className="flex items-center mb-3">
  //                 <span className="mb-1 text-sm font-semibold text-gray-900 dark:text-white">
  //                   {data.title}
  //                 </span>
  //               </div>
  //               <div className="flex items-center">
  //                 <div className="ml-3 text-sm font-normal">
  //                   <div className="text-sm font-semibold text-gray-900 dark:text-white">
  //                     {data?.subject}
  //                   </div>
  //                   <div className="text-sm font-normal">{`${data?.action} ${data?.body}`}</div>
  //                   <span className="text-xs font-medium text-blue-600 dark:text-blue-500">
  //                     a few seconds ago
  //                   </span>
  //                 </div>
  //               </div>
  //             </div>,
  //             {
  //               type: "success" as TypeOptions,
  //               position: "top-right",
  //             }
  //           );
  //         });
  //         newConnection.on("newNotifyCount", async (data: number) => {
  //           setNewNotifyCount(data);
  //           const newSession = {
  //             ...session,
  //             user: {
  //               ...session?.user,
  //               currenNoticeCount: data,
  //             },
  //           };
  //           await sessionUpdate({ ...newSession });
  //         });
  //       })
  //       .catch((err) => console.log(err));
  //     return () => {
  //       newConnection
  //         .stop()
  //         .then(() => {})
  //         .catch(() => {});
  //     };
  //   }
  // }, [session]);
  return (
    <Header
      style={{ padding: 0, background: colorBgContainer }}
      className="flex justify-between"
    >
      <Head>
        <title>{labelHeader}</title>
      </Head>
      <div className="flex w-1/3 justify-start items-center">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => dispatch(setCollapsed(!collapsed))}
          style={{
            fontSize: "16px",
            width: 64,
            height: 64,
          }}
        />
        <div className="max-w-screen-xl inline-block flex-wrap items-center justify-between">
          <div className="flex items-center">
            <img
              src="/images/logo.png"
              className="h-14 mr-3"
              alt="FlowBite Logo"
            />
          </div>
        </div>
      </div>

      <div className="flex w-1/3 justify-center">
        <span className="self-center text-xl font-semibold whitespace-nowrap">
          {labelHeader}
        </span>
      </div>

      <div className="flex w-1/3 justify-end pr-3">
        <Space
          className="m-2 hover:cursor-pointer relative"
          onClick={() => {
            setShowNotification(!showNotification);
            newNotifyCount > 0 && seenCurrenNoticeCount();
          }}
        >
          <Badge count={newNotifyCount}>
            <Avatar
              className="bg-[#edebd3] hover:bg-[#edebd3]/50"
              shape="circle"
              icon={<IoMdNotifications style={{ color: "#dba50f" }} />}
            />
          </Badge>
        </Space>
        {showNotification && (
          <div
            className=" top-[80px] z-20 absolute w-full max-w-sm bg-white divide-y divide-gray-100 rounded-lg shadow"
            aria-labelledby="dropdownNotificationButton"
          >
            <div className="block px-4 py-2 font-medium text-center text-[#dba50f] rounded-t-lg bg-gray-50">
              Notifications
            </div>
            <InfiniteScroll
              dataLength={notifications?.length!}
              next={getNotifications}
              height={"36rem"}
              style={{
                display: "flex",
                flexDirection: "column",
              }}
              // hasMore={Boolean(pageIndexNoti < totalPageNoti)}
              hasMore={false}
              loader={<h4>Loading...</h4>}
              scrollableTarget="scrollableDiv"
            >
              <div className="divide-y divide-gray-100">
                {notifications?.map((noti, index) => (
                  <div
                    key={index}
                    className="h-24 flex px-4 py-3 hover:bg-gray-100 hover:cursor-pointer"
                    onClick={() => {
                      handleNotification(noti);
                      seenNotification(noti.id);
                    }}
                  >
                    <div className="flex-shrink-0"></div>
                    <div className="w-full pl-3">
                      <div className="text-gray-500 text-sm mb-1.5">
                        <span className="font-semibold text-gray-900">
                          {`${noti.title} `}
                        </span>
                      </div>
                      <div className="text-gray-500 text-sm mb-1.5">
                        <span className="text-gray-900">{`${noti.body} `}</span>
                      </div>
                      <div
                        className={`text-xs ${
                          noti.seen ? "text-gray-600" : "text-blue-600"
                        } `}
                      >
                        {moment(noti.dateCreated).hour() > 1
                          ? moment(noti.dateCreated).fromNow()
                          : moment(noti.dateCreated)
                              .locale("en")
                              .format("MMM DD HH:mm")}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="flex items-center justify-center w-5 h-5 bg-white-600 border border-white rounded-full">
                        <FaDotCircle
                          onClick={
                            () => {
                              !noti.seen && seenNotification(noti.id!);
                            }
                            // !noti.seen && seenNotification(noti.id!)
                          }
                          color={` ${noti.seen ? "gray" : "#dba50f"}`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </InfiniteScroll>
          </div>
        )}

        <Dropdown
          menu={{ items }}
          trigger={["click"]}
          className="cursor-pointer"
        >
          <Space>
            <Avatar style={{ backgroundColor: "#edebd3", color: "#dba50f" }}>
              {session?.user.roles.includes("Customer")
                ? parseJwt(session.user.access_token).Email.charAt(0)
                : session?.user.userName?.charAt(0)}
            </Avatar>
          </Space>
        </Dropdown>
      </div>
    </Header>
  );
};

export default HeaderComponent;

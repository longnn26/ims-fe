/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Layout, Button, theme, Badge, Divider } from "antd";
import useSelector from "@hooks/use-selector";
import { setCollapsed, setSliderMenuItemSelectedKey } from "@slices/global";
import useDispatch from "@hooks/use-dispatch";
import { sliderMenu } from "@utils/global";
import { signOut, useSession } from "next-auth/react";
import { Dropdown, Space, Avatar, MenuProps } from "antd";
import { useRouter } from "next/router";
import Head from "next/head";
import { IoMdNotifications } from "react-icons/io";
import signalR from "@signalR/hub";
import notificationService from "@services/notification";
import userService from "@services/user";
import { ParamGet } from "@models/base";
import { Notification } from "@models/notification";
import InfiniteScroll from "react-infinite-scroll-component";
import moment from "moment";
import { FaDotCircle } from "react-icons/fa";
import { TypeOptions, toast } from "react-toastify";
import { MdReportProblem } from "react-icons/md";
import { RequestExpand, RequestExpandParseJson } from "@models/requestExpand";
import { AppointmentParseJson } from "@models/appointment";
import { RequestUpgradeParseJson } from "@models/requestUpgrade";
import { RequestHostParseJson } from "@models/requestHost";
import { parseJwt } from "@utils/helpers";

const { Header } = Layout;

interface Props {}

const HeaderComponent: React.FC<Props> = (props) => {
  const { data: session, update: sessionUpdate } = useSession();
  const router = useRouter();
  const dispatch = useDispatch();
  const { collapsed, sliderMenuItemSelectedKey } = useSelector(
    (state) => state.global
  );
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const item = sliderMenu.find((_) => _.key === sliderMenuItemSelectedKey);
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [pageSizeNoti, setPageSizeNoti] = useState<number>(6);
  const [totalPageNoti, setTotalPageNoti] = useState<number>(2);
  const [pageIndexNoti, setPageIndexNoti] = useState<number>(0);
  const [newNotifyCount, setNewNotifyCount] = useState<number>(
    session?.user.currenNoticeCount!
  );

  const getNotifications = async () => {
    await notificationService
      .getNotifications(session?.user.access_token!, {
        PageSize: pageSizeNoti,
        PageIndex: pageIndexNoti + 1,
      } as ParamGet)
      .then(async (data) => {
        setTotalPageNoti(data.totalPage);
        setPageIndexNoti(data.pageIndex);
        setNotifications([...notifications, ...data.data]);
      });
  };

  const seenCurrenNoticeCount = async () => {
    await userService
      .seenCurrenNoticeCount(session?.user.access_token!)
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
    switch (notification.data.key) {
      case "RequestExpand":
        var requestExpand = JSON.parse(
          notification.data.value
        ) as RequestExpandParseJson;
        router.push(`/requestExpand/${requestExpand.Id}`);
        break;
      case "Appointment":
        var apppointment = JSON.parse(
          notification.data.value
        ) as AppointmentParseJson;
        router.push(`/appointment/${apppointment.Id}`);
        break;
      case "RequestUpgrade":
        var requestUpgrade = JSON.parse(
          notification.data.value
        ) as RequestUpgradeParseJson;
        router.push(`/requestUpgrade/${requestUpgrade.Id}`);
        break;
      case "RequestHost":
        var requestHost = JSON.parse(
          notification.data.value
        ) as RequestHostParseJson;
        router.push(`/requestHost/${requestHost.Id}`);
        break;

      default:
        break;
    }
  };
  const items: MenuProps["items"] = [
    {
      label: <span>{session?.user.name}</span>,
      key: "0",
    },

    {
      type: "divider",
    },
    {
      label: (
        <span
          onClick={() => {
            dispatch(setSliderMenuItemSelectedKey("server-allocation"));
            signOut();
          }}
        >
          Logout
        </span>
      ),
      key: "2",
    },
  ];

  useEffect(() => {
    switch (router.pathname) {
      case "/server":
        dispatch(setSliderMenuItemSelectedKey("server"));
        break;
      case "/component":
        dispatch(setSliderMenuItemSelectedKey("component"));
        break;
      case "/ipSubnet":
        dispatch(setSliderMenuItemSelectedKey("ipSubnet"));
        break;
      case "/customer":
        dispatch(setSliderMenuItemSelectedKey("customer"));
        break;
      case "/area":
        dispatch(setSliderMenuItemSelectedKey("area"));
        break;
      case "/request":
        dispatch(setSliderMenuItemSelectedKey("request"));
        break;
      case "/appointment":
        dispatch(setSliderMenuItemSelectedKey("appointment"));
        break;
      case "/staffAccount":
        dispatch(setSliderMenuItemSelectedKey("staffAccount"));
        break;
      default:
        break;
    }
  }, []);

  useEffect(() => {
    session && getNotifications();
  }, [session]);

  useEffect(() => {
    if (session != null) {
      const newConnection = signalR.connectionServer(session.user.access_token);
      newConnection
        .start()
        .then(() => {
          newConnection.on("newNotify", async (data: any) => {
            // if (showNotification) {
            var list = notifications.reverse();
            list.push(data);
            setNotifications(list.reverse());
            // }
            toast(
              <div
                id="toast-notification"
                className="w-full max-w-xs p-4 text-gray-900 bg-white"
                role="alert"
                onClick={() => handleNotification(data)}
              >
                <div className="flex items-center mb-3">
                  <span className="mb-1 text-sm font-semibold text-gray-900 dark:text-white">
                    {data.title}
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="ml-3 text-sm font-normal">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {data?.subject}
                    </div>
                    <div className="text-sm font-normal">{`${data?.action} ${data?.body}`}</div>
                    <span className="text-xs font-medium text-blue-600 dark:text-blue-500">
                      a few seconds ago
                    </span>
                  </div>
                </div>
              </div>,
              {
                type: "success" as TypeOptions,
                position: "top-right",
              }
            );
          });
          newConnection.on("newNotifyCount", async (data: number) => {
            setNewNotifyCount(data);
            const newSession = {
              ...session,
              user: {
                ...session?.user,
                currenNoticeCount: data,
              },
            };
            await sessionUpdate({ ...newSession });
          });
        })
        .catch((err) => console.log(err));
      return () => {
        newConnection
          .stop()
          .then(() => {})
          .catch(() => {});
      };
    }
  }, [session]);
  return (
    <Header
      style={{ padding: 0, background: colorBgContainer }}
      className="flex justify-between"
    >
      <Head>
        <title>{item?.label}</title>
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
              src="/images/logo.jpeg"
              className="h-14 mr-3"
              alt="FlowBite Logo"
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap">
              IMS
            </span>
          </div>
        </div>
      </div>

      <div className="flex w-1/3 justify-center">
        <span className="self-center text-xl font-semibold whitespace-nowrap">
          {item?.label}
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
              className="bg-[#fde3cf] hover:bg-[#fde3cf]/50"
              shape="circle"
              icon={<IoMdNotifications style={{ color: "#f56a00" }} />}
            />
          </Badge>
        </Space>
        {showNotification && (
          <div
            className=" top-[80px] z-20 absolute w-full max-w-sm bg-white divide-y divide-gray-100 rounded-lg shadow"
            aria-labelledby="dropdownNotificationButton"
          >
            <div className="block px-4 py-2 font-medium text-center text-[#f56a00] rounded-t-lg bg-gray-50">
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
              hasMore={Boolean(pageIndexNoti < totalPageNoti)}
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
                          color={` ${noti.seen ? "gray" : "#f56a00"}`}
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
            <Avatar style={{ backgroundColor: "#fde3cf", color: "#f56a00" }}>
              {session?.user.userName?.charAt(0)}
            </Avatar>
          </Space>
        </Dropdown>
      </div>
    </Header>
  );
};

export default HeaderComponent;

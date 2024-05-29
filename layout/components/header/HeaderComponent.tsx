/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Layout, Button, theme, Badge, Divider, Switch } from "antd";
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
import { Notification } from "@models/notification";
import InfiniteScroll from "react-infinite-scroll-component";
import moment from "moment";
import { FaDotCircle } from "react-icons/fa";
import { TypeOptions, toast } from "react-toastify";
import { parseJwt } from "@utils/helpers";
import { IoCheckmarkDone } from "react-icons/io5";
import customerService from "@services/customer";
import emergencyService from "@services/emergency";
import { BiCheckCircle } from "react-icons/bi";

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
  // const [pageSizeNoti, setPageSizeNoti] = useState<number>(6);
  // const [totalPageNoti, setTotalPageNoti] = useState<number>(2);
  // const [pageIndexNoti, setPageIndexNoti] = useState<number>(0);
  const [newNotifyCount, setNewNotifyCount] = useState<number>(
    session?.user.currenNoticeCount!
  );

  // sửa lại default
  const [isOnline, setIsOnline] = useState<boolean>(true);

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

  const seenNotification = async (id: number) => {
    await notificationService
      .seenNotifications(session?.user.access_token!, id)
      .then((data) => {
        var noti = notifications.findIndex((_) => _.id == data);
        if (notifications[noti].seen == false) {
          if (newNotifyCount > 0) {
            setNewNotifyCount(newNotifyCount - 1);
          }
        }
        notifications[noti].seen = true;

        setNotifications([...notifications]);
      });
  };

  const seenAllNotifications = async () => {
    await notificationService
      .seenAllNotifications(session?.user.access_token!)
      .then((data) => {
        const updatedNotifications = notifications.map((notification) => ({
          ...notification,
          seen: true,
        }));
        if (newNotifyCount > 0) {
          setNewNotifyCount(0);
        }
        setNotifications(updatedNotifications);
      });
  };

  const handleNotification = async (notification: Notification) => {
    // console.log("noti:", notification);
    switch (notification.typeModel) {
      case "WalletWithDrawFunds":
        router.push("/support");
        break;
      case "Emergency":
        router.push("/emergency");
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
          onClick={async () => {
            dispatch(setSliderMenuItemSelectedKey(""));
            await customerService
              .changeStaffStatusOffline(session?.user.access_token!)
              .then((res) => {
                console.log("change offline ok");
              })
              .catch((errors) => {
                console.log("errors change offline status", errors);
              });
            router.push("/");
            signOut();
          }}
        >
          Logout
        </span>
      ),
      key: "2",
    },
  ];

  const onChangeStaffStatus = async () => {
    if (!isOnline) {
      await customerService
        .changeStaffStatusOnline(session?.user.access_token!)
        .then((res) => {
          console.log("change online ok");
          setIsOnline(true);
        })
        .catch((errors) => {
          console.log("errors change online status", errors);
        });
    } else {
      await customerService
        .changeStaffStatusOffline(session?.user.access_token!)
        .then((res) => {
          console.log("change offline ok");
          setIsOnline(false);
        })
        .catch((errors) => {
          console.log("errors change offline status", errors);
        });
    }
  };

  const handleChangeEmergencyStatus = async (emergencyId: string) => {
    await emergencyService
      .changeToProcessingStatus(session?.user.access_token!, emergencyId)
      .then((res) => {
        console.log("res emergency", res);
        console.log("change emergency status");
      })
      .catch((errors) => {
        console.log("errors to change emergency status", errors);
      })
      .finally(() => {
        router.push("/emergency");
      });
  };

  useEffect(() => {
    switch (router.pathname) {
      case "/dashboard":
        dispatch(setSliderMenuItemSelectedKey("dashboard"));
        break;
      case "/account":
        dispatch(setSliderMenuItemSelectedKey("account"));
        break;
      case "/booking":
        dispatch(setSliderMenuItemSelectedKey("booking"));
        break;
      case "/emergency":
        dispatch(setSliderMenuItemSelectedKey("emergency"));
        break;
      case "/configuration":
        dispatch(setSliderMenuItemSelectedKey("configuration"));
        break;
      case "/support":
        dispatch(setSliderMenuItemSelectedKey("support"));
        break;
      case "/request":
        dispatch(setSliderMenuItemSelectedKey("request"));
        break;
      case "/profile":
        dispatch(setSliderMenuItemSelectedKey("profile"));
        break;
      default:
        break;
    }
  }, []);

  useEffect(() => {
    session && getNotifications();
  }, [session]);

  const autoTurnOnline = async () => {
    await customerService
      .changeStaffStatusOnline(session?.user.access_token!)
      .then((res) => {
        console.log("change online ok");
      })
      .catch((errors) => {
        console.log("errors change online status", errors);
      });
  };

  useEffect(() => {
    autoTurnOnline();
  }, []);

  useEffect(() => {
    if (session != null) {
      const newConnection = signalR.connectionServer(session.user.access_token);
      newConnection
        .start()
        .then(() => {
          newConnection.on("newNotify", async (data: any) => {
            var list = notifications.reverse();
            console.log("data noti", data);
            list.push(data);
            setNotifications(list.reverse());

            //convert từ string về object để lấy data xử lý tiếp
            const parsedData = JSON.parse(data.data);

            if (data.typeModel == "Emergency") {
              toast(
                <>
                  <div
                    id="toast-notification"
                    className="w-full max-w-xs p-4 text-gray-900 bg-white"
                    role="alert"
                    onClick={() => handleNotification(data)}
                  >
                    <div className="flex items-center">
                      <div className="ml-3 text-sm font-normal">
                        <div className="text-sm font-semibold uppercase text-gray-900">
                          <p>{data?.title}</p>
                        </div>
                        <div className="text-sm uppercase font-normal">{`${data?.body}`}</div>
                      </div>
                    </div>
                  </div>
                  {/* tiến hành xử lý */}
                  <div className="flex justify-center items-center">
                    <Button
                      icon={<BiCheckCircle />}
                      type="primary"
                      onClick={() => handleChangeEmergencyStatus(parsedData.Id)}
                    >
                      Tiến hành xử lý
                    </Button>
                  </div>
                </>,
                {
                  position: "top-center",
                }
              );
            } else {
              //toast không dành cho emergency
              console.log("come here");
              toast(
                <div
                  id="toast-notification"
                  className="w-full max-w-xs p-4 text-gray-900 bg-white"
                  role="alert"
                  onClick={() => handleNotification(data)}
                >
                  <div className="flex items-center">
                    <div className="ml-3 text-sm font-normal">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        {data?.title}
                      </div>
                      <div className="text-sm font-normal">{`${data?.body}`}</div>
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
            }
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
              src="/images/logo_with_line_text.png"
              className="h-10 mr-3"
              alt="FlowBite Logo"
            />
          </div>
        </div>
      </div>

      <div className="flex w-1/3 justify-center">
        <span className="self-center text-xl font-semibold whitespace-nowrap">
          {item?.label}
        </span>
      </div>

      <div className="flex w-1/3 justify-end pr-3 items-center">
        {/* button switch */}
        <div className="toggle-button-cover">
          <div className="button r" id="button-3">
            <input
              type="checkbox"
              className="checkbox"
              checked={isOnline}
              onChange={onChangeStaffStatus}
            />
            <div className="layer"></div>
            <div className="knobs"></div>
          </div>
        </div>

        <Space
          className="m-2 hover:cursor-pointer relative"
          onClick={() => {
            setShowNotification(!showNotification);
          }}
        >
          <Badge count={newNotifyCount}>
            <Avatar
              // className="bg-[#fde3cf] hover:bg-[#fde3cf]/50"
              className="bg-[#e3eced] hover:bg-[#e3eced]/50"
              shape="circle"
              icon={<IoMdNotifications style={{ color: "#01a0e9" }} />}
            />
          </Badge>
        </Space>

        {showNotification && (
          <div
            className=" top-[80px] z-20 absolute w-full max-w-sm bg-white divide-y divide-gray-100 rounded-lg shadow"
            aria-labelledby="dropdownNotificationButton"
          >
            <div className="block px-4 py-2 relative font-medium text-center text-[#01a0e9] rounded-t-lg bg-gray-50">
              Notifications
              <div
                className="absolute -top-3 right-3"
                onClick={seenAllNotifications}
              >
                <IoCheckmarkDone className="w-5 h-5 cursor-pointer" />
              </div>
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
                    className={`h-fit flex px-4 py-3 hover:bg-gray-100 hover:cursor-pointer
                  ${!noti.seen && "bg-blue-100"} `}
                    onClick={() => {
                      handleNotification(noti);
                      seenNotification(noti.id);
                    }}
                  >
                    <div className="w-full pl-2">
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
                          color={` ${noti.seen ? "gray" : "#01a0e9"}`}
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
            <Avatar style={{ backgroundColor: "#e3eced", color: "#01a0e9" }}>
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

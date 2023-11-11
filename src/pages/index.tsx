"use client";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import signalR from "../../signalR/hub";
import { useSession } from "next-auth/react";
const AntdLayoutNoSSR = dynamic(() => import("../../layout/AntdLayout"), {
  ssr: false,
});

const Customer: React.FC = () => {
  const { data: session } = useSession();

  useEffect(() => {
    if (session != null) {
      const newConnection = signalR.connectionServer(
        session?.user.access_token!
      );
      newConnection
        .start()
        .then(() => {
          newConnection.on("newNotify", async (data: any) => {
            console.log(data);
          });

          newConnection.on("newNotifyCount", async (data: number) => {
            console.log(data);
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
    <AntdLayoutNoSSR
      content={
        <>
          <h1>Customer</h1>
        </>
      }
    />
  );
};

export default Customer;

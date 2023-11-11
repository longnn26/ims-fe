"use client";
import dynamic from "next/dynamic";
const AntdLayoutNoSSR = dynamic(() => import("../../layout/AntdLayout"), {
  ssr: false,
});

const Ticket: React.FC = () => {
  return (
    <AntdLayoutNoSSR
      content={
        <>
        <h1>Ticket</h1>
        </>
      }
    />
  );
};

export default Ticket;

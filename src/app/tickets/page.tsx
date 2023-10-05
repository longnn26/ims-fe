import React from "react";
import Home from "../page";
import TicketListTable from "@/components/ticket/TicketListTable";
import SearchTicketList from "@/components/ticket/SearchTicketList";

// trang của sale

export default function page() {
  return (
    <Home
      content={
        <>
          <div style={{ padding: "14px" }}>
            <h1 style={{ paddingBottom: "10px", textAlign: "center" }}>
              Danh Sách Yêu Cầu
            </h1>
            <SearchTicketList />
          </div>
          <div style={{ paddingTop: "10px" }}>
            <TicketListTable />
          </div>
        </>
      }
    />
  );
}

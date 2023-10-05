import AccountTable from "@/components/account/AccountTable";
import React from "react";
import Home from "../page";
import CreateAccountButton from "@/components/account/CreateAccountButton";

//trang của admin

export default function page() {
  return (
    <Home
      content={
        <>
          <div style={{ padding: "14px" }}>
            <h1 style={{ paddingBottom: "10px", textAlign: "center" }}>
              Tài Khoản Khách Hàng
            </h1>
            <CreateAccountButton />
          </div>
          <div style={{ paddingTop: "10px" }}>
            <AccountTable />
          </div>
        </>
      }
    />
  );
}

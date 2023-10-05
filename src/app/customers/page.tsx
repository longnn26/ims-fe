import React from "react";
import Home from "../page";
import CustomerListTable from "@/components/customer/CustomerListTable";
import CreateAndSearchAccount from "@/components/customer/CreateAndSearchAccount";

// trang của sale

export default function page() {
  return (
    <Home
      content={
        <>
          <>
            <div style={{ padding: "14px" }}>
              <h1 style={{ paddingBottom: "10px", textAlign: "center" }}>
                Danh Sách Khách Hàng
              </h1>
              <CreateAndSearchAccount />
            </div>
            <div style={{ paddingTop: "10px" }}>
              <CustomerListTable />
            </div>
          </>
        </>
      }
    />
  );
}

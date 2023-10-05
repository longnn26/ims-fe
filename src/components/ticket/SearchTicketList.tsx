"use client";
import React from "react";
import Search from "antd/es/input/Search";

const SearchTicketList: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
      }}
    >
      <strong>Tìm kiếm yêu cầu:</strong>{" "}
      <Search
        placeholder="Tìm kiếm"
        allowClear
        style={{
          marginLeft: "15px",
          width: 300,
        }}
      />
    </div>
  );
};

export default SearchTicketList;

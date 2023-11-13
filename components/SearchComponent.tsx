"use client";

import { BsSearch } from "react-icons/bs";
import { useState } from "react";
import { Button } from "antd";
import { Input } from "antd";

const { Search } = Input;

interface Props {
  setSearchValue: (value: string) => void;
  placeholder?: string;
}

const SearchComponent: React.FC<Props> = (props) => {
  const { setSearchValue, placeholder } = props;
  const [value, setValue] = useState<string>("");
  const onKeyPress = (event: any) => {
    if (event.key == "Enter") setSearchValue(event.target.value);
  };
  return (
    <div className="flex">
      {/* <div className="relative w-full"> */}
        <Search
          placeholder={placeholder}
          allowClear
          enterButton={
            <Button onClick={() => setSearchValue(value)}>
              <BsSearch />
            </Button>
          }
          onSearch={(value, event) => {
            onKeyPress(event);
          }}
          onChange={(e) => setValue(e.target.value)}
          // style={{ width: 200 }}
        />
        {/* <input
          type="search"
          id="search-dropdown"
          className="focus:cursor-pointer block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-300 focus:border-blue-300"
          placeholder="Search Name, Creator..."
          onKeyPress={onKeyPress}
          onChange={(e) => setValue(e.target.value)}
        /> */}
      </div>
    // </div>
  );
};

export default SearchComponent;

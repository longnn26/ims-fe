"use client";
import React from "react";
import Link from "next/link";

import { usePathname, useRouter } from "next/navigation";
import { NAV_ITEMS_GENERAL } from "@utils/constants";
import Image from "next/image";

const HeaderHomePage = () => {
  const router = useRouter();
  const [userData, setUserData] = React.useState<any | null>(null);
  const pathName = usePathname();

  const handleChangePage = () => {
    router.push("/signin");
  };

  const getNavItems = () => {
    if (userData && userData.role_name) {
      switch (userData.role_name) {
        default:
          return NAV_ITEMS_GENERAL;
      }
    } else {
      return NAV_ITEMS_GENERAL;
    }
  };

  const navList = (
    <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      {getNavItems().map((item, index) => (
        <p
          className="p-1 font-normal nav-items"
        >
          <Link
            href={item?.path}
            className={`flex items-center ${
              pathName.includes(item?.path) && "active"
            }`}
          >
            {item?.nameItem}
          </Link>
        </p>
      ))}
    </ul>
  );

  return (
    <div className="general-header-container top-0 z-10 h-max max-w-full border-0 rounded-none px-4 py-2 lg:px-8 lg:py-3">
      <div className="container flex items-center justify-between text-white">
        <Link
          href="/"
          className="mr-4 cursor-pointer py-1.5 font-medium brand-name flex items-center gap-2"
        >
          <Image src="/images/logo_with_line_text.png" width={200} height={55} alt="logo" />
          {/* <p className="text-xl brand">SecureRideHome</p> */}
        </Link>
        <div className="flex items-center gap-4">
          <div className="mr-4 hidden lg:block">{navList}</div>

          <div className="flex items-center justify-between gap-2">
            <button
              className="hidden lg:inline-block btn-signup"
              onClick={handleChangePage}
            >
              <span className="text-black">Đăng nhập</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderHomePage;

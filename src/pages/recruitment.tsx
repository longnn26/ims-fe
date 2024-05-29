"use client";

import ModalRecruitmentForm from "@components/recruitment/ModelRecruitmentForm";
import { Select } from "antd";
import dynamic from "next/dynamic";
import React from "react";

const HomeLayoutNoSSR = dynamic(() => import("@layout/HomeLayout"), {
  ssr: false,
});

const OPTION_HEADER = [
  {
    id: 1,
    nameItem: "ĐĂNG KÝ TRỰC TIẾP",
  },
  {
    id: 2,
    nameItem: "ĐĂNG KÝ ONLINE",
  },
];

const Recruitment = () => {
  const [selectedMenu, setSelectedMenu] = React.useState("ĐĂNG KÝ TRỰC TIẾP");
  const [openModalForm, setOpenModalForm] = React.useState<boolean>(false);

  const handleClickMenuItem = (nameItem: string) => {
    setSelectedMenu(nameItem);
  };

  const data = [
    {
      value: "TP. Hồ Chí Minh",
      label: "TP. Hồ Chí Minh",
    },
  ];

  return (
    <HomeLayoutNoSSR
      content={
        <div className="container pt-6">
          <h2 className="text-center text-2xl font-semibold mb-6">
            Cách thức ứng tuyển
          </h2>
          <p className="text-center text-lg">
            Ứng viên có thể mang hồ sơ và đăng ký trực tiếp <br /> tại địa điểm
            tuyển dụng hoặc có thể đăng ký thông qua form online.
          </p>

          <div className="flex justify-between w-full mt-10">
            <div className="w-1/2 p-4 pt-8">
              <h2 className="text-center text-2xl font-semibold mb-6 text-blue-500">
                Lựa chọn địa điểm ứng tuyển
              </h2>

              <div className="mt-6">
                <p className="font-semibold text-lg">Lựa chọn Tỉnh/Thành phố</p>

                <div>
                  <Select
                    placeholder="Tỉnh/Thành Phố"
                    className="select_option w-full"
                    options={data}
                  />
                </div>
              </div>
            </div>

            <div className="w-1/2 p-6" style={{ backgroundColor: "#F6F6F9" }}>
              <div className="container general-management__menu">
                <ul className="">
                  {OPTION_HEADER.map((item, index) => (
                    <li key={index}>
                      <a
                        onClick={() => handleClickMenuItem(item.nameItem)}
                        className={
                          selectedMenu === `${item.nameItem}` ? "active" : ""
                        }
                      >
                        {item.nameItem}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="w-full mt-8">
                {selectedMenu === "ĐĂNG KÝ TRỰC TIẾP" ? (
                  <>
                    <p className="mb-8">
                      Ứng viên đến trực tiếp địa điểm phỏng vấn để được hướng
                      dẫn chi tiết
                    </p>
                    <div className="h-fit bg-white p-4">
                      <p className="font-semibold">Đại học FPT Hồ Chí Minh</p>
                      <p className="mt-4">
                        Lô E2a-7, Đường D1, Đ. D1, Long Thạnh Mỹ, Thành Phố Thủ
                        Đức, Thành phố Hồ Chí Minh 700000
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="mb-8">
                      Ứng viên lựa chọn điền form để cung cấp trước một số thông
                      tin
                    </p>

                    <div
                      className="flex items-center justify-center flex-col gap-4 cursor-pointer"
                      onClick={() => setOpenModalForm(true)}
                    >
                      <img
                        src="https://cdn.xanhsm.com/2023/05/5f043081-vector.png"
                        alt="form"
                      />
                      <p className="text-orange-300 font-semibold">
                        Bấm vào đây để mở form
                      </p>
                    </div>

                    <ModalRecruitmentForm
                      open={openModalForm}
                      onClose={() => setOpenModalForm(false)}
                      onSubmit={() => {}}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      }
    />
  );
};

export default Recruitment;

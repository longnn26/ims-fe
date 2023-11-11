"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Avatar, Pagination, Select, Space } from "antd";
import menuService from "@services/menu";
import {
  MenuItemPublic,
  MenuItemPublicAntd,
  MenuRequestPublic,
} from "@models/menu";

import { Layout, Menu, theme } from "antd";
import languageService from "@services/language";
import { OptionType, ParamGet } from "@models/base";
import { Language } from "@models/language";
import { url } from "@utils/api-links";
import blogService from "@services/blog";
import { BlogPublicData, ParamGetBlogPublic } from "@models/blog";
import BlogPreview from "@components/view/component/blog-preview";
import { RingLoader } from "react-spinners";
const { Header, Content, Footer } = Layout;
const { Option } = Select;
const View: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [menuData, setMenuData] = useState<MenuItemPublicAntd[]>([]);
  const [blogData, setBlogData] = useState<BlogPublicData>();
  const [blogDataLoading, setBlogDataLoading] = useState<boolean>(false);
  const [languageSelected, setLanguageSelected] = useState<OptionType>();
  const [paramGet, setParamGet] = useState<ParamGetBlogPublic>({
    PageIndex: 1,
    PageSize: 10,
  } as ParamGetBlogPublic);
  const [categoryIdSelected, setCategoryIdSelected] = useState<string[]>([]);
  const [languageOptions, setLanguageOptions] = useState<Language[]>([]);
  const [menuRequestPublic, setMenuRequestPublic] =
    useState<MenuRequestPublic>();

  const recursiveChildrensTree = (children: MenuItemPublic[]) => {
    var result = [] as MenuItemPublicAntd[];
    children.forEach((c) => {
      result.push({
        name: c.name,
        // categoryId: c.categoryId,
        key: c.categoryId,
        children:
          c.children!.length > 0
            ? recursiveChildrensTree(c.children!)
            : undefined,
        label: c.name,
      });
    });
    return result;
  };

  const getPostPublicData = useCallback(() => {
    if (paramGet.LanguageId && categoryIdSelected.length > 0) {
      setBlogDataLoading(true);
      var urlFilter = "";
      if (categoryIdSelected.length > 0) {
        urlFilter = "?CategoryIds=";
        var categoryIds = categoryIdSelected.filter(
          (_) => _ !== "rc-menu-more"
        );
        for (let index = 0; index < categoryIds.length; index++) {
          if (index === categoryIds.length - 1) {
            urlFilter = urlFilter + categoryIds[index];
          } else {
            urlFilter = urlFilter + categoryIds[index] + "&CategoryIds=";
          }
        }
      }

      blogService
        .getBlogPublic({
          ...paramGet,
          UrlFilter: urlFilter,
        } as ParamGetBlogPublic)
        .then((res) => {
          setBlogData(res);
          setBlogDataLoading(false);
        })
        .catch(() => {
          setBlogDataLoading(false);
        });
    }
  }, [categoryIdSelected, paramGet]);

  const getData = useCallback(() => {
    menuRequestPublic &&
      menuService.getMenuPublic(menuRequestPublic).then((data) => {
        var result = [] as MenuItemPublicAntd[];
        data.forEach((c) => {
          result.push({
            name: c.name,
            key: c.categoryId,
            children:
              c.children!.length > 0
                ? recursiveChildrensTree(c.children)
                : undefined,
            label: c.name,
          });
        });
        setMenuData([...result]);
        data.length > 0 &&
          setCategoryIdSelected([...categoryIdSelected, data[0].categoryId]);
      });
  }, [menuRequestPublic]);

  const getDataInitial = () => {
    languageService.getLanguagePublic({} as ParamGet).then((res) => {
      setLanguageSelected({
        value: res.data[1].id,
        label: res.data[1].name,
      } as OptionType);
      setParamGet({ ...paramGet, LanguageId: res.data[1].id });
      setLanguageOptions([...res.data] as Language[]);
      setMenuRequestPublic({
        languageId: res.data[1].id,
        normalizedName: "MAIN",
      } as MenuRequestPublic);
    });
  };

  useEffect(() => {
    getData();
  }, [getData]);

  useEffect(() => {
    getPostPublicData();
  }, [getPostPublicData]);

  useEffect(() => {
    getDataInitial();
  }, []);

  return (
    <>
      {blogDataLoading && (
        <div className="w-screen h-screen flex justify-center items-center fixed z-50">
          <RingLoader color="#36d7b7" />
        </div>
      )}
      <Layout>
        <Header
          style={{
            display: "flex",
            position: "fixed",
            width: "100%",
            alignItems: "center",
            justifyContent: "space-around",
            background: colorBgContainer,
          }}
        >
          <div className="flex w-1/3 justify-start">
            <div className="inline-block flex-wrap items-center justify-between p-4">
              <div className="items-center md:flex hidden">
                <img
                  src="https://images.saasworthy.com/tr:w-200,h-0/aiwriter_4457_logo_1571311648_bn4hx.png"
                  className="h-8 mr-3"
                  alt="FlowBite Logo"
                />
                <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                  CMS
                </span>
              </div>
            </div>
          </div>
          <Menu
            style={{ background: colorBgContainer }}
            mode="horizontal"
            items={menuData}
            selectedKeys={[categoryIdSelected[0]]}
            onSelect={async (info) => {
              setCategoryIdSelected(info.keyPath);
            }}
          ></Menu>
          <Select
            className="w-60 h-auto"
            labelInValue
            value={languageSelected}
            onChange={({ value, label }) => {
              setLanguageSelected({ value: value, label: label } as OptionType);
              setParamGet({ ...paramGet, LanguageId: value });
              setMenuRequestPublic({
                ...menuRequestPublic,
                languageId: value,
              } as MenuRequestPublic);
            }}
          >
            {languageOptions.map((l, index) => (
              <Option value={l.id} label={l?.name} key={index}>
                <Space>
                  {l.image && (
                    <Avatar
                      key={index}
                      src={
                        <img
                          src={`${url}/${l?.parentFolder}/${l?.image}`}
                          alt="image"
                        />
                      }
                    />
                  )}
                  <p>{l.name}</p>
                </Space>
              </Option>
            ))}
          </Select>
        </Header>
        <Content
          className="site-layout"
          style={{ padding: "0 30px", marginTop: "30px" }}
        >
          {/* {blogDataLoading && ( */}
          {/* )} */}

          <div
            className="min-h-screen"
            style={{
              padding: 24,
              background: colorBgContainer,
              marginTop: "60px",
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-16 lg:gap-x-32 gap-y-20 md:gap-y-32 mb-32">
              {blogData?.data.map((data) => (
                <BlogPreview
                  key={data.blogId}
                  languageId={languageSelected?.value}
                  title={data.title}
                  coverImage={`${url}/${data.imgUrl}`}
                  date={data.dateCreated}
                  // author={node.author}
                  slug={data.blogId}
                  excerpt={data.description}
                />
              ))}
            </div>
            {blogData?.totalPage! > 0 && (
              <Pagination
                className="text-center mt-16"
                current={paramGet.PageIndex}
                pageSize={blogData?.pageSize ?? 10}
                total={blogData?.totalSize}
                onChange={(page, pageSize) => {
                  setParamGet({
                    ...paramGet,
                    PageIndex: page,
                    PageSize: pageSize,
                  });
                }}
              />
            )}
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          CMS ©2023 Created by Solocode
        </Footer>
      </Layout>
    </>
  );
};

export default View;

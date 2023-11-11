"use client";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Button, Drawer, FloatButton, Form, Input, Modal } from "antd";
import useDispatch from "@hooks/use-dispatch";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { Tabs } from "antd";
import type { TabsProps } from "antd";
import CategoryTranslationTable from "./CategoryTranslationTable";
import { getLanguages } from "@slices/language";
import { Language } from "@models/language";
import {
  CategoryTranslation,
  CategoryTranslationCreate,
  CategoryTranslationData,
  ParamGetCateTrans,
} from "@models/categoryTranslation";
import categoryTranslationService from "@services/categoryTranslation";
import categoryService from "@services/category";
import { CategoryCreate } from "@models/category";
import { AiFillDelete } from "react-icons/ai";
import { MdPostAdd } from "react-icons/md";
import ModalCreateEdit from "./ModalCreateEdit";
import moment from "moment";
import { dateAdvFormat } from "@utils/constants";
const { confirm } = Modal;

const onChange = (key: string) => {};

interface Props {
  categoryId: string;
  onRefreshCategory: () => void;
  onSubmitCategoryDetail: (data: CategoryCreate) => Promise<void>;
  setCategorySelected: (id: string | undefined) => void;
}

const DrawerCategory: React.FC<Props> = (props) => {
  const {
    categoryId,
    setCategorySelected,
    onSubmitCategoryDetail,
    onRefreshCategory,
  } = props;
  const dispatch = useDispatch();

  // handle tab 1 - category detail
  const [openModal, setOpenModal] = useState<boolean>(false);
  const formRef = useRef(null);
  const [form] = Form.useForm();

  const disabled = async () => {
    var result = false;
    try {
      await form.validateFields();
    } catch (errorInfo) {
      result = true;
    }
    return result;
  };
  const getDetail = async () => {
    if (categoryId && session) {
      await categoryService
        .getCategoryDetail(session?.user.accessToken!, categoryId)
        .then((res) => {
          if (formRef.current)
            form.setFieldsValue({
              name: res?.name,
              dateCreated: moment(res.dateCreated).format(dateAdvFormat),
            });
        });
    }
  };
  //end handle tab 1 - category detail

  // handle tab 2 - category translation
  const [cateTransData, setCateTransData] = useState<
    CategoryTranslationData | undefined
  >();
  const [categoryTranslation, setCategoryTranslation] = useState<
    CategoryTranslation | undefined
  >();
  const [languageOptions, setLanguageOptions] = useState<Language[]>([]);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [paramGet, setParamGet] = useState<ParamGetCateTrans>({
    PageIndex: 1,
    PageSize: 10,
  } as ParamGetCateTrans);
  const { data: session } = useSession();
  const onClose = () => {
    setCategorySelected(undefined);
    setParamGet({ PageIndex: 1, PageSize: 10 } as ParamGetCateTrans);
  };

  const getData = async () => {
    if (categoryId && session) {
      await categoryTranslationService
        .getCateTransByCategoryId(session?.user.accessToken!, {
          ...paramGet,
          categoryId: categoryId,
        })
        .then((res) => {
          setCateTransData(res);
        });
    }
  };

  const onSubmit = async (data: CategoryTranslationCreate) => {
    confirm({
      title: "Save",
      content: (
        <Alert
          message="Do you want to save?"
          description={`${data.name}`}
          type="warning"
        />
      ),
      async onOk() {
        setLoadingSubmit(true);
        if (data.id) {
          categoryTranslationService
            .updateCateTrans(session?.user.accessToken!, data)
            .then(() => {
              onRefresh();
              setLoadingSubmit(false);
              toast.success(`Update category translation successful`);
            })
            .catch((errors) => {
              toast.error(
                errors.response.data ?? "Update category translation failed"
              );
              setLoadingSubmit(false);
            });
        } else {
          await categoryTranslationService
            .createCateTrans(session?.user.accessToken!, data)
            .then(() => {
              onRefresh();
              setLoadingSubmit(false);
              toast.success(`Create category translation successful`);
            })
            .catch((errors) => {
              toast.error(
                errors.response.data ?? "Create category translation failed"
              );
              setLoadingSubmit(false);
            });
        }
      },
      onCancel() {},
    });
  };

  const onDelete = (data: CategoryTranslation) => {
    confirm({
      title: "Delete",
      content: (
        <Alert
          message="Do you want to delete this category translation?"
          description={`${data.name}`}
          type="warning"
        />
      ),
      async onOk() {
        setLoadingSubmit(true);
        await categoryTranslationService
          .deleteCateTrans(session?.user.accessToken!, data.id)
          .then(() => {
            onRefresh();
            toast.success(`Delete category translation successful`);
          })
          .catch((errors) => {
            toast.error(
              errors.response.data ?? "Delete category translation failed"
            );
            setLoadingSubmit(false);
          });
      },
      onCancel() {},
    });
  };

  const onDeleteCategoryDetail = () => {
    confirm({
      title: "Delete",
      content: (
        <Alert message="Do you want to delete this category?" type="warning" />
      ),
      async onOk() {
        setLoadingSubmit(true);
        await categoryService
          .deleteCategory(session?.user.accessToken!, categoryId)
          .then(() => {
            onRefreshCategory();
            setCategorySelected(undefined);
            toast.success(`Delete category translation successful`);
          })
          .catch((errors) => {
            toast.error(errors.response.data ?? "Delete category failed");
            setLoadingSubmit(false);
          });
      },
      onCancel() {},
    });
  };

  const onRefresh = () => {
    getData();
    setLoadingSubmit(false);
    setCategoryTranslation(undefined);
  };

  useEffect(() => {
    getData();
    getDetail();
    if (categoryId && session) {
      dispatch(getLanguages(session.user.accessToken)).then(({ payload }) => {
        var listLanguge = payload as Language[];
        setLanguageOptions(listLanguge);
      });
    }
  }, [categoryId, session, paramGet]);
  //end handle tab 2 category translation;

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: `Info`,
      children: (
        <div>
          <Form
            ref={formRef}
            form={form}
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 8 }}
            style={{ width: "100%" }}
            onFinish={async () => {
              if (!(await disabled()))
                confirm({
                  title: "Do you want to save?",
                  async onOk() {
                    onSubmitCategoryDetail({
                      name: form.getFieldValue("name"),
                      id: categoryId,
                    });
                  },
                  onCancel() {},
                });
            }}
          >
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: "Category not empty" }]}
            >
              <Input placeholder="Category name" allowClear />
            </Form.Item>
            <Form.Item name="dateCreated" label="Date created">
              <Input allowClear readOnly />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 5, span: 8 }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
          <ModalCreateEdit
            parentCategoryId={categoryId}
            open={openModal}
            setOpen={setOpenModal}
            onSubmit={async (data) =>
              await onSubmitCategoryDetail(data).then(() => {
                setOpenModal(false);
              })
            }
          />
          <FloatButton.Group
            trigger="click"
            type="primary"
            style={{ right: 24 }}
          >
            <FloatButton
              onClick={() => setOpenModal(true)}
              tooltip={<div>Create child category</div>}
              icon={<MdPostAdd />}
            />
            <FloatButton
              onClick={() => onDeleteCategoryDetail()}
              style={{ background: "red" }}
              tooltip={<div>Delete</div>}
              icon={<AiFillDelete />}
            />
          </FloatButton.Group>
        </div>
      ),
    },
    {
      key: "2",
      label: `Category Translation`,
      children: (
        <CategoryTranslationTable
          onSubmit={onSubmit}
          onDelete={onDelete}
          // loadingSubmit={loadingSubmit}
          categoryId={categoryId}
          paramGet={paramGet}
          setParamGet={setParamGet}
          languageOptions={languageOptions}
          data={cateTransData!}
          categoryTranslation={categoryTranslation!}
          setCategoryTranslation={setCategoryTranslation}
        ></CategoryTranslationTable>
      ),
    },
  ];

  return (
    <Drawer
      placement="right"
      closable={false}
      onClose={onClose}
      open={Boolean(categoryId)}
    >
      {/* <h1>{categoryDetail?.name}</h1> */}
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </Drawer>
  );
};

export default DrawerCategory;

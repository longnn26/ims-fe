import React, { useEffect, useRef } from "react";
import {
  Avatar,
  Button,
  Divider,
  Form,
  Input,
  Modal,
  Pagination,
  Select,
  Space,
  Table,
  Tooltip,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  CategoryTranslation,
  CategoryTranslationCreate,
  CategoryTranslationData,
  ParamGetCateTrans,
} from "@models/categoryTranslation";
import { FloatButton } from "antd";
import { MdPostAdd } from "react-icons/md";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { url } from "@utils/api-links";
import { Language } from "@models/language";
import { dateAdvFormat } from "@utils/constants";
import moment from "moment";
const { Option } = Select;

interface Props {
  categoryId: string;
  paramGet: ParamGetCateTrans;
  setParamGet: (data: ParamGetCateTrans) => void;
  data: CategoryTranslationData;
  languageOptions: Language[];
  onSubmit: (value: CategoryTranslationCreate) => void;
  onDelete: (data: CategoryTranslation) => void;
  // loadingSubmit: boolean;
  categoryTranslation: CategoryTranslation;
  setCategoryTranslation: (data: CategoryTranslation | undefined) => void;
}

interface DataType extends CategoryTranslation {
  key: React.Key;
}

const CategoryTranslationTable: React.FC<Props> = (props) => {
  const {
    categoryId,
    paramGet,
    setParamGet,
    data,
    languageOptions,
    onSubmit,
    onDelete,
    // loadingSubmit,
    categoryTranslation,
    setCategoryTranslation,
  } = props;
  const formRef = useRef(null);
  const [form] = Form.useForm();

  const columns: ColumnsType<DataType> = [
    {
      title: "Language",
      key: "language",
      render: (_, record) =>
        record?.language?.image && (
          <Avatar
            src={
              <img
                src={`${url}/${record?.language?.parentFolder}/${record?.language?.image}`}
                alt="image"
              />
            }
          />
        ),
    },
    {
      title: "Language Name",
      key: "language",
      dataIndex: "language",
      render: (_, { language }) => <>{language.name}</>,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Date created",
      dataIndex: "dateCreated",
      key: "dateCreated",
      render: (text) => <a>{text}</a>,
    },

    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space wrap>
          <Tooltip title="Edit" color={"black"}>
            <Button onClick={() => setCategoryTranslation(record)}>
              <BiEdit />
            </Button>
          </Tooltip>
          <Tooltip title="Delete" color={"black"}>
            <Button onClick={() => onDelete(record)}>
              <AiFillDelete />
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];
  const dataSource: DataType[] = [];
  for (let i = 0; i < data?.data?.length; ++i) {
    dataSource.push({
      key: data.data[i].id,
      id: data.data[i].id,
      name: data.data[i].name,
      description: data.data[i].description,
      dateCreated: moment(data.data[i].dateCreated).format(dateAdvFormat),
      dateUpdated: data.data[i].dateUpdated,
      language: data.data[i].language,
    });
  }

  const setFieldsValueInitial = () => {
    if (formRef.current)
      form.setFieldsValue({
        name: categoryTranslation?.name,
        description: categoryTranslation?.description,
        language: categoryTranslation?.language
          ? {
              value: categoryTranslation?.language.id,
              label: categoryTranslation?.language.name,
            }
          : undefined,
      });
  };

  const disabled = async () => {
    var result = false;
    try {
      await form.validateFields();
    } catch (errorInfo) {
      result = true;
    }
    return result;
  };

  const setCateTransValue = async () => {
    const cateTransCreate = {} as CategoryTranslationCreate;
    if (!(await disabled())) {
      if (categoryTranslation?.id) {
        cateTransCreate.id = categoryTranslation.id;
      } else {
        cateTransCreate.categoryId = categoryId;
      }
      Boolean(
        form.getFieldValue("language").value !==
          categoryTranslation?.language?.id
      ) && (cateTransCreate.languageId = form.getFieldValue("language").value);
      cateTransCreate.name = form.getFieldValue("name");
      cateTransCreate.description = form.getFieldValue("description");
    }
    return cateTransCreate;
  };

  const onCloseModal = () => {
    setCategoryTranslation(undefined);
    form.resetFields();
    return true;
  };

  useEffect(() => {
    setFieldsValueInitial();
  }, [categoryTranslation]);
  return (
    <>
      <Divider />
      <Table columns={columns} dataSource={dataSource} pagination={false} />
      {data?.totalPage > 0 && (
        <Pagination
          className="text-end m-4"
          current={paramGet.PageIndex}
          pageSize={data.pageSize ?? 10}
          total={data.totalSize}
          onChange={(page, pageSize) => {
            setParamGet({
              ...paramGet,
              PageIndex: page,
              PageSize: pageSize,
            });
          }}
        />
      )}
      <Modal
        title="Category Translation"
        open={Boolean(categoryTranslation)}
        onOk={async () => onSubmit(await setCateTransValue())}
        onCancel={() => onCloseModal()}
        // confirmLoading={loadingSubmit}
      >
        <Form
          ref={formRef}
          form={form}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ width: "100%" }}
        >
          <Form.Item
            name="language"
            label="Language"
            labelAlign="right"
            rules={[{ required: true, message: "Language not empty" }]}
          >
            <Select labelInValue allowClear style={{ width: "100%" }}>
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
                    {l.name}
                  </Space>
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Name not empty" }]}
          >
            <Input placeholder="Name" allowClear />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input placeholder="Description" allowClear />
          </Form.Item>
        </Form>
      </Modal>
      <FloatButton
        onClick={() => setCategoryTranslation({} as CategoryTranslation)}
        type="primary"
        icon={<MdPostAdd />}
      />
    </>
  );
};

export default CategoryTranslationTable;

"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Avatar,
  Badge,
  DatePicker,
  Drawer,
  Form,
  Modal,
  Select,
  Space,
} from "antd";
import {
  BlogTranslation,
  BlogTranslationCreate,
  BlogTranslationUpdate,
} from "@models/blogTranslation";
import { dateAdvFormat, optionAccess, optionStatus } from "@utils/constants";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { getLanguages } from "@slices/language";
import useDispatch from "@hooks/use-dispatch";
import { Language } from "@models/language";
import { MdPostAdd } from "react-icons/md";
import blogTranslationService from "@services/blogTranslation";
import { convertDatePicker } from "@utils/helpers";
import SunEditorCore from "suneditor/src/lib/core";
import TextEditorComponent from "@components/editorComponent/TextEditorComponent";
import { url } from "@utils/api-links";
const { confirm } = Modal;
const { Option } = Select;

interface Props {
  blogTranslation: BlogTranslation | undefined;
  setBlogTranslationEdit: (data: BlogTranslation | undefined) => void;
  onRefresh: () => void;
}

const DrawerBlogTranslation: React.FC<Props> = (props) => {
  const { data: session } = useSession();
  const formRef = useRef(null);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { blogTranslation, setBlogTranslationEdit, onRefresh } = props;
  const [languageOptions, setLanguageOptions] = useState<Language[]>([]);
  const titleEditor = useRef<SunEditorCore>();
  const descriptionEditor = useRef<SunEditorCore>();
  const contentEditor = useRef<SunEditorCore>();

  const onClose = () => {
    setBlogTranslationEdit(undefined);
    form.resetFields();
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

  const setFieldsValueInitial = () => {
    if (formRef.current)
      form.setFieldsValue({
        language: blogTranslation?.language
          ? {
              value: blogTranslation?.language?.id!,
              label: blogTranslation?.language?.name!,
            }
          : undefined,
        endPublishDate: !blogTranslation?.endPublishDate
          ? undefined
          : convertDatePicker(blogTranslation?.endPublishDate),
        startPublishDate: !blogTranslation?.startPublishDate
          ? undefined
          : convertDatePicker(blogTranslation?.startPublishDate),
        status: blogTranslation?.status
          ? {
              value: blogTranslation?.status,
              label: blogTranslation?.status,
            }
          : undefined,
        access: blogTranslation?.access
          ? {
              value: blogTranslation?.access,
              label: blogTranslation?.access,
            }
          : undefined,
      });

    // setRteContentObj(blogTranslation?.title!);
  };

  const dataUpdate = () => {
    var data = {} as BlogTranslationUpdate;
    data.id = blogTranslation?.id!;
    if (blogTranslation?.title !== titleEditor.current?.getContents(false)) {
      data.title = titleEditor.current?.getContents(false)!;
    }
    if (
      blogTranslation?.description !==
      descriptionEditor.current?.getContents(false)
    ) {
      data.description = descriptionEditor.current?.getContents(false)!;
    }
    if (
      blogTranslation?.content !== contentEditor.current?.getContents(false)
    ) {
      data.content = contentEditor.current?.getContents(false)!;
    }
    if (blogTranslation?.language.id !== form.getFieldValue("language").value) {
      data.languageId = form.getFieldValue("language").value;
    }
    data.startPublishDate = form
      .getFieldValue("startPublishDate")
      ?.format(dateAdvFormat);
    data.endPublishDate = form
      .getFieldValue("endPublishDate")
      ?.format(dateAdvFormat);
    if (blogTranslation?.status !== form.getFieldValue("status").value) {
      data.status = form.getFieldValue("status").value;
    }
    if (blogTranslation?.access !== form.getFieldValue("access").value) {
      data.access = form.getFieldValue("access").value;
    }
    return data;
  };

  const dataCreate = () => {
    var data = {} as BlogTranslationCreate;
    data.blogId = blogTranslation?.blogId!;
    data.title = titleEditor.current?.getContents(false)!;
    data.description = descriptionEditor.current?.getContents(false)!;
    data.content = contentEditor.current?.getContents(false)!;
    data.languageId = form.getFieldValue("language").value;
    data.startPublishDate = form
      .getFieldValue("startPublishDate")
      ?.format(dateAdvFormat);
    data.endPublishDate = form
      .getFieldValue("endPublishDate")
      ?.format(dateAdvFormat);
    data.status = form.getFieldValue("status").value;
    data.access = form.getFieldValue("access").value;
    return data;
  };

  const submit = async () => {
    if (!(await disabled()))
      confirm({
        content: <Alert message="Do you want to save?" type="warning" />,
        async onOk() {
          if (blogTranslation?.id) {
            await blogTranslationService
              .updateBlogTranslation(session?.user.accessToken!, dataUpdate())
              .then(() => {
                onRefresh();
                setBlogTranslationEdit(undefined);
                toast.success(`Update blog translation successful`);
              })
              .catch((errors) =>
                toast.error(
                  errors.response.data ?? "Update blog translation failed"
                )
              );
          } else {
            await blogTranslationService
              .createBlogTranslation(session?.user.accessToken!, dataCreate())
              .then(() => {
                onRefresh();
                setBlogTranslationEdit(undefined);
                toast.success(`Create blog translation successful`);
              })
              .catch((errors) =>
                toast.error(
                  errors.response.data ?? "Create blog translation failed"
                )
              );
          }
        },
        onCancel() {},
      });
  };

  useEffect(() => {
    if (session && blogTranslation) {
      titleEditor.current?.setContents(blogTranslation.title);
      descriptionEditor.current?.setContents(blogTranslation.description);
      contentEditor.current?.setContents(blogTranslation.content);
      setFieldsValueInitial();
      dispatch(getLanguages(session.user.accessToken)).then(({ payload }) => {
        var listLanguge = payload as Language[];
        setLanguageOptions(listLanguge);
      });
    }
  }, [blogTranslation]);

  return (
    <Drawer
      placement="right"
      closable={false}
      onClose={onClose}
      open={Boolean(blogTranslation)}
    >
      <div className="p-2 mb-4 bg-[#f8f9fa]/10 border border-gray-200 rounded-lg shadow-lg shadow-[#e7edf5]/50">
        <button type="submit" onClick={() => submit()} className="btn-submit">
          <div className="mr-2">
            <MdPostAdd />
          </div>
          Submit
        </button>
      </div>
      <Badge.Ribbon placement="start" text="Publishing" color="blue">
        <Form
          ref={formRef}
          form={form}
          className="shadow-lg shadow-[#e7edf5]/50 border border-gray-200 rounded-lg p-6 mb-4"
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
            <Select labelInValue allowClear style={{ width: "80%" }}>
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
            name="startPublishDate"
            label="Start Publishing"
            labelAlign="right"
          >
            <DatePicker
              style={{ width: "80%" }}
              placeholder="Start Publishing"
              showTime
              format={dateAdvFormat}
            />
          </Form.Item>
          <Form.Item
            name="endPublishDate"
            label="Finish Publishing"
            labelAlign="right"
          >
            <DatePicker
              style={{ width: "80%" }}
              placeholder="Finish Publishing"
              showTime
              format={dateAdvFormat}
            />
          </Form.Item>
          <Form.Item
            name="access"
            label="Access"
            labelAlign="right"
            rules={[{ required: true, message: "Access not empty" }]}
          >
            <Select
              labelInValue
              allowClear
              style={{ width: "80%" }}
              options={optionAccess}
            />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            labelAlign="right"
            rules={[{ required: true, message: "Status not empty" }]}
          >
            <Select
              labelInValue
              allowClear
              style={{ width: "80%" }}
              options={optionStatus}
            />
          </Form.Item>
        </Form>
      </Badge.Ribbon>
      <TextEditorComponent
        title="Title"
        editor={titleEditor}
        content={blogTranslation?.title!}
      />
      <TextEditorComponent
        title="Description"
        editor={descriptionEditor}
        content={blogTranslation?.description!}
      />
      <TextEditorComponent
        title="Content"
        editor={contentEditor}
        content={blogTranslation?.content!}
      />
    </Drawer>
  );
};

export default DrawerBlogTranslation;

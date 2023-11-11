import React, { useEffect, useState } from "react";
import { Button, Modal } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { Label, TextInput } from "flowbite-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import UploadComponent from "@components/uploadComponent/UploadComponent";
import { Blog, BlogCreateOrEdit } from "@models/blog";
const { confirm } = Modal;

interface Props {
  blog: Blog;
  loadingSubmit: boolean;
  setBlogEdit: (data: Blog | undefined) => void;
  onSubmit: (blog: BlogCreateOrEdit) => void;
}

const FormSchema = z.object({
  name: z.string(),
});

type FormSchemaType = z.infer<typeof FormSchema>;

const ModalCreateEdit: React.FC<Props> = (props) => {
  const { blog, setBlogEdit, onSubmit, loadingSubmit } = props;

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const {
    register,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
  });

  const handleCancel = () => {
    setValue("name", "");
    setFileList([]);
    setBlogEdit(undefined);
  };

  useEffect(() => {
    // refresh after submit for fileList
    !Boolean(blog) && setFileList([]);

    setValue("name", blog?.name);
    for (let i = 0; i < blog?.resources?.length; i++) {
      const resource = blog?.resources[i];
      const file = {
        uid: resource.id,
        name: resource.description,
        status: "done",
        url: `https://cmsapi.hisoft.vn/blog/${resource.id}${resource.extension}`,
      } as UploadFile;
      fileList.push(file);
      setFileList([...fileList]);
    }
  }, [blog]);

  return (
    <>
      <Modal
        title={<span className="inline-block m-auto">Blog</span>}
        open={Boolean(blog)}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        footer={[
          <Button
            loading={loadingSubmit}
            className="btn-submit"
            key="submit"
            onClick={() => {
              confirm({
                title: "Do you want to save?",
                async onOk() {
                  onSubmit({
                    id: blog.id,
                    name: getValues("name"),
                    fileList: fileList,
                    resources: blog.resources,
                  } as BlogCreateOrEdit);
                },
                onCancel() {},
              });
            }}
          >
            Submit
          </Button>,
        ]}
      >
        <div className="flex max-w-md flex-col gap-4 m-auto">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="name" value="Name" />
            </div>
            <TextInput
              color={errors.name?.message ? "failure" : ""}
              helperText={
                errors.name?.message && (
                  <span className="font-medium">{errors.name.message}</span>
                )
              }
              id="email1"
              placeholder="Blog name"
              type="email"
              {...register("name")}
            />
          </div>

          <UploadComponent
            fileList={fileList}
            setFileList={setFileList}
          ></UploadComponent>
        </div>
      </Modal>
    </>
  );
};

export default ModalCreateEdit;

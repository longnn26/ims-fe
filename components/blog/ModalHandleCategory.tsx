import React, { useEffect, useState } from "react";
import { Button, Modal, TreeSelect } from "antd";
import { useSession } from "next-auth/react";
import useSelector from "@hooks/use-selector";
import blogService from "@services/blog";
import { AssignCategory } from "@models/blog";
import { toast } from "react-toastify";
const { confirm } = Modal;

interface Props {
  blogId: string;
  setBlogId: (data: string | undefined) => void;
}

const ModalHandleCategory: React.FC<Props> = (props) => {
  const { data: session } = useSession();
  const { categoryOptionTreeSelect } = useSelector((state) => state.category);
  const { blogId, setBlogId } = props;
  const onCancel = () => {
    setBlogId(undefined);
  };
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const onChange = (newValue: string[]) => {
    setCategoryIds(newValue);
  };

  const assignCategory = () => {
    var data = { blogId: blogId, categoryIds: [] } as AssignCategory;
    categoryIds.forEach((v) => {
      data.categoryIds.push(v);
    });
    blogService
      .assignCategory(session?.user.accessToken!, data)
      .then((res) => {
        var list = [] as string[];
        res.forEach((bc) => {
          list.push(bc.category.id);
        });
        setCategoryIds([...list]);
        toast.success(`Assign category successful`);
      })
      .catch((errors) => {
        toast.error(errors.response.data);
      });
  };

  useEffect(() => {
    if (blogId && session) {
      blogService
        .getBlogCategory(session.user.accessToken, blogId)
        .then((res) => {
          var list = [] as string[];
          res.forEach((bc) => {
            list.push(bc.category.id);
          });
          setCategoryIds([...list]);
        });
    }
  }, [session, blogId]);
  return (
    <>
      <Modal
        title={<span className="inline-block m-auto">Category</span>}
        open={Boolean(blogId)}
        onCancel={onCancel}
        footer={[
          <Button
            className="btn-submit"
            key="submit"
            onClick={() => {
              confirm({
                title: "Do you want to save?",
                async onOk() {
                  assignCategory();
                },
                onCancel() {},
              });
            }}
          >
            Submit
          </Button>,
        ]}
      >
        <TreeSelect
          style={{ width: "100%" }}
          value={categoryIds}
          dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
          placeholder="Please select"
          allowClear
          multiple
          treeDefaultExpandAll
          onChange={onChange}
          treeData={categoryOptionTreeSelect}
        />
      </Modal>
    </>
  );
};

export default ModalHandleCategory;

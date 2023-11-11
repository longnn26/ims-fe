"use client";
import React, { useEffect, useState } from "react";
import { Tree } from "antd";
import type { DataNode } from "antd/es/tree";
import { Category } from "@models/category";

interface Props {
  categoryTree: Category[];
}
const TreeData: React.FC<Props> = (props) => {
  const { categoryTree } = props;
  const [treeData, setTreeData] = useState<DataNode[]>([]);

  const recursiveChildrensTree = (children: Category[]) => {
    var result = [] as DataNode[];
    children.forEach((c) => {
      result.push({
        id: c.id,
        title: c.name!,
        key: c.id,
        dateCreated: c.dateCreated,
        dataUpdated: c.dateUpdated,
        parentId: c.parentId,
        children: recursiveChildrensTree(c.children),
      });
    });
    return result;
  };

  useEffect(() => {
    var result = [] as DataNode[];
    categoryTree.forEach((c) => {
      result.push({
        id: c.id,
        title: c.name!,
        key: c.id,
        children: recursiveChildrensTree(c.children),
      });
    });
    setTreeData([...result]);
  }, []);
  return <Tree treeData={treeData} />;
};

export default TreeData;

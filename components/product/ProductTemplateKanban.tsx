/* eslint-disable jsx-a11y/alt-text */
"use client";

import useSelector from "@hooks/use-selector";
import {
  Badge,
  Button,
  Card,
  Col,
  message,
  Popconfirm,
  Row,
  Space,
  TableColumnsType,
  Image,
  Tooltip,
} from "antd";
import { Table } from "antd";
import { useRouter } from "next/router";
import { AiFillDelete } from "react-icons/ai";
import productTemplateServices from "@services/productTemplate";
import useDispatch from "@hooks/use-dispatch";
import { getProductTemplates } from "@slices/productTemplate";
import { ProductCategory } from "@models/productCategory";
import { UomUom } from "@models/uomUom";
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Avatar } from "antd";
import { PiTreeStructureFill } from "react-icons/pi";
import { FaBoxes } from "react-icons/fa";
import { imageNotFound } from "@utils/constants";
import { url } from "@utils/api-links";

const { Meta } = Card;

interface Props {
  accessToken: string;
}

interface DataType {
  key: React.Key;
  id: string;
  name: string;
  detailedType: string;
  tracking: string;
  description: string;
  active: boolean;
  productCategory: ProductCategory;
  uomUom: UomUom;
  totalVariant: number;
  qtyAvailable: number;
  imageUrl: string;
}

const ProductTemplateKanban: React.FC<Props> = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { accessToken } = props;
  const { data: productTemplateData, loading } = useSelector(
    (state) => state.productTemplate
  );
  const deleteProductTemplate = async (record: DataType) => {
    await productTemplateServices
      .deleteProductTemplate(accessToken, record.id)
      .then(() => {
        dispatch(
          getProductTemplates({
            token: accessToken,
          })
        );
      })
      .catch((error) => {
        message.error(error?.response?.data);
      });
  };
  const columns: TableColumnsType<DataType> = [
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Variants",
      align: "center",
      render: (record: DataType) => (
        <>
          <p className="font-bold">{record.totalVariant}</p>
        </>
      ),
    },
    {
      title: "On Hand",
      align: "center",
      render: (record: DataType) => (
        <>
          <p className="font-bold text-[#4a819e]">{record.qtyAvailable}</p>
        </>
      ),
    },
    {
      title: "Unit",
      align: "center",
      key: "uomUom",
      render: (record: DataType) => (
        <>
          <p>{record.uomUom.name}</p>
        </>
      ),
    },
    {
      title: "Product Category",
      align: "center",
      key: "productCategory",
      fixed: true,
      render: (record: DataType) => (
        <>
          <p>{record.productCategory.name}</p>
        </>
      ),
    },
    {
      key: "operation",
      width: "15%",
      render: (record: DataType) => (
        <Space wrap onClick={(e) => e.stopPropagation()}>
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => {
              deleteProductTemplate(record);
            }}
          >
            <AiFillDelete className="cursor-pointer" />
          </Popconfirm>
        </Space>
      ),
    },
  ];
  const data: DataType[] = [];
  for (let i = 0; i < productTemplateData?.length; ++i) {
    data.push({
      key: productTemplateData[i].id,
      id: productTemplateData[i].id,
      name: productTemplateData[i].name,
      detailedType: productTemplateData[i].detailedType,
      tracking: productTemplateData[i].tracking,
      description: productTemplateData[i].description,
      active: productTemplateData[i].active,
      productCategory: productTemplateData[i].productCategory,
      uomUom: productTemplateData[i].uomUom,
      totalVariant: productTemplateData[i].totalVariant,
      qtyAvailable: productTemplateData[i].qtyAvailable,
      imageUrl: productTemplateData[i].imageUrl,
    });
  }
  return (
    <>
      <div style={{ padding: "20px" }}>
        <Row gutter={[16, 16]}>
          {productTemplateData.map((pt, index) => (
            <Col key={index} xs={24} sm={12} md={8} lg={6}>
              <Card
                style={{
                  borderWidth: "3px",
                  borderRadius: "2px",
                }}
                onClick={() => {
                  router.push(`/products/${pt?.id}`);
                }}
                hoverable
                cover={
                  <Space onClick={(e) => e.stopPropagation()}>
                    <Image
                      src={`${
                        pt.imageUrl
                          ? `${url}/${pt.imageUrl}`
                          : `${imageNotFound}`
                      }`}
                    />
                  </Space>
                }
                actions={[
                  <Tooltip
                    key="variant"
                    title={`Product Variant: ${pt.totalVariant}`}
                  >
                    <Badge
                      overflowCount={999999}
                      count={pt.totalVariant}
                      offset={[10, 0]}
                      color="geekblue"
                    >
                      <PiTreeStructureFill key="variant" />
                    </Badge>
                  </Tooltip>,
                  <Tooltip
                    key="onhand"
                    title={`On Hand: ${pt.qtyAvailable} (${pt.uomUom.name})`}
                  >
                    <Badge
                      overflowCount={999999}
                      count={pt.qtyAvailable}
                      offset={[20, 0]}
                      color="#4a819e"
                    >
                      <FaBoxes key="variant" />
                    </Badge>
                  </Tooltip>,
                  <span key="unit">{pt.uomUom.name}</span>,
                ]}
              >
                <Tooltip placement="topLeft" title={pt.name}>
                  <Meta
                    title={pt.name}
                    // description={pt.name}
                  />
                </Tooltip>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
};

export default ProductTemplateKanban;

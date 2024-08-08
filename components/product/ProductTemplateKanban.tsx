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
                      src="error"
                      fallback="data:image/png;base64,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"
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

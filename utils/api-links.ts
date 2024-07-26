export const url = "https://khoserverapi.solocode.click";
export const urlNoti = "https://khoserverapi.solocode.click";
export const urlServerSide = "https://khoserverapi.solocode.click";

const apiLinks = {
  user: {
    login: `${urlServerSide}/api/User/Login`,
    seenCurrentNoticeCount: `${urlNoti}/api/User/SeenCurrentNoticeCount`,
    get: `${url}/api/User`,
    profile: `${url}/api/User/Profile`,
    update: `${url}/api/User/MyAccount`,
    changePassword: `${url}/api/User/ChangePassword`,
  },

  customer: {
    get: `${url}/api/Customer`,
    getProfile: `${url}/api/Customer/Profile`,
    create: `${url}/api/Customer`,
    update: `${url}/api/Customer`,
    delete: `${url}/api/Customer`,
    getServerAllocationById: `${url}/api/Customer`,
    login: `${urlServerSide}/api/Customer/Login`,
    changePassword: `${url}/api/Customer/ChangePassword`,
  },

  notification: {
    get: `${urlNoti}/api/Notification`,
    seenNotification: `${urlNoti}/api/Notification/SeenNotify`,
  },

  uomCategory: {
    get: `${url}/api/UomCategory`,
    getInfo: `${url}/api/UomCategory/Info`,
    getUomUom: `${url}/api/UomCategory/GetUomUom`,
    updateInfo: `${url}/api/UomCategory/Info`,
    create: `${url}/api/UomCategory`,
    delete: `${url}/api/UomCategory`,
  },

  uomUom: {
    updateInfo: `${url}/api/UomUom/Info`,
    updateFactor: `${url}/api/UomUom/Factor`,
    updateType: `${url}/api/UomUom/Type`,
    create: `${url}/api/UomUom`,
    delete: `${url}/api/UomUom`,
    getSelect: `${url}/api/UomUom/Select`,
  },

  productTemplate: {
    create: `${url}/api/ProductTemplate`,
    update: `${url}/api/ProductTemplate`,
    get: `${url}/api/ProductTemplate`,
    getAttributeLine: `${url}/api/ProductTemplate/AttributeLine`,
    delete: `${url}/api/ProductTemplate`,
    getInfo: `${url}/api/ProductTemplate/Info`,
    getProductVariant: `${url}/api/ProductTemplate/ProductVariant`,
    suggestProductVariant: `${url}/api/ProductTemplate/SuggestProductVariants`,
    createProductVariant: `${url}/api/ProductTemplate/ProductVariant`,
  },

  productCategory: {
    get: `${url}/api/ProductCategory`,
    getInfo: `${url}/api/ProductCategory/Info`,
    getSelectParent: `${url}/api/ProductCategory/SelectParent`,
    getSelect: `${url}/api/ProductCategory/Select`,
    update: `${url}/api/ProductCategory`,
    updateParent: `${url}/api/ProductCategory/Parent`,
    create: `${url}/api/ProductCategory`,
    delete: `${url}/api/ProductCategory`,
  },

  productRemoval: {
    getSelect: `${url}/api/ProductRemoval/Select`,
  },

  productAttribute: {
    get: `${url}/api/ProductAttribute`,
    getInfo: `${url}/api/ProductAttribute/Info`,
    getValues: `${url}/api/ProductAttribute/Value`,
    getSelect: `${url}/api/ProductAttribute/Select`,
    update: `${url}/api/ProductAttribute`,
    create: `${url}/api/ProductAttribute`,
    delete: `${url}/api/ProductAttribute`,
  },

  productAttributeValue: {
    create: `${url}/api/ProductAttributeValue`,
    update: `${url}/api/ProductAttributeValue`,
    delete: `${url}/api/ProductAttributeValue`,
  },

  productTemplateAttributeLine: {
    create: `${url}/api/ProductTemplateAttributeLine`,
    delete: `${url}/api/ProductTemplateAttributeLine`,
    updateValues: `${url}/api/ProductTemplateAttributeLine/AttributeValues`,
  },

  productProduct: {
    delete: `${url}/api/ProductProduct`,
  },

  stockWarehouse: {
    create: `${url}/api/StockWarehouse`,
    update: `${url}/api/StockWarehouse`,
    get: `${url}/api/StockWarehouse`,
    getInfo: `${url}/api/StockWarehouse/Info`,
    delete: `${url}/api/StockWarehouse`,
  },
};

export default apiLinks;

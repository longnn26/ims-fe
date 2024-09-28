import { DeleteFileModel, StockMovePaging } from "@models/stockMove";
import {
  StockPickingCreate,
  StockPickingDeliveryOrder,
  StockPickingDeliveryOrderUpdate,
  StockPickingInfo,
  StockPickingInternalTransfer,
  StockPickingInternalTransferUpdate,
  StockPickingPaging,
  StockPickingReceipt,
  StockPickingReceiptUpdate,
  StockPickingSearch,
} from "@models/stockPicking";
import apiLinks from "@utils/api-links";
import httpClient from "@utils/http-client";

const getStockPickingIncomings = async (
  token?: string,
  warehouseId?: string,
  pageIndex?: number,
  pageSize?: number,
  searchText?: string,
  locationName?: string,
  locationDestName?: string
): Promise<StockPickingPaging> => {
  const response = await httpClient.get({
    token: token,
    url: `${apiLinks.stockPicking.getIncoming}/${warehouseId}`,
    params: {
      pageIndex,
      pageSize,
      SortKey: "CreateDate",
      SortOrder: "DESC",
      SearchText: searchText,
      LocationName: locationName,
      LocationDestName: locationDestName,
    },
  });
  return response.data;
};

const getStockPickingInternals = async (
  token?: string,
  warehouseId?: string,
  pageIndex?: number,
  pageSize?: number,
  searchText?: string,
  locationName?: string,
  locationDestName?: string
): Promise<StockPickingPaging> => {
  const response = await httpClient.get({
    token: token,
    url: `${apiLinks.stockPicking.getInternal}/${warehouseId}`,
    params: {
      pageIndex,
      pageSize,
      SortKey: "CreateDate",
      SortOrder: "DESC",
      SearchText: searchText,
      LocationName: locationName,
      LocationDestName: locationDestName,
    },
  });
  return response.data;
};

const getStockPickingOutgoings = async (
  token?: string,
  warehouseId?: string,
  pageIndex?: number,
  pageSize?: number,
  searchText?: string,
  locationName?: string,
  locationDestName?: string
): Promise<StockPickingPaging> => {
  const response = await httpClient.get({
    token: token,
    url: `${apiLinks.stockPicking.getOutgoing}/${warehouseId}`,
    params: {
      pageIndex,
      pageSize,
      SortKey: "CreateDate",
      SortOrder: "DESC",
      SearchText: searchText,
      LocationName: locationName,
      LocationDestName: locationDestName,
    },
  });
  return response.data;
};

const createStockPicking = async (
  token?: string,
  data?: StockPickingCreate
): Promise<any> => {
  const response = await httpClient.post({
    token: token,
    url: `${apiLinks.stockPicking.create}`,
    data: data,
  });
  return response.data;
};

const deletetockPicking = async (token?: string, id?: string): Promise<any> => {
  const response = await httpClient.delete({
    token: token,
    url: `${apiLinks.stockPicking.delete}/${id}`,
  });
  return response.data;
};

const getStockPickingInfo = async (
  token?: string,
  id?: string
): Promise<StockPickingInfo> => {
  const response = await httpClient.get({
    token: token,
    url: `${apiLinks.stockPicking.getInfo}/${id}`,
  });
  return response.data;
};

const createStockPickingReceipt = async (
  token?: string,
  data?: StockPickingReceipt
): Promise<any> => {
  const response = await httpClient.post({
    token: token,
    url: `${apiLinks.stockPicking.createReceipt}`,
    data: data,
  });
  return response.data;
};

const updateStockPickingReceipt = async (
  token?: string,
  data?: StockPickingReceiptUpdate
): Promise<any> => {
  const response = await httpClient.put({
    token: token,
    url: `${apiLinks.stockPicking.updateReceipt}`,
    data: data,
  });
  return response.data;
};

const createStockPickingDeliveryOrder = async (
  token?: string,
  data?: StockPickingDeliveryOrder
): Promise<any> => {
  const response = await httpClient.post({
    token: token,
    url: `${apiLinks.stockPicking.createDeliveryOrder}`,
    data: data,
  });
  return response.data;
};

const updateStockPickingDeliveryOrder = async (
  token?: string,
  data?: StockPickingDeliveryOrderUpdate
): Promise<any> => {
  const response = await httpClient.put({
    token: token,
    url: `${apiLinks.stockPicking.updateDeliveryOrder}`,
    data: data,
  });
  return response.data;
};

const createStockPickingInternalTransfer = async (
  token?: string,
  data?: StockPickingInternalTransfer
): Promise<any> => {
  const response = await httpClient.post({
    token: token,
    url: `${apiLinks.stockPicking.createInternalTransfer}`,
    data: data,
  });
  return response.data;
};

const updateStockPickingInternalTransfer = async (
  token?: string,
  data?: StockPickingInternalTransferUpdate
): Promise<any> => {
  const response = await httpClient.put({
    token: token,
    url: `${apiLinks.stockPicking.updateInternalTransfer}`,
    data: data,
  });
  return response.data;
};

const getStockMoves = async (
  token?: string,
  id?: string,
  pageIndex?: number,
  pageSize?: number
): Promise<StockMovePaging> => {
  const response = await httpClient.get({
    token: token,
    url: `${apiLinks.stockPicking.getStockMove}/${id}`,
    params: { pageIndex, pageSize, SortKey: "CreateDate", SortOrder: "DESC" },
  });
  return response.data;
};

const makeAsTodo = async (
  token?: string,
  id?: string
): Promise<StockMovePaging> => {
  const response = await httpClient.put({
    token: token,
    url: `${apiLinks.stockPicking.makeAsTodo}/${id}`,
  });
  return response.data;
};

const cancel = async (
  token?: string,
  id?: string
): Promise<StockMovePaging> => {
  const response = await httpClient.put({
    token: token,
    url: `${apiLinks.stockPicking.cancel}/${id}`,
  });
  return response.data;
};

const validate = async (
  token?: string,
  id?: string
): Promise<StockMovePaging> => {
  const response = await httpClient.put({
    token: token,
    url: `${apiLinks.stockPicking.validate}/${id}`,
  });
  return response.data;
};

const validateDeliveryOrder = async (
  token?: string,
  id?: string
): Promise<StockMovePaging> => {
  const response = await httpClient.put({
    token: token,
    url: `${apiLinks.stockPicking.validateDeliveryOrder}/${id}`,
  });
  return response.data;
};

const validateInternalTransfer = async (
  token?: string,
  id?: string
): Promise<StockMovePaging> => {
  const response = await httpClient.put({
    token: token,
    url: `${apiLinks.stockPicking.validateInternalTransfer}/${id}`,
  });
  return response.data;
};

const uploadFile = async (
  token: string,
  id: string,
  data: FormData
): Promise<any> => {
  const response = await httpClient.put({
    contentType: "multipart/form-data",
    url: `${apiLinks.stockPicking.uploadFile}/${id}`,
    token: token,
    data: data,
  });
  return response.data;
};

const deleteFile = async (
  token?: string,
  data?: DeleteFileModel
): Promise<any> => {
  const response = await httpClient.delete({
    token: token,
    url: `${apiLinks.stockPicking.deleteFile}`,
    data: data,
  });
  return response.data;
};
const stockPicking = {
  getStockPickingIncomings,
  getStockPickingInternals,
  getStockPickingOutgoings,
  createStockPicking,
  createStockPickingReceipt,
  deletetockPicking,
  getStockPickingInfo,
  updateStockPickingReceipt,
  getStockMoves,
  makeAsTodo,
  cancel,
  validate,
  createStockPickingDeliveryOrder,
  updateStockPickingDeliveryOrder,
  validateDeliveryOrder,
  createStockPickingInternalTransfer,
  updateStockPickingInternalTransfer,
  validateInternalTransfer,
  deleteFile,
  uploadFile
};

export default stockPicking;

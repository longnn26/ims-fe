import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import stockWarehouseService from "@services/stockWarehouse";
import {
  StockWarehouse,
  StockWarehouseInfo,
  StockWarehousePaging,
} from "@models/stockWarehouse";
import { AppState } from "@store/index";

interface State {
  paging: StockWarehousePaging;
  data: StockWarehouseInfo[];
  pageIndex: number;
  pageSize: number;
  totalPage: number;
  loading: boolean;
}

const initialState: State = {
  paging: {} as StockWarehousePaging,
  data: [],
  pageIndex: 1,
  pageSize: 10,
  totalPage: 0,
  loading: false,
};

const TYPE_PREFIX = "stockWarehouse";

const getStockWarehouses = createAsyncThunk(
  `${TYPE_PREFIX}/get`,
  async (arg: { token: string }, { getState }) => {
    const state = getState() as AppState;
    const result = await stockWarehouseService.getStockWarehouses(
      arg.token,
      state.stockWarehouse.pageIndex,
      state.stockWarehouse.pageSize
    );
    return result;
  }
);

const slice = createSlice({
  name: "stockWarehouse",
  initialState,
  reducers: {
    setPageIndex: (state, action) => {
      state.pageIndex = action.payload;
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getStockWarehouses.pending, (state) => ({
      ...state,
      loading: true,
    }));
    builder.addCase(getStockWarehouses.fulfilled, (state, { payload }) => ({
      ...state,
      data: payload.data,
      pageIndex: payload.pageIndex,
      pageSize: payload.pageSize,
      totalPage: payload.totalPage,
      loading: false,
    }));
    builder.addCase(getStockWarehouses.rejected, (state) => ({
      ...state,
      loading: false,
    }));
  },
});

export { getStockWarehouses };
export const { setPageIndex, setPageSize } = slice.actions;

export default slice.reducer;

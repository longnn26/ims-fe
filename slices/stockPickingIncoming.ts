import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import stockPickingService from "@services/stockPicking";
import {
  StockPickingInfo,
  StockPickingPaging,
  StockPickingSearch,
} from "@models/stockPicking";
import { AppState } from "@store/index";

interface State {
  paging: StockPickingPaging;
  data: StockPickingInfo[];
  pageIndex: number;
  pageSize: number;
  totalPage: number;
  totalSize: number;
  searchText: string;
  locationName?: string;
  locationDestName?: string;
  loading: boolean;
}

const initialState: State = {
  paging: {} as StockPickingPaging,
  data: [],
  pageIndex: 1,
  pageSize: 10,
  totalPage: 0,
  totalSize: 10,
  searchText: "",
  locationName: "",
  locationDestName: "",
  loading: false,
};

const TYPE_PREFIX = "stockPickingIncoming";

const getStockPickingIncomings = createAsyncThunk(
  `${TYPE_PREFIX}/get`,
  async (arg: { token: string; warehouseId: string }, { getState }) => {
    const state = getState() as AppState;
    let result = await stockPickingService.getStockPickingIncomings(
      arg.token,
      arg.warehouseId,
      state.stockPickingIncoming.pageIndex,
      state.stockPickingIncoming.pageSize,
      state.stockPickingIncoming.searchText,
      state.stockPickingIncoming.locationName,
      state.stockPickingIncoming.locationDestName
    );
    if (result.pageIndex > result.totalPage) {
      result = await stockPickingService.getStockPickingIncomings(
        arg.token,
        arg.warehouseId,
        1,
        state.stockPickingIncoming.pageSize,
        state.stockPickingIncoming.searchText,
        state.stockPickingIncoming.locationName,
        state.stockPickingIncoming.locationDestName
      );
    }
    return result;
  }
);

const slice = createSlice({
  name: "stockPickingIncoming",
  initialState,
  reducers: {
    setPageIndex: (state, action) => {
      state.pageIndex = action.payload;
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
    },
    setSearchText: (state, action) => {
      state.searchText = action.payload;
    },
    setLocationName: (state, action) => {
      state.locationName = action.payload;
    },
    setLocationDestName: (state, action) => {
      state.locationDestName = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getStockPickingIncomings.pending, (state) => ({
      ...state,
      loading: true,
    }));
    builder.addCase(
      getStockPickingIncomings.fulfilled,
      (state, { payload }) => ({
        ...state,
        data: payload.data,
        pageIndex: payload.pageIndex,
        pageSize: payload.pageSize,
        totalPage: payload.totalPage,
        totalSize: payload.totalSize,
        loading: false,
      })
    );
    builder.addCase(getStockPickingIncomings.rejected, (state) => ({
      ...state,
      loading: false,
    }));
  },
});

export { getStockPickingIncomings };
export const {
  setPageIndex,
  setPageSize,
  setSearchText,
  setLocationName,
  setLocationDestName,
} = slice.actions;

export default slice.reducer;

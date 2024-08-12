import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import stockPickingService from "@services/stockPicking";
import { StockPickingInfo, StockPickingPaging } from "@models/stockPicking";
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

const TYPE_PREFIX = "stockPickingInternal";

const getStockPickingInternals = createAsyncThunk(
  `${TYPE_PREFIX}/get`,
  async (arg: { token: string; warehouseId: string }, { getState }) => {
    const state = getState() as AppState;
    let result = await stockPickingService.getStockPickingInternals(
      arg.token,
      arg.warehouseId,
      state.stockPickingInternal.pageIndex,
      state.stockPickingInternal.pageSize,
      state.stockPickingInternal.searchText,
      state.stockPickingInternal.locationName,
      state.stockPickingInternal.locationDestName
    );
    if (result.pageIndex > result.totalPage) {
      result = await stockPickingService.getStockPickingInternals(
        arg.token,
        arg.warehouseId,
        1,
        state.stockPickingInternal.pageSize,
        state.stockPickingInternal.searchText,
        state.stockPickingInternal.locationName,
        state.stockPickingInternal.locationDestName
      );
    }
    return result;
  }
);

const slice = createSlice({
  name: "stockPickingInternal",
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
    builder.addCase(getStockPickingInternals.pending, (state) => ({
      ...state,
      loading: true,
    }));
    builder.addCase(
      getStockPickingInternals.fulfilled,
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
    builder.addCase(getStockPickingInternals.rejected, (state) => ({
      ...state,
      loading: false,
    }));
  },
});

export { getStockPickingInternals };
export const { setPageIndex, setPageSize, setSearchText, setLocationName, setLocationDestName } = slice.actions;

export default slice.reducer;

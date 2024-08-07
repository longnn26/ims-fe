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
      state.stockPickingIncoming.searchText
    );
    if (result.pageIndex > result.totalPage) {
      result = await stockPickingService.getStockPickingIncomings(
        arg.token,
        arg.warehouseId,
        1,
        state.stockPickingIncoming.pageSize,
        state.stockPickingIncoming.searchText
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
export const { setPageIndex, setPageSize, setSearchText } = slice.actions;

export default slice.reducer;

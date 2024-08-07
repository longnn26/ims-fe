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

const TYPE_PREFIX = "stockPickingOutgoing";

const getStockPickingOutgoings = createAsyncThunk(
  `${TYPE_PREFIX}/get`,
  async (arg: { token: string; warehouseId: string }, { getState }) => {
    const state = getState() as AppState;
    let result = await stockPickingService.getStockPickingOutgoings(
      arg.token,
      arg.warehouseId,
      state.stockPickingOutgoing.pageIndex,
      state.stockPickingOutgoing.pageSize,
      state.stockPickingOutgoing.searchText
    );
    if (result.pageIndex > result.totalPage) {
      result = await stockPickingService.getStockPickingOutgoings(
        arg.token,
        arg.warehouseId,
        1,
        state.stockPickingIncoming.pageSize,
        state.stockPickingOutgoing.searchText
      );
    }
    return result;
  }
);

const slice = createSlice({
  name: "stockPickingOutgoing",
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
    builder.addCase(getStockPickingOutgoings.pending, (state) => ({
      ...state,
      loading: true,
    }));
    builder.addCase(
      getStockPickingOutgoings.fulfilled,
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
    builder.addCase(getStockPickingOutgoings.rejected, (state) => ({
      ...state,
      loading: false,
    }));
  },
});

export { getStockPickingOutgoings };
export const { setPageIndex, setPageSize, setSearchText } = slice.actions;

export default slice.reducer;

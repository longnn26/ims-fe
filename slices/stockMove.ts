import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import stockPickingServices from "@services/stockPicking";
import { StockMoveInfo, StockMovePaging } from "@models/stockMove";
import { AppState } from "@store/index";

interface State {
  paging: StockMovePaging;
  data: StockMoveInfo[];
  pageIndex: number;
  pageSize: number;
  totalPage: number;
  totalSize: number;
  loading: boolean;
}

const initialState: State = {
  paging: {} as StockMovePaging,
  data: [],
  pageIndex: 1,
  pageSize: 10,
  totalPage: 0,
  totalSize: 10,
  loading: false,
};

const TYPE_PREFIX = "stockMove";

const getStockMoves = createAsyncThunk(
  `${TYPE_PREFIX}/get`,
  async (arg: { token: string; pickingId: string }, { getState }) => {
    const state = getState() as AppState;
    let result = await stockPickingServices.getStockMoves(
      arg.token,
      arg.pickingId,
      state.stockMove.pageIndex,
      state.stockMove.pageSize
    );
    if (result.pageIndex > result.totalPage) {
      result = await stockPickingServices.getStockMoves(
        arg.token,
        arg.pickingId,
        1,
        state.stockLocation.pageSize
      );
    }
    return result;
  }
);

const slice = createSlice({
  name: "stockMove",
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
    builder.addCase(getStockMoves.pending, (state) => ({
      ...state,
      loading: true,
    }));
    builder.addCase(getStockMoves.fulfilled, (state, { payload }) => ({
      ...state,
      data: payload.data,
      pageIndex: payload.pageIndex,
      pageSize: payload.pageSize,
      totalPage: payload.totalPage,
      totalSize: payload.totalSize,
      loading: false,
    }));
    builder.addCase(getStockMoves.rejected, (state) => ({
      ...state,
      loading: false,
    }));
  },
});

export { getStockMoves };
export const { setPageIndex, setPageSize } = slice.actions;

export default slice.reducer;

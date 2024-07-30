import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import stockQuantServices from "@services/stockQuant";
import { StockMoveLineInfo, StockMoveLinePaging } from "@models/stockMoveLine";
import { AppState } from "@store/index";

interface State {
  paging: StockMoveLinePaging;
  data: StockMoveLineInfo[];
  pageIndex: number;
  pageSize: number;
  totalPage: number;
  totalSize: number;
  loading: boolean;
}

const initialState: State = {
  paging: {} as StockMoveLinePaging,
  data: [],
  pageIndex: 1,
  pageSize: 10,
  totalPage: 0,
  totalSize: 10,
  loading: false,
};

const TYPE_PREFIX = "stockMovieLine";

const getStockMoveLines = createAsyncThunk(
  `${TYPE_PREFIX}/get`,
  async (arg: { token: string; quantId: string }, { getState }) => {
    const state = getState() as AppState;
    const result = await stockQuantServices.getMoveLines(
      arg.token,
      arg.quantId,
      state.stockMoveLine.pageIndex,
      state.stockMoveLine.pageSize
    );
    return result;
  }
);

const slice = createSlice({
  name: "stockMovieLine",
  initialState,
  reducers: {
    setPageIndex: (state, action) => {
      state.pageIndex = action.payload;
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
    },
    resetData: (state) => {
      state.data = [];
      state.paging = {} as StockMoveLinePaging;
      state.data = [];
      state.pageIndex = 1;
      state.pageSize = 10;
      state.totalPage = 0;
      state.totalSize = 0;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getStockMoveLines.pending, (state) => ({
      ...state,
      loading: true,
    }));
    builder.addCase(getStockMoveLines.fulfilled, (state, { payload }) => ({
      ...state,
      data: payload.data,
      pageIndex: payload.pageIndex,
      pageSize: payload.pageSize,
      totalPage: payload.totalPage,
      totalSize: payload.totalSize,
      loading: false,
    }));
    builder.addCase(getStockMoveLines.rejected, (state) => ({
      ...state,
      loading: false,
    }));
  },
});

export { getStockMoveLines };
export const { setPageIndex, setPageSize, resetData } = slice.actions;

export default slice.reducer;

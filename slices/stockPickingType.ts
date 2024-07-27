import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import stockPickingTypeService from "@services/stockPickingType";
import {
  StockPickingTypeInfo,
  StockPickingTypePaging,
} from "@models/stockPickingType";
import { AppState } from "@store/index";

interface State {
  paging: StockPickingTypePaging;
  data: StockPickingTypeInfo[];
  pageIndex: number;
  pageSize: number;
  totalPage: number;
  totalSize: number;
  loading: boolean;
}

const initialState: State = {
  paging: {} as StockPickingTypePaging,
  data: [],
  pageIndex: 1,
  pageSize: 10,
  totalPage: 0,
  totalSize: 10,
  loading: false,
};

const TYPE_PREFIX = "stockPickingType";

const getStockPickingTypes = createAsyncThunk(
  `${TYPE_PREFIX}/get`,
  async (arg: { token: string }, { getState }) => {
    const state = getState() as AppState;
    const result = await stockPickingTypeService.getStockPickingTypes(
      arg.token,
      state.stockPickingType.pageIndex,
      state.stockPickingType.pageSize
    );
    return result;
  }
);

const slice = createSlice({
  name: "stockPickingType",
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
      state.paging = {} as StockPickingTypePaging;
      state.data = [];
      state.pageIndex = 1;
      state.pageSize = 10;
      state.totalPage = 0;
      state.totalSize = 0;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getStockPickingTypes.pending, (state) => ({
      ...state,
      loading: true,
    }));
    builder.addCase(getStockPickingTypes.fulfilled, (state, { payload }) => ({
      ...state,
      data: payload.data,
      pageIndex: payload.pageIndex,
      pageSize: payload.pageSize,
      totalPage: payload.totalPage,
      totalSize: payload.totalSize,
      loading: false,
    }));
    builder.addCase(getStockPickingTypes.rejected, (state) => ({
      ...state,
      loading: false,
    }));
  },
});

export { getStockPickingTypes };
export const { setPageIndex, setPageSize, resetData } = slice.actions;

export default slice.reducer;

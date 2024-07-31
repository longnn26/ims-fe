import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import stockLocationService from "@services/stockLocation";
import {
  StockLocation,
  StockLocationInfo,
  StockLocationPaging,
} from "@models/stockLocation";
import { AppState } from "@store/index";

interface State {
  paging: StockLocationPaging;
  data: StockLocationInfo[];
  pageIndex: number;
  pageSize: number;
  totalPage: number;
  totalSize: number;
  loading: boolean;
}

const initialState: State = {
  paging: {} as StockLocationPaging,
  data: [],
  pageIndex: 1,
  pageSize: 10,
  totalPage: 0,
  totalSize: 10,
  loading: false,
};

const TYPE_PREFIX = "stockLocation";

const getStockLocations = createAsyncThunk(
  `${TYPE_PREFIX}/get`,
  async (arg: { token: string }, { getState }) => {
    const state = getState() as AppState;
    let result = await stockLocationService.getStockLocations(
      arg.token,
      state.stockLocation.pageIndex,
      state.stockLocation.pageSize
    );
    if (result.pageIndex > result.totalPage) {
      result = await stockLocationService.getStockLocations(
        arg.token,
        1,
        state.stockLocation.pageSize
      );
    }
    return result;
  }
);

const slice = createSlice({
  name: "stockLocation",
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
    builder.addCase(getStockLocations.pending, (state) => ({
      ...state,
      loading: true,
    }));
    builder.addCase(getStockLocations.fulfilled, (state, { payload }) => {
      return {
        ...state,
        data: payload.data,
        pageIndex: payload.pageIndex,
        pageSize: payload.pageSize,
        totalPage: payload.totalPage,
        totalSize: payload.totalSize,
        loading: false,
      };
    });
    builder.addCase(getStockLocations.rejected, (state) => ({
      ...state,
      loading: false,
    }));
  },
});

export { getStockLocations };
export const { setPageIndex, setPageSize } = slice.actions;

export default slice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import productAttributeService from "@services/productAttribute";
import {
  ProductAttribute,
  ProductAttributePaging,
} from "@models/productAttribute";
import { AppState } from "@store/index";

interface State {
  paging: ProductAttributePaging;
  data: ProductAttribute[];
  pageIndex: number;
  pageSize: number;
  totalPage: number;
  loading: boolean;
}

const initialState: State = {
  paging: {} as ProductAttributePaging,
  data: [],
  pageIndex: 1,
  pageSize: 10,
  totalPage: 0,
  loading: false,
};

const TYPE_PREFIX = "productAttribute";

const getProductAttributes = createAsyncThunk(
  `${TYPE_PREFIX}/get`,
  async (arg: { token: string }, { getState }) => {
    const state = getState() as AppState;
    const result = await productAttributeService.getProductAttributes(
      arg.token,
      state.productAttribute.pageIndex,
      state.productAttribute.pageSize
    );
    return result;
  }
);

const slice = createSlice({
  name: "productAttribute",
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
    builder.addCase(getProductAttributes.pending, (state) => ({
      ...state,
      loading: true,
    }));
    builder.addCase(getProductAttributes.fulfilled, (state, { payload }) => ({
      ...state,
      data: payload.data,
      pageIndex: payload.pageIndex,
      pageSize: payload.pageSize,
      totalPage: payload.totalPage,
      loading: false,
    }));
    builder.addCase(getProductAttributes.rejected, (state) => ({
      ...state,
      loading: false,
    }));
  },
});

export { getProductAttributes };
export const { setPageIndex, setPageSize } = slice.actions;

export default slice.reducer;

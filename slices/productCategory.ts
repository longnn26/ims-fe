import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import productCategoryService from "@services/productCategory";
import {
  ProductCategory,
  ProductCategoryPaging,
} from "@models/productCategory";
import { AppState } from "@store/index";

interface State {
  paging: ProductCategoryPaging;
  data: ProductCategory[];
  pageIndex: number;
  pageSize: number;
  totalPage: number;
  loading: boolean;
}

const initialState: State = {
  paging: {} as ProductCategoryPaging,
  data: [],
  pageIndex: 1,
  pageSize: 10,
  totalPage: 0,
  loading: false,
};

const TYPE_PREFIX = "productCategory";

const getProductCategories = createAsyncThunk(
  `${TYPE_PREFIX}/get`,
  async (arg: { token: string }, { getState }) => {
    const state = getState() as AppState;
    const result = await productCategoryService.getProductCategories(
      arg.token,
      state.productCategory.pageIndex,
      state.productCategory.pageSize
    );
    return result;
  }
);

const slice = createSlice({
  name: "productCategory",
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
    builder.addCase(getProductCategories.pending, (state) => ({
      ...state,
      loading: true,
    }));
    builder.addCase(getProductCategories.fulfilled, (state, { payload }) => ({
      ...state,
      data: payload.data,
      pageIndex: payload.pageIndex,
      pageSize: payload.pageSize,
      totalPage: payload.totalPage,
      loading: false,
    }));
    builder.addCase(getProductCategories.rejected, (state) => ({
      ...state,
      loading: false,
    }));
  },
});

export { getProductCategories };
export const { setPageIndex, setPageSize } = slice.actions;

export default slice.reducer;

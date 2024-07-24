import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import productTemplateService from "@services/productTemplate";
import {
  ProductProduct,
  ProductProductPaging,
} from "@models/productProduct";
import { AppState } from "@store/index";

interface State {
  paging: ProductProductPaging;
  data: ProductProduct[];
  pageIndex: number;
  pageSize: number;
  totalPage: number;
  loading: boolean;
}

const initialState: State = {
  paging: {} as ProductProductPaging,
  data: [],
  pageIndex: 1,
  pageSize: 10,
  totalPage: 0,
  loading: false,
};

const TYPE_PREFIX = "ProductProduct";

const getProductVariants = createAsyncThunk(
  `${TYPE_PREFIX}/get`,
  async (arg: { token: string; productTmplId: string }, { getState }) => {
    const state = getState() as AppState;
    const result =
      await productTemplateService.getProductVariants(
        arg.token,
        arg.productTmplId,
        state.productProduct.pageIndex,
        state.productProduct.pageSize
      );
    return result;
  }
);

const slice = createSlice({
  name: "productTemplateAttributeLine",
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
      state.paging = {} as ProductProductPaging;
      state.data = [];
      state.pageIndex = 1;
      state.pageSize = 10;
      state.totalPage = 0;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getProductVariants.pending, (state) => ({
      ...state,
      loading: true,
    }));
    builder.addCase(
      getProductVariants.fulfilled,
      (state, { payload }) => ({
        ...state,
        data: payload.data,
        pageIndex: payload.pageIndex,
        pageSize: payload.pageSize,
        totalPage: payload.totalPage,
        loading: false,
      })
    );
    builder.addCase(getProductVariants.rejected, (state) => ({
      ...state,
      loading: false,
    }));
  },
});

export { getProductVariants };
export const { setPageIndex, setPageSize, resetData } = slice.actions;

export default slice.reducer;

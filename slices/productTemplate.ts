import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import productTemplateService from "@services/productTemplate";
import {
  ProductTemplate,
  ProductTemplateInfo,
  ProductTemplatePaging,
} from "@models/productTemplate";
import { AppState } from "@store/index";

interface State {
  paging: ProductTemplatePaging;
  data: ProductTemplateInfo[];
  pageIndex: number;
  pageSize: number;
  totalPage: number;
  loading: boolean;
}

const initialState: State = {
  paging: {} as ProductTemplatePaging,
  data: [],
  pageIndex: 1,
  pageSize: 10,
  totalPage: 0,
  loading: false,
};

const TYPE_PREFIX = "productTemplate";

const getProductTemplates = createAsyncThunk(
  `${TYPE_PREFIX}/get`,
  async (arg: { token: string }, { getState }) => {
    const state = getState() as AppState;
    const result = await productTemplateService.getProductTemplates(
      arg.token,
      state.productTemplate.pageIndex,
      state.productTemplate.pageSize
    );
    return result;
  }
);

const slice = createSlice({
  name: "productTemplate",
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
    builder.addCase(getProductTemplates.pending, (state) => ({
      ...state,
      loading: true,
    }));
    builder.addCase(getProductTemplates.fulfilled, (state, { payload }) => ({
      ...state,
      data: payload.data,
      pageIndex: payload.pageIndex,
      pageSize: payload.pageSize,
      totalPage: payload.totalPage,
      loading: false,
    }));
    builder.addCase(getProductTemplates.rejected, (state) => ({
      ...state,
      loading: false,
    }));
  },
});

export { getProductTemplates };
export const { setPageIndex, setPageSize } = slice.actions;

export default slice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import productTemplateAttributeLineService from "@services/productTemplateAttributeLine";
import {
  ProductTemplateAttributeLineInfo,
  ProductTemplateAttributeLinePaging,
} from "@models/productTemplateAttributeLine";
import { AppState } from "@store/index";

interface State {
  paging: ProductTemplateAttributeLinePaging;
  data: ProductTemplateAttributeLineInfo[];
  pageIndex: number;
  pageSize: number;
  totalPage: number;
  loading: boolean;
}

const initialState: State = {
  paging: {} as ProductTemplateAttributeLinePaging,
  data: [],
  pageIndex: 1,
  pageSize: 10,
  totalPage: 0,
  loading: false,
};

const TYPE_PREFIX = "productTemplateAttributeLine";

const getProductTemplateAttributeLines = createAsyncThunk(
  `${TYPE_PREFIX}/get`,
  async (arg: { token: string; productTmplId: string }, { getState }) => {
    const state = getState() as AppState;
    const result =
      await productTemplateAttributeLineService.getProductTemplateAttributeLines(
        arg.token,
        arg.productTmplId,
        state.productTemplateAttributeLine.pageIndex,
        state.productTemplateAttributeLine.pageSize
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
      state.paging = {} as ProductTemplateAttributeLinePaging;
      state.data = [];
      state.pageIndex = 1;
      state.pageSize = 10;
      state.totalPage = 0;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getProductTemplateAttributeLines.pending, (state) => ({
      ...state,
      loading: true,
    }));
    builder.addCase(
      getProductTemplateAttributeLines.fulfilled,
      (state, { payload }) => ({
        ...state,
        data: payload.data,
        pageIndex: payload.pageIndex,
        pageSize: payload.pageSize,
        totalPage: payload.totalPage,
        loading: false,
      })
    );
    builder.addCase(getProductTemplateAttributeLines.rejected, (state) => ({
      ...state,
      loading: false,
    }));
  },
});

export { getProductTemplateAttributeLines };
export const { setPageIndex, setPageSize, resetData } = slice.actions;

export default slice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import productAttributeValueServices from "@services/productAttributeValue";
import { ProductAttributeValueInfo, ProductAttributeValuePaging } from "@models/productAttributeValue";
import { AppState } from "@store/index";

interface State {
  paging: ProductAttributeValuePaging;
  data: ProductAttributeValueInfo[];
  pageIndex: number;
  pageSize: number;
  totalPage: number;
  loading: boolean;
}

const initialState: State = {
  paging: {} as ProductAttributeValuePaging,
  data: [],
  pageIndex: 1,
  pageSize: 10,
  totalPage: 0,
  loading: false,
};

const TYPE_PREFIX = "productAttributeValue";

const getProductAttributeValues = createAsyncThunk(
  `${TYPE_PREFIX}/get`,
  async (arg: { token: string, attributeId: string }, { getState }) => {
    const state = getState() as AppState;
    const result = await productAttributeValueServices.getProductAttributeValues(
      arg.token,
      arg.attributeId,
      state.productAttributeValue.pageIndex,
      state.productAttributeValue.pageSize
    );
    return result;
  }
);

const slice = createSlice({
  name: "productAttributeValue",
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
    builder.addCase(getProductAttributeValues.pending, (state) => ({
      ...state,
      loading: true,
    }));
    builder.addCase(getProductAttributeValues.fulfilled, (state, { payload }) => ({
      ...state,
      data: payload.data,
      pageIndex: payload.pageIndex,
      pageSize: payload.pageSize,
      totalPage: payload.totalPage,
      loading: false,
    }));
    builder.addCase(getProductAttributeValues.rejected, (state) => ({
      ...state,
      loading: false,
    }));
  },
});

export { getProductAttributeValues };
export const { setPageIndex, setPageSize } = slice.actions;

export default slice.reducer;

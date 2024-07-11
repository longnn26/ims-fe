import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import uomCategoryService from "@services/uomCategory";
import { ParamGet } from "@models/base";
import { UomCategory } from "@models/uomCategory";
import { AppState } from "@store/index";

interface State {
  uomCategoryData: UomCategory[];
  pageIndex: number;
  pageSize: number;
  totalSize: number;
  loading: boolean;
}

const initialState: State = {
  uomCategoryData: [],
  pageIndex: 1,
  pageSize: 10,
  totalSize: 30,
  loading: false,
};

const TYPE_PREFIX = "uomCategory";

const getUomCategories = createAsyncThunk(
  `${TYPE_PREFIX}/get`,
  async (arg: { token: string }, { getState }) => {
    const state = getState() as AppState;
    const result = await uomCategoryService.getUomCategories(
      arg.token,
      state.uomCategory.pageIndex,
      state.uomCategory.pageSize
    );
    return result;
  }
);

const slice = createSlice({
  name: "uomCategory",
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
    builder.addCase(getUomCategories.pending, (state) => ({
      ...state,
      loading: true,
    }));
    builder.addCase(getUomCategories.fulfilled, (state, { payload }) => ({
      ...state,
      uomCategoryData: payload,
      loading: false,
    }));
    builder.addCase(getUomCategories.rejected, (state) => ({
      ...state,
      loading: false,
    }));
  },
});

export { getUomCategories };
export const { setPageIndex, setPageSize } = slice.actions;

export default slice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import categoryService from "@services/category";
import { ParamGet } from "@models/base";
import { Category } from "@models/category";
import { DefaultOptionType } from "antd/es/select";

interface State {
  categoryTree: Category[];
  categoryOptionTreeSelect: DefaultOptionType[];
  categoryTreeLoading: boolean;
}

const initialState: State = {
  categoryTree: [],
  categoryOptionTreeSelect: [],
  categoryTreeLoading: false,
};

const TYPE_PREFIX = "category";

const getCategoryTree = createAsyncThunk(
  `${TYPE_PREFIX}/getCategoryTree`,
  async (arg: { token: string; paramGet?: ParamGet }) => {
    const result = await categoryService.getCategoryTree(arg.token);
    return result;
  }
);

const slice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setCategoryOptionTreesSelect: (state, action) => {
      state.categoryOptionTreeSelect = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCategoryTree.pending, (state) => ({
      ...state,
      categoryTreeLoading: true,
    }));
    builder.addCase(getCategoryTree.fulfilled, (state, { payload }) => ({
      ...state,
      categoryTree: payload,
      categoryTreeLoading: false,
    }));
    builder.addCase(getCategoryTree.rejected, (state) => ({
      ...state,
      categoryTreeLoading: false,
    }));
  },
});

export { getCategoryTree };
export const { setCategoryOptionTreesSelect } = slice.actions;

export default slice.reducer;

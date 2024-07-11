import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import uomCategoryService from "@services/uomCategory";
import { ParamGet } from "@models/base";
import { UomCategory } from "@models/uomCategory";

interface State {
  uomCategoryData: UomCategory[];
  loading: boolean;
}

const initialState: State = {
  uomCategoryData: [],
  loading: false
};

const TYPE_PREFIX = "uomCategory";

const getUomCategories = createAsyncThunk(
  `${TYPE_PREFIX}/get`,
  async (arg: { token: string; paramGet?: ParamGet }) => {
    const result = await uomCategoryService.getUomCategories(
      arg.token,
      arg.paramGet
    );
    return result;
  }
);

const slice = createSlice({
  name: "uomCategory",
  initialState,
  reducers: {},
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

export default slice.reducer;

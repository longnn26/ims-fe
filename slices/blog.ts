import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import blogService from "@services/blog";
import { BlogData } from "@models/blog";
import { ParamGet } from "@models/base";

interface State {
  blogData: BlogData;
  blogDataLoading: boolean;
}

const initialState: State = {
  blogData: {} as BlogData,
  blogDataLoading: false,
};

const TYPE_PREFIX = "blog";

const getBlogData = createAsyncThunk(
  `${TYPE_PREFIX}/getBlogData`,
  async (arg: { token: string; paramGet: ParamGet }) => {
    const result = await blogService.getBlogData(arg.token, arg.paramGet);
    return result;
  }
);

const slice = createSlice({
  name: "blog",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getBlogData.pending, (state) => ({
      ...state,
      blogDataLoading: true,
    }));
    builder.addCase(getBlogData.fulfilled, (state, { payload }) => ({
      ...state,
      blogData: payload,
      blogDataLoading: false,
    }));
    builder.addCase(getBlogData.rejected, (state) => ({
      ...state,
      blogDataLoading: false,
    }));
  },
});

export { getBlogData };

export default slice.reducer;

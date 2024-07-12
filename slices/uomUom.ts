import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import uomUomServices from "@services/uomUom";
import { UomUomInfo, UomUomPaging } from "@models/uomUom";
import { AppState } from "@store/index";

interface State {
  paging: UomUomPaging;
  data: UomUomInfo[];
  pageIndex: number;
  pageSize: number;
  totalPage: number;
  loading: boolean;
}

const initialState: State = {
  paging: {} as UomUomPaging,
  data: [],
  pageIndex: 1,
  pageSize: 10,
  totalPage: 0,
  loading: false,
};

const TYPE_PREFIX = "uomUom";

const getUomUoms = createAsyncThunk(
  `${TYPE_PREFIX}/get`,
  async (arg: { token: string, uomCategoryId: string }, { getState }) => {
    const state = getState() as AppState;
    const result = await uomUomServices.getUomUoms(
      arg.token,
      arg.uomCategoryId,
      state.uomUom.pageIndex,
      state.uomUom.pageSize
    );
    return result;
  }
);

const slice = createSlice({
  name: "uomUom",
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
    builder.addCase(getUomUoms.pending, (state) => ({
      ...state,
      loading: true,
    }));
    builder.addCase(getUomUoms.fulfilled, (state, { payload }) => ({
      ...state,
      data: payload.data,
      pageIndex: payload.pageIndex,
      pageSize: payload.pageSize,
      totalPage: payload.totalPage,
      loading: false,
    }));
    builder.addCase(getUomUoms.rejected, (state) => ({
      ...state,
      loading: false,
    }));
  },
});

export { getUomUoms };
export const { setPageIndex, setPageSize } = slice.actions;

export default slice.reducer;

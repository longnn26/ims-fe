import { ParamGet } from "@models/base";
import { RequestExpandData } from "@models/requestExpand";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import requestExpand from "@services/requestExpand";

interface State {
  requestExpandData: RequestExpandData;
  requestExpandDataLoading: boolean;
}

const initialState: State = {
  requestExpandData: {} as RequestExpandData,
  requestExpandDataLoading: false,
};

const TYPE_PREFIX = "requestExpand";

const getRequestExpandData = createAsyncThunk(
  `${TYPE_PREFIX}/getRequestExpandData`,
  async (arg: { token: string; paramGet: ParamGet; id: number }) => {
    const result = await requestExpand.getData(arg.token, arg.paramGet, arg.id);
    return result;
  }
);

const slice = createSlice({
  name: "requestExpand",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getRequestExpandData.pending, (state) => ({
      ...state,
      requestExpandDataLoading: true,
    }));
    builder.addCase(getRequestExpandData.fulfilled, (state, { payload }) => ({
      ...state,
      requestExpandData: payload,
      requestExpandDataLoading: false,
    }));
    builder.addCase(getRequestExpandData.rejected, (state) => ({
      ...state,
      requestExpandDataLoading: false,
    }));
  },
});

export { getRequestExpandData };

export default slice.reducer;

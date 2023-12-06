import { ParamGet } from "@models/base";
import { RequestHostData } from "@models/requestHost";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import requestHost from "@services/requestHost";

interface State {
  requestHostData: RequestHostData;
  requestHostDataLoading: boolean;
}

const initialState: State = {
  requestHostData: {} as RequestHostData,
  requestHostDataLoading: false,
};

const TYPE_PREFIX = "requestHost";

const getRequestHostData = createAsyncThunk(
  `${TYPE_PREFIX}/getRequestHostData`,
  async (arg: { token: string; paramGet: ParamGet; id: number }) => {
    const result = await requestHost.getData(arg.token, arg.paramGet, arg.id);
    return result;
  }
);

const slice = createSlice({
  name: "requestHost",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getRequestHostData.pending, (state) => ({
      ...state,
      requestHostDataLoading: true,
    }));
    builder.addCase(getRequestHostData.fulfilled, (state, { payload }) => ({
      ...state,
      requestHostData: payload,
      requestHostDataLoading: false,
    }));
    builder.addCase(getRequestHostData.rejected, (state) => ({
      ...state,
      requestHostDataLoading: false,
    }));
  },
});

export { getRequestHostData };

export default slice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import serverAllocationService from "@services/serverAllocation";
import { ParamGet } from "@models/base";
import { ServerAllocationData } from "@models/serverAllocation";

interface State {
  serverAllocationData: ServerAllocationData;
  serverAllocationDataLoading: boolean;
}

const initialState: State = {
  serverAllocationData: {} as ServerAllocationData,
  serverAllocationDataLoading: false,
};

const TYPE_PREFIX = "serverAllocation";

const getServerAllocationData = createAsyncThunk(
  `${TYPE_PREFIX}/getData`,
  async (arg: { token: string; paramGet: ParamGet }) => {
    const result = await serverAllocationService.getServerAllocationData(
      arg.token,
      arg.paramGet
    );
    return result;
  }
);

const slice = createSlice({
  name: "serverAllocation",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getServerAllocationData.pending, (state) => ({
      ...state,
      serverAllocationDataLoading: true,
    }));
    builder.addCase(
      getServerAllocationData.fulfilled,
      (state, { payload }) => ({
        ...state,
        serverAllocationData: payload,
        serverAllocationDataLoading: false,
      })
    );
    builder.addCase(getServerAllocationData.rejected, (state) => ({
      ...state,
      serverAllocationDataLoading: false,
    }));
  },
});

export { getServerAllocationData };

export default slice.reducer;

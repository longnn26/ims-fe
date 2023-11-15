import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import requestUpgradeService from "@services/requestUpgrade";
import { ParamGet } from "@models/base";
import { RequestUpgradeData } from "@models/requestUpgrade";

interface State {
  requestUpgradeData: RequestUpgradeData;
  requestUpgradeDataLoading: boolean;
}

const initialState: State = {
  requestUpgradeData: {} as RequestUpgradeData,
  requestUpgradeDataLoading: false,
};

const TYPE_PREFIX = "requestUpgrade";

const getRequestUpgradeData = createAsyncThunk(
  `${TYPE_PREFIX}/getData`,
  async (arg: { token: string; paramGet: ParamGet }) => {
    const result = await requestUpgradeService.getData(arg.token, arg.paramGet);
    return result;
  }
);

const slice = createSlice({
  name: "serverHardwareConfig",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getRequestUpgradeData.pending, (state) => ({
      ...state,
      requestUpgradeDataLoading: true,
    }));
    builder.addCase(getRequestUpgradeData.fulfilled, (state, { payload }) => ({
      ...state,
      requestUpgradeData: payload,
      requestUpgradeDataLoading: false,
    }));
    builder.addCase(getRequestUpgradeData.rejected, (state) => ({
      ...state,
      requestUpgradeDataLoading: false,
    }));
  },
});

export { getRequestUpgradeData };

export default slice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import serverHardwareConfigService from "@services/serverHardwareConfig";
import { ParamGet } from "@models/base";
import { ServerHardwareConfigData } from "@models/serverHardwareConfig";

interface State {
  serverHardwareConfigData: ServerHardwareConfigData;
  serverHardwareConfigDataLoading: boolean;
}

const initialState: State = {
  serverHardwareConfigData: {} as ServerHardwareConfigData,
  serverHardwareConfigDataLoading: false,
};

const TYPE_PREFIX = "serverHardwareConfig";

const getserverHardwareConfigData = createAsyncThunk(
  `${TYPE_PREFIX}/getData`,
  async (arg: { token: string; paramGet: ParamGet }) => {
    const result =
      await serverHardwareConfigService.getServerHardwareConfigData(
        arg.token,
        arg.paramGet
      );
    return result;
  }
);

const slice = createSlice({
  name: "serverHardwareConfig",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getserverHardwareConfigData.pending, (state) => ({
      ...state,
      serverHardwareConfigDataLoading: true,
    }));
    builder.addCase(
      getserverHardwareConfigData.fulfilled,
      (state, { payload }) => ({
        ...state,
        serverHardwareConfigData: payload,
        serverHardwareConfigDataLoading: false,
      })
    );
    builder.addCase(getserverHardwareConfigData.rejected, (state) => ({
      ...state,
      serverHardwareConfigDataLoading: false,
    }));
  },
});

export { getserverHardwareConfigData };

export default slice.reducer;

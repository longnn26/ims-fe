import { ParamGet } from "@models/base";
import { IpAddressData } from "@models/ipAddress";
import { RUIpAdressParamGet, RequestHostData } from "@models/requestHost";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import requestHost from "@services/requestHost";

interface State {
  requestHostData: RequestHostData;
  ipAdressData: IpAddressData;
  requestHostDataLoading: boolean;
  ipAdressDataLoading: boolean;
}

const initialState: State = {
  requestHostData: {} as RequestHostData,
  requestHostDataLoading: false,
  ipAdressData: {} as IpAddressData,
  ipAdressDataLoading: false,
};

const TYPE_PREFIX = "requestHost";

const getRequestHostData = createAsyncThunk(
  `${TYPE_PREFIX}/getRequestHostData`,
  async (arg: { token: string; paramGet: ParamGet }) => {
    const result = await requestHost.getData(arg.token, arg.paramGet);
    return result;
  }
);

const getIpAdressData = createAsyncThunk(
  `${TYPE_PREFIX}/getIpAdressData`,
  async (arg: { token: string; paramGet: RUIpAdressParamGet }) => {
    const result = await requestHost.getIpAddressById(arg.token, arg.paramGet);
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
    builder.addCase(getIpAdressData.pending, (state) => ({
      ...state,
      ipAdressDataLoading: true,
    }));
    builder.addCase(getIpAdressData.fulfilled, (state, { payload }) => ({
      ...state,
      ipAdressData: payload,
      ipAdressDataLoading: false,
    }));
    builder.addCase(getIpAdressData.rejected, (state) => ({
      ...state,
      ipAdressDataLoading: false,
    }));
  },
});

export { getRequestHostData, getIpAdressData };

export default slice.reducer;

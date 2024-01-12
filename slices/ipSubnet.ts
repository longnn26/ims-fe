import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ipSubnetService from "@services/ipSubnet";
import { ParamGet, ParamGetWithId } from "@models/base";
import { IpSubnetData } from "@models/ipSubnet";
import {
  IpAddressData,
  IpAddressHistoryData,
  IpAddressParamGet,
} from "@models/ipAddress";
import ipAddress from "@services/ipAddress";

interface State {
  ipSubnetData: IpSubnetData;
  ipAddressData: IpAddressData;
  ipAddressHistoryData: IpAddressHistoryData;
  ipSubnetDataLoading: boolean;
  ipAddressDataLoading: boolean;
  ipAddressHistoryDataLoading: boolean;
}

const initialState: State = {
  ipSubnetData: {} as IpSubnetData,
  ipAddressData: {} as IpAddressData,
  ipAddressHistoryData: {} as IpAddressHistoryData,
  ipSubnetDataLoading: false,
  ipAddressDataLoading: false,
  ipAddressHistoryDataLoading: false,
};

const TYPE_PREFIX = "ipSubnet";

const getIpSubnetData = createAsyncThunk(
  `${TYPE_PREFIX}/getData`,
  async (arg: { token: string; paramGet: ParamGet }) => {
    const result = await ipSubnetService.getData(arg.token, arg.paramGet);
    return result;
  }
);

const getIpAddressData = createAsyncThunk(
  `${TYPE_PREFIX}/getIpAddressData`,
  async (arg: { token: string; paramGet: IpAddressParamGet }) => {
    const result = await ipAddress.getData(arg.token, arg.paramGet);
    return result;
  }
);

const getIpAddressHistoryData = createAsyncThunk(
  `${TYPE_PREFIX}/getIpAddressHistoryData`,
  async (arg: { token: string; id: string }) => {
    const result = await ipAddress.getHistory(arg.token, arg.id);
    return result;
  }
);

const slice = createSlice({
  name: "ipSubnet",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getIpSubnetData.pending, (state) => ({
      ...state,
      ipSubnetDataLoading: true,
    }));
    builder.addCase(getIpSubnetData.fulfilled, (state, { payload }) => ({
      ...state,
      ipSubnetData: payload,
      ipSubnetDataLoading: false,
    }));
    builder.addCase(getIpSubnetData.rejected, (state) => ({
      ...state,
      ipSubnetDataLoading: false,
    }));

    builder.addCase(getIpAddressData.pending, (state) => ({
      ...state,
      ipAddressDataLoading: true,
    }));
    builder.addCase(getIpAddressData.fulfilled, (state, { payload }) => ({
      ...state,
      ipAddressData: payload,
      ipAddressDataLoading: false,
    }));
    builder.addCase(getIpAddressData.rejected, (state) => ({
      ...state,
      ipAddressDataLoading: false,
    }));

    builder.addCase(getIpAddressHistoryData.pending, (state) => ({
      ...state,
      ipAddressHistoryDataLoading: true,
    }));
    builder.addCase(
      getIpAddressHistoryData.fulfilled,
      (state, { payload }) => ({
        ...state,
        ipAddressHistoryData: payload,
        ipAddressHistoryDataLoading: false,
      })
    );
    builder.addCase(getIpAddressHistoryData.rejected, (state) => ({
      ...state,
      ipAddressHistoryDataLoading: false,
    }));
  },
});

export { getIpSubnetData, getIpAddressData, getIpAddressHistoryData };

export default slice.reducer;

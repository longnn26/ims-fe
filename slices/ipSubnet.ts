import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ipSubnetService from "@services/ipSubnet";
import { ParamGet, ParamGetWithId } from "@models/base";
import { IpSubnetData } from "@models/ipSubnet";
import { IpAddressData, IpAddressParamGet } from "@models/ipAddress";
import ipAddress from "@services/ipAddress";

interface State {
  ipSubnetData: IpSubnetData;
  ipAddressData: IpAddressData;
  ipSubnetDataLoading: boolean;
  ipAddressDataLoading: boolean;
}

const initialState: State = {
  ipSubnetData: {} as IpSubnetData,
  ipAddressData: {} as IpAddressData,
  ipSubnetDataLoading: false,
  ipAddressDataLoading: false,
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
    const result = await ipAddress.getData(
      arg.token,
      arg.paramGet
    );
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
  },
});

export { getIpSubnetData, getIpAddressData };

export default slice.reducer;

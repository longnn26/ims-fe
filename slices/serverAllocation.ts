import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import serverAllocationService from "@services/serverAllocation";
import customerService from "@services/customer";
import { ParamGet, ParamGetWithId } from "@models/base";
import { ServerAllocationData } from "@models/serverAllocation";
import { CustomerData } from "@models/customer";
import { IpAddressData, IpAddressParamGet } from "@models/ipAddress";
import ipAddress from "@services/ipAddress";

interface State {
  serverAllocationData: ServerAllocationData;
  customerData: CustomerData;
  serverAllocationDataLoading: boolean;
  serverIpAdressData: IpAddressData;
}

const initialState: State = {
  serverAllocationData: {} as ServerAllocationData,
  customerData: {} as CustomerData,
  serverIpAdressData: {} as IpAddressData,
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

const getCustomerServerAllocationData = createAsyncThunk(
  `${TYPE_PREFIX}/getData`,
  async (arg: { token: string; id: string }) => {
    const result = await customerService.getServerById(
      arg.token,
      arg.id
    );
    return result;
  }
);

const getCustomerData = createAsyncThunk(
  `${TYPE_PREFIX}/getCustomerData`,
  async (arg: { token: string; paramGet: ParamGet }) => {
    const result = await customerService.getData(arg.token, arg.paramGet);
    return result;
  }
);

const getServerIpAdressData = createAsyncThunk(
  `${TYPE_PREFIX}/getServerIpAdressData`,
  async (arg: { token: string; paramGet: IpAddressParamGet }) => {
    const result = await ipAddress.getData(
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

    builder.addCase(getCustomerData.fulfilled, (state, { payload }) => ({
      ...state,
      customerData: payload,
    }));

    builder.addCase(getServerIpAdressData.fulfilled, (state, { payload }) => ({
      ...state,
      serverIpAdressData: payload,
    }));
  },
});

export { getServerAllocationData, getCustomerData, getServerIpAdressData, getCustomerServerAllocationData };

export default slice.reducer;

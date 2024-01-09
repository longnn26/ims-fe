import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import customerService from "@services/customer";
import { ParamGet } from "@models/base";
import { CusParam, CustomerData } from "@models/customer";
import serverAllocation from "@services/serverAllocation";
import { ServerAllocationData } from "@models/serverAllocation";

interface State {
  serverAllocationData: ServerAllocationData;
  serverAllocationDataLoading: boolean;
  customerData: CustomerData;
  customerDataLoading: boolean;
}

const initialState: State = {
  serverAllocationData: {} as ServerAllocationData,
  serverAllocationDataLoading: false,
  customerData: {} as CustomerData,
  customerDataLoading: false,
};

const TYPE_PREFIX = "customer";

const getServerAllocationData = createAsyncThunk(
  `${TYPE_PREFIX}/getData`,
  async (arg: { token: string; param: ParamGet; }) => {
    const result = await serverAllocation.getServerAllocationData(
      arg.token,
      arg.param,
    );
    return result;
  }
);

const getCustomerData = createAsyncThunk(
  `${TYPE_PREFIX}/getData`,
  async (arg: { token: string; paramGet: CusParam }) => {
    const result = await customerService.getData(arg.token, arg.paramGet);
    return result;
  }
);

const slice = createSlice({
  name: "component",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCustomerData.pending, (state) => ({
      ...state,
      customerDataLoading: true,
    }));
    builder.addCase(getCustomerData.fulfilled, (state, { payload }) => ({
      ...state,
      customerData: payload,
      customerDataLoading: false,
    }));
    builder.addCase(getCustomerData.rejected, (state) => ({
      ...state,
      customerDataLoading: false,
    }));
  },
});

export { getCustomerData, getServerAllocationData };

export default slice.reducer;

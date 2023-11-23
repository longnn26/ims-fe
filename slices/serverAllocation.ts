import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import serverAllocationService from "@services/serverAllocation";
import customerService from "@services/customer";
import { ParamGet } from "@models/base";
import { ServerAllocationData } from "@models/serverAllocation";
import { CustomerData } from "@models/customer";

interface State {
  serverAllocationData: ServerAllocationData;
  customerData: CustomerData;
  serverAllocationDataLoading: boolean;
}

const initialState: State = {
  serverAllocationData: {} as ServerAllocationData,
  customerData: {} as CustomerData,
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

const getCustomerData = createAsyncThunk(
  `${TYPE_PREFIX}/getCustomerData`,
  async (arg: { token: string; paramGet: ParamGet }) => {
    const result = await customerService.getData(arg.token, arg.paramGet);
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
  },
});

export { getServerAllocationData, getCustomerData };

export default slice.reducer;

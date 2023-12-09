import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import customerService from "@services/customer";
import { ParamGet } from "@models/base";
import { CustomerData } from "@models/customer";

interface State {
  customerData: CustomerData;
  customerDataLoading: boolean;
}

const initialState: State = {
  customerData: {} as CustomerData,
  customerDataLoading: false,
};

const TYPE_PREFIX = "customer";

const getServerAllocationData = createAsyncThunk(
  `${TYPE_PREFIX}/getData`,
  async (arg: { token: string; id: string }) => {
    const result = await customerService.getServerById(
      arg.token,
      arg.id,
    );
    return result;
  }
);

const getCustomerData = createAsyncThunk(
  `${TYPE_PREFIX}/getData`,
  async (arg: { token: string; paramGet: ParamGet }) => {
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

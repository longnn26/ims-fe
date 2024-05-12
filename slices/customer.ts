import { createSlice } from "@reduxjs/toolkit";
import { CustomerData } from "@models/customer";

interface State {
  serverAllocationDataLoading: boolean;
  customerData: CustomerData;
  customerDataLoading: boolean;
}

const initialState: State = {
  serverAllocationDataLoading: false,
  customerData: {} as CustomerData,
  customerDataLoading: false,
};

const TYPE_PREFIX = "customer";

const slice = createSlice({
  name: "component",
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

export {};

export default slice.reducer;

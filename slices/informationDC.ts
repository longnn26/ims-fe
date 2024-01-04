import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import informationDCService from "@services/informationDC";
import customerService from "@services/customer";
import { ParamGet, ParamGetWithId } from "@models/base";
import { SParamGet, ServerAllocationData } from "@models/serverAllocation";
import { CustomerData } from "@models/customer";
import { IpAddressData, IpAddressParamGet } from "@models/ipAddress";
import ipAddress from "@services/ipAddress";
import { InformationDC } from "@models/informationDC";

interface State {
  informationDCData: InformationDC;
  informationDCDataLoading: boolean;
}

const initialState: State = {
  informationDCData: {} as InformationDC,
  informationDCDataLoading: false,
};

const TYPE_PREFIX = "informationDC";

const getInformationDCData = createAsyncThunk(
  `${TYPE_PREFIX}/getData`,
  async (arg: { token: string; param: SParamGet }) => {
    const result = await informationDCService.getData(arg.token);
    return result;
  }
);

const slice = createSlice({
  name: "serverAllocation",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getInformationDCData.pending, (state) => ({
      ...state,
      informationDCDataLoading: true,
    }));
    builder.addCase(getInformationDCData.fulfilled, (state, { payload }) => ({
      ...state,
      informationDCData: payload,
      informationDCDataLoading: false,
    }));
    builder.addCase(getInformationDCData.rejected, (state) => ({
      ...state,
      informationDCDataLoading: false,
    }));
  },
});

export { getInformationDCData };

export default slice.reducer;

import { AppointmentData } from "@models/appointment";
import { ParamGet } from "@models/base";
import { RequestExpandData } from "@models/requestExpand";
import { RUAppointmentParamGet, RUParamGet } from "@models/requestUpgrade";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import requestExpand from "@services/requestExpand";

interface State {
  requestExpandData: RequestExpandData;
  appointmentData: AppointmentData;
  requestExpandDataLoading: boolean;
}

const initialState: State = {
  requestExpandData: {} as RequestExpandData,
  appointmentData: {} as AppointmentData,
  requestExpandDataLoading: false,
};

const TYPE_PREFIX = "requestExpand";

const getRequestExpandData = createAsyncThunk(
  `${TYPE_PREFIX}/getRequestExpandData`,
  async (arg: { token: string; paramGet: RUParamGet }) => {
    const result = await requestExpand.getData(arg.token, arg.paramGet);
    return result;
  }
);

const getAppointmentData = createAsyncThunk(
  `${TYPE_PREFIX}/getAppointmentData`,
  async (arg: { token: string; paramGet: RUAppointmentParamGet }) => {
    const result = await requestExpand.getAppointmentsById(
      arg.token,
      arg.paramGet
    );
    return result;
  }
);

const slice = createSlice({
  name: "requestExpand",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getRequestExpandData.pending, (state) => ({
      ...state,
      requestExpandDataLoading: true,
    }));
    builder.addCase(getRequestExpandData.fulfilled, (state, { payload }) => ({
      ...state,
      requestExpandData: payload,
      requestExpandDataLoading: false,
    }));
    builder.addCase(getRequestExpandData.rejected, (state) => ({
      ...state,
      requestExpandDataLoading: false,
    }));

    builder.addCase(getAppointmentData.fulfilled, (state, { payload }) => ({
      ...state,
      appointmentData: payload,
    }));
  },
});

export { getRequestExpandData, getAppointmentData };

export default slice.reducer;

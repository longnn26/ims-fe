import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import requestUpgradeService from "@services/requestUpgrade";
import { ParamGet } from "@models/base";
import {
  RUAppointmentParamGet,
  RUParamGet,
  RequestUpgradeData,
} from "@models/requestUpgrade";
import { AppointmentData } from "@models/appointment";

interface State {
  requestUpgradeData: RequestUpgradeData;
  appointmentData: AppointmentData;
  requestUpgradeDataLoading: boolean;
}

const initialState: State = {
  requestUpgradeData: {} as RequestUpgradeData,
  appointmentData: {} as AppointmentData,
  requestUpgradeDataLoading: false,
};

const TYPE_PREFIX = "requestUpgrade";

const getRequestUpgradeData = createAsyncThunk(
  `${TYPE_PREFIX}/getData`,
  async (arg: { token: string; paramGet: RUParamGet }) => {
    const result = await requestUpgradeService.getData(arg.token, arg.paramGet);
    return result;
  }
);

const getAppointmentData = createAsyncThunk(
  `${TYPE_PREFIX}/getAppointmentData`,
  async (arg: { token: string; paramGet: RUAppointmentParamGet }) => {
    const result = await requestUpgradeService.getAppointmentsById(
      arg.token,
      arg.paramGet
    );
    return result;
  }
);

const slice = createSlice({
  name: "serverHardwareConfig",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getRequestUpgradeData.pending, (state) => ({
      ...state,
      requestUpgradeDataLoading: true,
    }));
    builder.addCase(getRequestUpgradeData.fulfilled, (state, { payload }) => ({
      ...state,
      requestUpgradeData: payload,
      requestUpgradeDataLoading: false,
    }));
    builder.addCase(getRequestUpgradeData.rejected, (state) => ({
      ...state,
      requestUpgradeDataLoading: false,
    }));

    builder.addCase(getAppointmentData.fulfilled, (state, { payload }) => ({
      ...state,
      appointmentData: payload,
    }));
  },
});

export { getRequestUpgradeData, getAppointmentData };

export default slice.reducer;

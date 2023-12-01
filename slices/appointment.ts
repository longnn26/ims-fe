import { AppointmentData } from "@models/appointment";
import { RequestExpandData } from "@models/requestExpand";
import {
  RUAppointmentParamGet,
  RequestUpgradeData,
} from "@models/requestUpgrade";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import appointment from "@services/appointment";

interface State {
  listAppointmentData: AppointmentData;
  requestUpgradeData: RequestUpgradeData;
  requestExpandData: RequestExpandData;
  listAppointmentDataLoading: boolean;
}

const initialState: State = {
  listAppointmentData: {} as AppointmentData,
  requestUpgradeData: {} as RequestUpgradeData,
  requestExpandData: {} as RequestExpandData,
  listAppointmentDataLoading: false,
};

const TYPE_PREFIX = "appointment";

const getListAppointment = createAsyncThunk(
  `${TYPE_PREFIX}/getListAppointment`,
  async (arg: { token: string; paramGet: RUAppointmentParamGet }) => {
    const result = await appointment.getListAppointments(
      arg.token,
      arg.paramGet
    );
    return result;
  }
);

const getRequestUpgradeData = createAsyncThunk(
  `${TYPE_PREFIX}/getRequestUpgradeData`,
  async (arg: { token: string; paramGet: RUAppointmentParamGet }) => {
    const result = await appointment.getRequestUpgradesById(
      arg.token,
      arg.paramGet
    );
    return result;
  }
);

const getRequestExpandData = createAsyncThunk(
  `${TYPE_PREFIX}/getRequestExpandData`,
  async (arg: { token: string; paramGet: RUAppointmentParamGet }) => {
    const result = await appointment.getRequestExpandsById(
      arg.token,
      arg.paramGet
    );
    return result;
  }
);

const slice = createSlice({
  name: "appointment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getListAppointment.pending, (state) => ({
      ...state,
      listAppointmentDataLoading: true,
    }));
    builder.addCase(getListAppointment.fulfilled, (state, { payload }) => ({
      ...state,
      listAppointmentData: payload,
      listAppointmentDataLoading: false,
    }));
    builder.addCase(getListAppointment.rejected, (state) => ({
      ...state,
      listAppointmentDataLoading: false,
    }));

    builder.addCase(getRequestUpgradeData.fulfilled, (state, { payload }) => ({
      ...state,
      requestUpgradeData: payload,
    }));

    builder.addCase(getRequestExpandData.fulfilled, (state, { payload }) => ({
      ...state,
      requestExpandData: payload,
    }));
  },
});

export { getListAppointment, getRequestUpgradeData, getRequestExpandData };

export default slice.reducer;

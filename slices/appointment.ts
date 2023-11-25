import { AppointmentData } from "@models/appointment";
import {
  RUAppointmentParamGet,
  RequestUpgradeData,
} from "@models/requestUpgrade";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import appointment from "@services/appointment";

interface State {
  listAppointmentData: AppointmentData;
  requestUpgradeData: RequestUpgradeData;
  listAppointmentDataLoading: boolean;
}

const initialState: State = {
  listAppointmentData: {} as AppointmentData,
  requestUpgradeData: {} as RequestUpgradeData,
  listAppointmentDataLoading: false,
};

const TYPE_PREFIX = "requestUpgrade";

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
  `${TYPE_PREFIX}/getAppointmentData`,
  async (arg: { token: string; paramGet: RUAppointmentParamGet }) => {
    const result = await appointment.getRequestUpgradesById(
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
  },
});

export { getListAppointment, getRequestUpgradeData };

export default slice.reducer;

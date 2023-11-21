import { AppointmentData } from "@models/appointment";
import { RUAppointmentParamGet } from "@models/requestUpgrade";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import appointment from "@services/appointment";

interface State {
  listAppointmentData: AppointmentData;
  listAppointmentDataLoading: boolean;
}

const initialState: State = {
  listAppointmentData: {} as AppointmentData,
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
  },
});

export { getListAppointment };

export default slice.reducer;

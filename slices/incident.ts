import { AppointmentData } from "@models/appointment";
import { ParamGet } from "@models/base";
import { IncidentData } from "@models/incident";
import { RUAppointmentParamGet, RUParamGet } from "@models/requestUpgrade";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import incident from "@services/incident";
import requestExpand from "@services/requestExpand";

interface State {
  incidentData: IncidentData;
  appointmentData: AppointmentData;
  incidentDataLoading: boolean;
}

const initialState: State = {
  incidentData: {} as IncidentData,
  appointmentData: {} as AppointmentData,
  incidentDataLoading: false,
};

const TYPE_PREFIX = "incident";

const getIncidentData = createAsyncThunk(
  `${TYPE_PREFIX}/getIncidentData`,
  async (arg: { token: string; paramGet: RUParamGet }) => {
    const result = await incident.getData(arg.token, arg.paramGet);
    return result;
  }
);

// const getAppointmentData = createAsyncThunk(
//   `${TYPE_PREFIX}/getAppointmentData`,
//   async (arg: { token: string; paramGet: RUAppointmentParamGet }) => {
//     const result = await requestExpand.getAppointmentsById(
//       arg.token,
//       arg.paramGet
//     );
//     return result;
//   }
// );

const slice = createSlice({
  name: "incident",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getIncidentData.pending, (state) => ({
      ...state,
      incidentDataLoading: true,
    }));
    builder.addCase(getIncidentData.fulfilled, (state, { payload }) => ({
      ...state,
      incidentData: payload,
      incidentDataLoading: false,
    }));
    builder.addCase(getIncidentData.rejected, (state) => ({
      ...state,
      incidentDataLoading: false,
    }));

    // builder.addCase(getAppointmentData.fulfilled, (state, { payload }) => ({
    //   ...state,
    //   appointmentData: payload,
    // }));
  },
});

export { getIncidentData };

export default slice.reducer;

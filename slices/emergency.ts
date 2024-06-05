import { EmergencyType } from "@models/emergency";
import { createSlice, PayloadAction, CaseReducer } from "@reduxjs/toolkit";
import { EmergencyStatusEnum } from "@utils/enum";

interface State {
  dataEmergencyListInQueue: any;
  dataEmergencyListFromApi: EmergencyType[];
  havingNotiEmergency: boolean;
}

const initialState: State = {
  dataEmergencyListInQueue: [],
  dataEmergencyListFromApi: [],
  havingNotiEmergency: false,
};

interface UpdateEmergencyPayload {
  id: string;
  status?: EmergencyStatusEnum;
  isStopTrip?: boolean;
}

type CR<T> = CaseReducer<State, PayloadAction<T>>;

const slice = createSlice({
  name: "emergency",
  initialState,
  reducers: {
    updateDataEmergencyListStateInQueue: (state, action) => {
      state.dataEmergencyListInQueue.push(action.payload);
    },
    removeFirstDataEmergency: (state) => {
      if (state.dataEmergencyListInQueue.length > 0) {
        state.dataEmergencyListInQueue.shift();
      }
    },
    updateHavingNotiEmergencyStatus: (state, action) => {
      state.havingNotiEmergency = action.payload;
    },
    updateEmergencyStatus: (
      state,
      action: PayloadAction<UpdateEmergencyPayload>
    ) => {
      const { id, status, isStopTrip } = action.payload;
      const index = state.dataEmergencyListFromApi.findIndex(
        (emergency) => emergency.id === id
      );

      if (index !== -1) {
        if (status !== undefined) {
          state.dataEmergencyListFromApi[index].status = status;
        }
        if (isStopTrip !== undefined) {
          state.dataEmergencyListFromApi[index].isStopTrip = isStopTrip;
        }
      }
    },
    setDataEmergencyListFromApi: (state, action) => {
      state.dataEmergencyListFromApi = action.payload;
    },
  },
});

export const {
  updateDataEmergencyListStateInQueue,
  removeFirstDataEmergency,
  updateHavingNotiEmergencyStatus,
  updateEmergencyStatus,
  setDataEmergencyListFromApi,
} = slice.actions;

export default slice.reducer;

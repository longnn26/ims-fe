import { EmergencyType } from "@models/emergency";
import { Notification } from "@models/notification";
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

type CR<T> = CaseReducer<State, PayloadAction<T>>;

const slice = createSlice({
  name: "emergency",
  initialState,
  reducers: {
    updateDataEmergencyListState: (state, action) => {
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
    setDataEmergencyListFromApi: (state, action) => {
      state.dataEmergencyListFromApi = action.payload;
    },
    updateEmergencyStatusToSolved: (state, action: PayloadAction<string>) => {
      if (state.dataEmergencyListFromApi.length > 0) {
        const index = state.dataEmergencyListFromApi.findIndex(
          (noti) => noti.id === action.payload
        );
        if (index !== -1) {
          state.dataEmergencyListFromApi[index].status =
            EmergencyStatusEnum.Solved;
        }
      }
    },
    updateEmergencyStatusToProcessing: (
      state,
      action: PayloadAction<string>
    ) => {
      if (state.dataEmergencyListFromApi.length > 0) {
        const index = state.dataEmergencyListFromApi.findIndex(
          (noti) => noti.id === action.payload
        );
        if (index !== -1) {
          state.dataEmergencyListFromApi[index].status =
            EmergencyStatusEnum.Processing;
        }
      }
    },
  },
});

export const {
  updateDataEmergencyListState,
  removeFirstDataEmergency,
  updateHavingNotiEmergencyStatus,
  updateEmergencyStatusToSolved,
  updateEmergencyStatusToProcessing,
  setDataEmergencyListFromApi,
} = slice.actions;

export default slice.reducer;

import { Notification } from "@models/notification";
import { createSlice, PayloadAction, CaseReducer } from "@reduxjs/toolkit";

interface State {
  dataEmergencyListInQueue: Notification[];
  dataEmergency: Notification;
  havingNotiEmergency: boolean;
}

const initialState: State = {
  dataEmergencyListInQueue: [],
  dataEmergency: {
    id: 0,
    dateCreated: "",
    dateUpdated: "",
    seen: true,
    action: "",
    title: "",
    body: "",
    data: "",
    typeModel: "",
  },
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
    changeHaveNotiEmergency: (state) => {
      state.havingNotiEmergency = true;
    },
    changeWithoutNotiEmergency: (state) => {
      state.havingNotiEmergency = false;
    },
  },
});

export const {
  updateDataEmergencyListState,
  removeFirstDataEmergency,
  changeHaveNotiEmergency,
  changeWithoutNotiEmergency,
} = slice.actions;

export default slice.reducer;

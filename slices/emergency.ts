import { Notification } from "@models/notification";
import { createSlice, PayloadAction, CaseReducer } from "@reduxjs/toolkit";

interface State {
  dataEmergencyList: Notification[];
  dataEmergency: Notification;
}

const initialState: State = {
  dataEmergencyList: [],
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
};

type CR<T> = CaseReducer<State, PayloadAction<T>>;

const slice = createSlice({
  name: "emergency",
  initialState,
  reducers: {
    updateDataEmergencyListState: (state, action) => {
      state.dataEmergencyList.push(action.payload);
    },
    removeFirstDataEmergency: (state) => {
      if (state.dataEmergencyList.length > 0) {
        state.dataEmergencyList.shift();
      }
    },
  },
});

export const { updateDataEmergencyListState, removeFirstDataEmergency } =
  slice.actions;

export default slice.reducer;

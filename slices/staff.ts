import { createSlice, PayloadAction, CaseReducer } from "@reduxjs/toolkit";

interface State {
  isFree: boolean;
}

const initialState: State = {
  isFree: true,
};

type CR<T> = CaseReducer<State, PayloadAction<T>>;

const slice = createSlice({
  name: "staff",
  initialState,
  reducers: {
    setStaffBusyStatus: (state, action) => {
      state.isFree = action.payload;
    },
  },
});

export const { setStaffBusyStatus } = slice.actions;

export default slice.reducer;

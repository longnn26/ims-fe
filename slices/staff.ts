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
    setStaffIsFreeStatus: (state, action) => {
      state.isFree = action.payload;
    },
  },
});

export const { setStaffIsFreeStatus } = slice.actions;

export default slice.reducer;

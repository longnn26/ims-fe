import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "@services/user";
import { ParamGet } from "@models/base";
import { UserData } from "@models/user";

interface State {
  userData: UserData;
  userDataLoading: boolean;
}

const initialState: State = {
  userData: {} as UserData,
  userDataLoading: false,
};

const TYPE_PREFIX = "user";

const slice = createSlice({
  name: "component",
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

export {};

export default slice.reducer;

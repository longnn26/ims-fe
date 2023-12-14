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

const getUserData = createAsyncThunk(
  `${TYPE_PREFIX}/getData`,
  async (arg: { token: string; paramGet: ParamGet }) => {
    const result = await userService.getUserData(arg.token, arg.paramGet);
    return result;
  }
);

const slice = createSlice({
  name: "component",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUserData.pending, (state) => ({
      ...state,
      userDataLoading: true,
    }));
    builder.addCase(getUserData.fulfilled, (state, { payload }) => ({
      ...state,
      userData: payload,
      userDataLoading: false,
    }));
    builder.addCase(getUserData.rejected, (state) => ({
      ...state,
      userDataLoading: false,
    }));
  },
});

export { getUserData };

export default slice.reducer;

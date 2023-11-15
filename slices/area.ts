import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import areaService from "@services/area";
import { ParamGet } from "@models/base";
import { AreaData } from "@models/area";

interface State {
  areaData: AreaData;
  areaDataLoading: boolean;
}

const initialState: State = {
  areaData: {} as AreaData,
  areaDataLoading: false,
};

const TYPE_PREFIX = "area";

const getAreaData = createAsyncThunk(
  `${TYPE_PREFIX}/getData`,
  async (arg: { token: string; paramGet: ParamGet }) => {
    const result = await areaService.getData(arg.token, arg.paramGet);
    return result;
  }
);

const slice = createSlice({
  name: "component",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAreaData.pending, (state) => ({
      ...state,
      areaDataLoading: true,
    }));
    builder.addCase(getAreaData.fulfilled, (state, { payload }) => ({
      ...state,
      areaData: payload,
      areaDataLoading: false,
    }));
    builder.addCase(getAreaData.rejected, (state) => ({
      ...state,
      areaDataLoading: false,
    }));
  },
});

export { getAreaData };

export default slice.reducer;

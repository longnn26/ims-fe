import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import areaService from "@services/area";
import { ParamGet } from "@models/base";
import { AreaData } from "@models/area";
import { Rack, RackData } from "@models/rack";

interface State {
  areaData: AreaData;
  rackData: RackData;
  areaDataLoading: boolean;
}

const initialState: State = {
  areaData: {} as AreaData,
  rackData: {} as RackData,
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

const getRackData = createAsyncThunk(
  `${TYPE_PREFIX}/getRackData`,
  async (arg: { token: string; id: string }) => {
    const result = await areaService.getRackDataById(arg.token, arg.id);
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

    builder.addCase(getRackData.pending, (state) => ({
      ...state,
    }));
    builder.addCase(getRackData.fulfilled, (state, { payload }) => ({
      ...state,
      rackData: payload,
    }));
    builder.addCase(getRackData.rejected, (state) => ({
      ...state,
    }));
  },
});

export { getAreaData, getRackData };

export default slice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import areaService from "@services/area";
import { ParamGet } from "@models/base";
import { Area, AreaData } from "@models/area";
import { Rack, RackData } from "@models/rack";
import { LocationParamGet } from "@models/location";

interface State {
  areaData: AreaData;
  getAllAreaData: Area[];
  rackData: RackData;
  getAllRackData: Rack[];
  areaDataLoading: boolean;
}

const initialState: State = {
  areaData: {} as AreaData,
  rackData: {} as RackData,
  areaDataLoading: false,
  getAllRackData: [],
  getAllAreaData: [],
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
  async (arg: { token: string; id: string, param: ParamGet }) => {
    const result = await areaService.getRackDataById(arg.token, arg.id, arg.param);
    return result;
  }
);

const getAllRackData = createAsyncThunk(
  `${TYPE_PREFIX}/getAllRackData`,
  async (arg: { token: string; id: string }) => {
    const result = await areaService.getAllRackDataById(arg.token, arg.id);
    return result;
  }
);

const getAllAreaData = createAsyncThunk(
  `${TYPE_PREFIX}/getAllAreaData`,
  async (arg: { token: string }) => {
    const result = await areaService.getAllArea(arg.token);
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

    builder.addCase(getAllRackData.pending, (state) => ({
      ...state,
    }));
    builder.addCase(getAllRackData.fulfilled, (state, { payload }) => ({
      ...state,
      getAllRackData: payload,
    }));
    builder.addCase(getAllRackData.rejected, (state) => ({
      ...state,
    }));

    builder.addCase(getAllAreaData.pending, (state) => ({
      ...state,
    }));
    builder.addCase(getAllAreaData.fulfilled, (state, { payload }) => ({
      ...state,
      getAllAreaData: payload,
    }));
    builder.addCase(getAllAreaData.rejected, (state) => ({
      ...state,
    }));
  },
});

export { getAreaData, getRackData, getAllRackData, getAllAreaData };

export default slice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import componentService from "@services/component";
import { ParamGet } from "@models/base";
import { ComponentData, ComponentObj } from "@models/component";

interface State {
  componentData: ComponentData;
  componentOptions: ComponentObj[];
  componentDataLoading: boolean;
}

const initialState: State = {
  componentData: {} as ComponentData,
  componentOptions: [],
  componentDataLoading: false,
};

const TYPE_PREFIX = "component";

const getComponentData = createAsyncThunk(
  `${TYPE_PREFIX}/getData`,
  async (arg: { token: string; paramGet: ParamGet }) => {
    const result = await componentService.getComponentData(
      arg.token,
      arg.paramGet
    );
    return result;
  }
);

const getComponentAll = createAsyncThunk(
  `${TYPE_PREFIX}/getAll`,
  async (arg: { token: string }) => {
    const result = await componentService.getComponentAll(arg.token);
    return result;
  }
);

const slice = createSlice({
  name: "component",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getComponentData.pending, (state) => ({
      ...state,
      componentDataLoading: true,
    }));
    builder.addCase(getComponentData.fulfilled, (state, { payload }) => ({
      ...state,
      componentData: payload,
      componentDataLoading: false,
    }));
    builder.addCase(getComponentData.rejected, (state) => ({
      ...state,
      componentDataLoading: false,
    }));

    builder.addCase(getComponentAll.pending, (state) => ({
      ...state,
    }));
    builder.addCase(getComponentAll.fulfilled, (state, { payload }) => ({
      ...state,
      componentOptions: payload,
    }));
    builder.addCase(getComponentAll.rejected, (state) => ({
      ...state,
    }));
  },
});

export { getComponentData, getComponentAll };

export default slice.reducer;

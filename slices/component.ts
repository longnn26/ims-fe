import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import componentService from "@services/component";
import { ParamGet } from "@models/base";
import { ComponentData } from "@models/component";

interface State {
  componentData: ComponentData;
  componentDataLoading: boolean;
}

const initialState: State = {
  componentData: {} as ComponentData,
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
  },
});

export { getComponentData };

export default slice.reducer;

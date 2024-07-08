import { createSlice, PayloadAction, CaseReducer } from "@reduxjs/toolkit";
import { sliderMenu, sliderMenus } from "@utils/global";

interface State {
  collapsed: boolean;
  defaultOpenKey: string[];
  labelHeader: string;
}

const initialState: State = {
  collapsed: false,
  defaultOpenKey: ["products"],
  labelHeader: "",
};

type CR<T> = CaseReducer<State, PayloadAction<T>>;

const slice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setCollapsed: (state, action) => {
      state.collapsed = action.payload;
    },
    setdefaultOpenKeys: (state, action) => {
      state.defaultOpenKey = action.payload;
      console.log(action.payload)
      if (state.defaultOpenKey.length > 1) {
        const defaultOpen = sliderMenus.find(
          (_) => _?.key === state.defaultOpenKey[1]
        );
        state.labelHeader = defaultOpen!["children"]?.find(
          (_) => _.key === state.defaultOpenKey[0]
        )?.label;
      } else {
        state.labelHeader = sliderMenus.find(
          (_) => _?.key === state.defaultOpenKey[0]
        )!['label'];
      }
    },
  },
});

export const {
  setCollapsed,
  setdefaultOpenKeys,
} = slice.actions;

export default slice.reducer;

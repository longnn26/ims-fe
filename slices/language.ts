import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Language, LanguageData } from "@models/language";
import languageService from "@services/language";
import { ParamGet } from "@models/base";

interface State {
  languages: Language[];
  languageLoading: boolean;

  languageData: LanguageData;
  languageDataLoading: boolean;
}

const initialState: State = {
  languages: [],
  languageLoading: false,

  languageData: {} as LanguageData,
  languageDataLoading: false,
};

const TYPE_PREFIX = "language";

const getLanguages = createAsyncThunk(
  `${TYPE_PREFIX}/getLanguages`,
  async (token: string) => {
    const result = await languageService.getLanguages(token);
    return result;
  }
);

const getLanguageData = createAsyncThunk(
  `${TYPE_PREFIX}/getLanguageData`,
  async (arg: { token: string; paramGet: ParamGet }) => {
    const result = await languageService.getLanguageData(
      arg.token,
      arg.paramGet
    );
    return result;
  }
);

const slice = createSlice({
  name: "language",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getLanguages.pending, (state) => ({
      ...state,
      languageLoading: true,
    }));
    builder.addCase(getLanguages.fulfilled, (state, { payload }) => ({
      ...state,
      languages: payload,
      languageLoading: false,
    }));
    builder.addCase(getLanguages.rejected, (state) => ({
      ...state,
      languageLoading: false,
    }));

    // get language data
    builder.addCase(getLanguageData.pending, (state) => ({
      ...state,
      languageDataLoading: true,
    }));
    builder.addCase(getLanguageData.fulfilled, (state, { payload }) => ({
      ...state,
      languageData: payload,
      languageDataLoading: false,
    }));
    builder.addCase(getLanguageData.rejected, (state) => ({
      ...state,
      languageDataLoading: false,
    }));
  },
});

export { getLanguages, getLanguageData };

export default slice.reducer;

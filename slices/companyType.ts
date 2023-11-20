import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import companyTypeService from "@services/companyType";
import { CompanyType } from "@models/companyType";

interface State {
  companyTypeList: CompanyType[];
  companyTypeListLoading: boolean;
}

const initialState: State = {
  companyTypeList: [],
  companyTypeListLoading: false,
};

const TYPE_PREFIX = "companyType";

const getCompanyTypeList = createAsyncThunk(
  `${TYPE_PREFIX}/getList`,
  async (arg: { token: string }) => {
    const result = await companyTypeService.getCompanyTypes(arg.token);
    return result;
  }
);

const slice = createSlice({
  name: "companyType",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCompanyTypeList.pending, (state) => ({
      ...state,
      companyTypeListLoading: true,
    }));
    builder.addCase(getCompanyTypeList.fulfilled, (state, { payload }) => ({
      ...state,
      companyTypeList: payload,
      companyTypeListLoading: false,
    }));
    builder.addCase(getCompanyTypeList.rejected, (state) => ({
      ...state,
      companyTypeListLoading: false,
    }));
  },
});

export { getCompanyTypeList };

export default slice.reducer;

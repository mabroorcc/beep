import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface LoadingState {
  loading: boolean;
}

const initialState: LoadingState = {
  loading: true,
};

const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    startLoading: (state) => {
      state.loading = true;
    },
    stopLoading: (state) => {
      state.loading = false;
    },
  },
});

export const selectLoading = (state: RootState) => state.loading.loading;
export const { startLoading, stopLoading } = loadingSlice.actions;
export default loadingSlice.reducer;

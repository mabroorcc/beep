import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice";
import loadingReducer from "../features/LoadingBackdrop/loadingSlice";
import uploadReducer from "../features/FileUpload/uploadSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    loading: loadingReducer,
    upload: uploadReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

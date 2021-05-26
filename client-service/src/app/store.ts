import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice";
import loadingReducer from "../features/LoadingBackdrop/loadingSlice";
import uploadReducer from "../features/FileUpload/uploadSlice";
import paneReducer from "../features/RightHomeSidePanes/paneSlice";
import chatsReducer from "../features/Chats/chatsSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    loading: loadingReducer,
    upload: uploadReducer,
    pane: paneReducer,
    chats: chatsReducer,
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

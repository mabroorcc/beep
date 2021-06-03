import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { chat } from "../Chats/chatsSlice";
import { AppThunk, RootState, store } from "../../app/store";
import { setOpenChat } from "../OpenedChatPane/openChatSlice";

export enum RightPanes {
  NEW_CHAT_PANE,
  ADD_CHAT_PANE,
  OPENED_CHAT_PANE,
}

export interface PaneState {
  CurrentPane: RightPanes;
}

const initialState: PaneState = {
  CurrentPane: RightPanes.NEW_CHAT_PANE,
};

const paneSlice = createSlice({
  name: "pane",
  initialState,
  reducers: {
    openAddChatPane: (state) => {
      state.CurrentPane = RightPanes.ADD_CHAT_PANE;
    },
    openNewChatPane: (state) => {
      state.CurrentPane = RightPanes.NEW_CHAT_PANE;
    },
    goToOpenedChatPane: (state) => {
      state.CurrentPane = RightPanes.OPENED_CHAT_PANE;
    },
  },
});

export const goToOpenedChatPane =
  (chat: chat): AppThunk =>
  (dispatch) => {
    dispatch(setOpenChat(chat));
    dispatch(paneSlice.actions.goToOpenedChatPane());
  };

export const goToNewChatPane = (): AppThunk => (dispatch) => {
  dispatch(setOpenChat(undefined));
  dispatch(paneSlice.actions.openNewChatPane());
};

export const goToAddChatPane = (): AppThunk => (dispatch) => {
  dispatch(setOpenChat(undefined));
  dispatch(paneSlice.actions.openAddChatPane());
};

export const selectCurrentPane = (state: RootState) => state.pane.CurrentPane;
export default paneSlice.reducer;

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
    goToAddChatPane: (state) => {
      state.CurrentPane = RightPanes.ADD_CHAT_PANE;
    },
    goToNewChatPane: (state) => {
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

export const selectCurrentPane = (state: RootState) => state.pane.CurrentPane;
export const { goToAddChatPane, goToNewChatPane } = paneSlice.actions;
export default paneSlice.reducer;

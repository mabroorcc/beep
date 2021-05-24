import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export enum RightPanes {
  NEW_CHAT_PANE,
  ADD_CHAT_PANE,
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
  },
});

export const selectCurrentPane = (state: RootState) => state.pane.CurrentPane;
export const { goToAddChatPane, goToNewChatPane } = paneSlice.actions;
export default paneSlice.reducer;

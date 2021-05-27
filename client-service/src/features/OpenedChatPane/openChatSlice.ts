import { chat } from "../Chats/chatsSlice";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

interface OpenChatState {
  chat: chat | undefined;
}

const initialState: OpenChatState = {
  chat: undefined,
};

const openChatSlice = createSlice({
  name: "openChat",
  initialState,
  reducers: {
    setOpenChat: (state, action: PayloadAction<chat>) => {
      state.chat = action.payload;
    },
  },
});

export const selectOpenChat = (state: RootState) => state.openChat.chat;
export const { setOpenChat } = openChatSlice.actions;
export default openChatSlice.reducer;

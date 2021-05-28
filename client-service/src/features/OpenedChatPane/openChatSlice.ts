import { chat } from "../Chats/chatsSlice";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface Message {
  id: number;
  message: string;
  chatId: string;
  seenBy: string;
  attachment: string;
  attType: string;
  senderId: string;
  date: Date;
}

interface OpenChatState {
  chat: chat | undefined;
  messages: Message[];
}

const initialState: OpenChatState = {
  chat: undefined,
  messages: [],
};

const openChatSlice = createSlice({
  name: "openChat",
  initialState,
  reducers: {
    setOpenChat: (state, action: PayloadAction<chat>) => {
      state.chat = action.payload;
    },
    addMessagesAtTop: (state, action: PayloadAction<Message[]>) => {
      state.messages = [...action.payload, ...state.messages];
    },
    addMessagesAtBottom: (state, action: PayloadAction<Message[]>) => {
      state.messages = [...state.messages, ...action.payload];
    },
    dumpOpenMessages: (state) => {
      state.messages = [];
    },
  },
});

export const selectOpenChat = (state: RootState) => state.openChat.chat;
export const selectOpenMessages = (state: RootState) => state.openChat.messages;
export const {
  setOpenChat,
  addMessagesAtBottom,
  addMessagesAtTop,
  dumpOpenMessages,
} = openChatSlice.actions;
export default openChatSlice.reducer;

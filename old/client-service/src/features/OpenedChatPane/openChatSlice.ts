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
    setOpenChat: (state, action: PayloadAction<chat | undefined>) => {
      state.chat = action.payload;
    },
    addOpenMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = sortById([...action.payload, ...state.messages]);
    },
    dumpOpenMessages: (state) => {
      state.messages = [];
    },
    deleteMessage: (state, action: PayloadAction<number>) => {
      state.messages = sortById(
        state.messages.filter((msg) => msg.id !== action.payload)
      );
    },
    clearOpenChat: (state) => {
      state.chat = undefined;
      state.messages = [];
    },
    changeOpenChatName: (state, action: PayloadAction<string>) => {
      if (state.chat) state.chat.name = action.payload;
    },
  },
});

const sortById = (messages: Message[]) => {
  return messages.slice().sort((a, b) => {
    return a.id - b.id;
  });
};

//const sortByTime = (messages: Message[]) => {
//return messages.slice().sort((a, b) => {
//const AD = new Date(a.date);
//const BD = new Date(b.date);
//return AD.getTime() - BD.getTime();
//});
//};

export const selectOpenChat = (state: RootState) => state.openChat.chat;
export const selectOpenMessages = (state: RootState) => state.openChat.messages;
export const {
  setOpenChat,
  clearOpenChat,
  deleteMessage,
  addOpenMessages,
  dumpOpenMessages,
  changeOpenChatName,
} = openChatSlice.actions;
export default openChatSlice.reducer;

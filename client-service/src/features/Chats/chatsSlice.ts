import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { act } from "@testing-library/react";
import { RootState } from "../../app/store";

export interface chat {
  id: string;
  name: string;
  ownerId: string;
  picture: string;
}

interface ChatsState {
  chats: chat[];
}

const initialState: ChatsState = {
  chats: [],
};

const chatSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    addBunchOfChats: (state, action: PayloadAction<chat[]>) => {
      action.payload.forEach((chat) => state.chats.push(chat));
    },
    removeChat: (state, action: PayloadAction<{ id: string }>) => {
      state.chats = state.chats.filter((chat) => chat.id !== action.payload.id);
    },
    setChats: (state, action: PayloadAction<chat[]>) => {
      state.chats = action.payload;
    },
    addChat: (state, action: PayloadAction<chat>) => {
      for (let chat of state.chats) {
        if (chat.id === action.payload.id) return state;
      }
      state.chats.push(action.payload);
    },
    replaceChat: (state, action: PayloadAction<chat>) => {
      const filtered = state.chats.filter((c) => c.id !== action.payload.id);
      filtered.push(action.payload);
      state.chats = filtered;
    },
    updateChangedChatName: (
      state,
      action: PayloadAction<{ chatId: string; name: string }>
    ) => {
      state.chats = state.chats.map((chat) => {
        if (chat.id === action.payload.chatId) {
          chat.name = action.payload.name;
          return chat;
        } else {
          return chat;
        }
      });
    },
  },
});

export const selectChats = (state: RootState) => state.chats.chats;
export const {
  addBunchOfChats,
  replaceChat,
  removeChat,
  setChats,
  addChat,
  updateChangedChatName,
} = chatSlice.actions;
export default chatSlice.reducer;

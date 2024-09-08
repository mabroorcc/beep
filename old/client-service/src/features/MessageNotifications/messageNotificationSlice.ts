import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Message } from "../OpenedChatPane/openChatSlice";
import { RootState } from "../../app/store";

interface MessageNotification {
  message: Message;
  chatId: string;
}

interface MessageNotificationState {
  notifications: MessageNotification[];
}

const initialState: MessageNotificationState = {
  notifications: [],
};

const messageNotificationSlice = createSlice({
  name: "messageNotifications",
  initialState,
  reducers: {
    addMessageNotifications: (
      state,
      action: PayloadAction<MessageNotification[]>
    ) => {
      state.notifications = [...state.notifications, ...action.payload];
    },
    clearMessageNotification: (state, action: PayloadAction<number>) => {
      state.notifications = state.notifications.filter((notification) => {
        return notification.message.id !== action.payload;
      });
    },
  },
});

export const selectMessageNotifications = (state: RootState) =>
  state.messageNotification.notifications;
export const { addMessageNotifications, clearMessageNotification } =
  messageNotificationSlice.actions;
export default messageNotificationSlice.reducer;

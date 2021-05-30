import { Socket } from "socket.io-client";
import { O } from "../O";
import { store } from "../../app/store";
import { addChat, setChats } from "../Chats/chatsSlice";
import { addMessageNotifications } from "../MessageNotifications/messageNotificationSlice";
import { addOpenMessages } from "../OpenedChatPane/openChatSlice";

let beepSocket: Socket;

export const injectApi = (socket: Socket) => {
  beepSocket = socket;
  addHandlersTo(socket);
  socket.emit(O.GET_ALL_MY_CHATS);
};

const addHandlersTo = (socket: Socket) => {
  socket.on(O.GET_ALL_MY_CHATS + "RES", (chats) => {
    store.dispatch(setChats(chats));
  });
  socket.on(O.GET_ALL_MY_CHATS + "ERR", (e) => {
    console.log(e);
  });
  socket.on(O.ADDED_TO_CHAT, (chat) => {
    store.dispatch(addChat(chat));
  });
  socket.on(O.MESSAGE_ARRIVED, (notification) => {
    const currentOpenChat = store.getState().openChat.chat;
    if (currentOpenChat && currentOpenChat.id === notification.chatId) {
      store.dispatch(addOpenMessages([notification.message]));
    } else {
      store.dispatch(addMessageNotifications([notification]));
    }
  });
};

export const PromisedSocketCall = (CODE: string, params: any) => {
  return new Promise((resolve, reject) => {
    if (beepSocket) {
      beepSocket.on(CODE + "RES", (result) => {
        resolve(result);
      });
      beepSocket.on(CODE + "ERR", (result) => {
        reject(result);
      });
      beepSocket.emit(CODE, params);
    } else {
      reject("connection failed");
    }
  });
};

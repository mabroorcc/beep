import { Socket } from "socket.io-client";
import { O } from "../O";
import { store } from "../../app/store";
import {
  addChat,
  removeChat,
  setChats,
  updateChangedChatName,
} from "../Chats/chatsSlice";
import { addMessageNotifications } from "../MessageNotifications/messageNotificationSlice";
import {
  addOpenMessages,
  deleteMessage,
  clearOpenChat,
} from "../OpenedChatPane/openChatSlice";
import {
  goToNewChatPane,
  goToOpenedChatPane,
} from "../RightHomeSidePanes/paneSlice";

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

  socket.on(O.DELETE_MESSAGE_NOTIFICATION, (messageId: number) => {
    store.dispatch(deleteMessage(messageId));
  });

  socket.on(O.CHAT_NAME_CHANGED, ({ chatId, name }) => {
    const currentOpenChat = store.getState().openChat.chat;
    if (currentOpenChat && currentOpenChat.id === chatId) refreshOpenedChat();
    store.dispatch(updateChangedChatName({ chatId, name }));
  });

  socket.on(O.CHAT_DESTROYED, (chatId: string) => {
    const currentOpenChat = store.getState().openChat.chat;
    if (currentOpenChat && currentOpenChat.id === chatId) {
      store.dispatch(goToNewChatPane());
    }
    store.dispatch(removeChat({ id: chatId }));
  });

  // this will update openedChatMemberManipulation
  socket.on(O.ADD_MEMBER_TO_CHAT + "UPDATE", ({ chatId }) => {
    const currentOpenChat = store.getState().openChat.chat;
    if (!currentOpenChat) return;

    if (currentOpenChat.id === chatId) refreshOpenedChat();
  });

  // this will update openedChatMemberManipulation
  socket.on(O.NOTIFY_MEMBER_REMOVED_FROM_CHAT, ({ chatId, memberId }) => {
    const currentOpenChat = store.getState().openChat.chat;
    const currentUser = store.getState().user.user;
    if (!currentUser) return;
    if (!currentOpenChat) return;

    if (currentUser.id === memberId) {
      store.dispatch(removeChat({ id: chatId }));
      if (currentOpenChat.id === chatId) {
        store.dispatch(goToNewChatPane());
      }
      return;
    }

    if (currentOpenChat.id === chatId) refreshOpenedChat();
  });
};

const refreshOpenedChat = () => {
  const currentOpenChat = store.getState().openChat.chat;
  if (!currentOpenChat) return;
  const chat = { ...currentOpenChat };
  store.dispatch(clearOpenChat());
  store.dispatch(goToOpenedChatPane(chat));
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

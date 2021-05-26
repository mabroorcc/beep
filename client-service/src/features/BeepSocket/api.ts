import { Socket } from "socket.io-client";
import { O } from "../O";
import { store } from "../../app/store";
import { addChat, setChats } from "../Chats/chatsSlice";

export const injectApi = (socket: Socket) => {
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
};

import { Socket } from "socket.io";
import { Chats } from "../chats/chat.entity";
import { ChatsService } from "../chats/chat.service";
import { MemberService } from "../members/members.service";
import { MessageService } from "../messages/messages.service";
import {
  NotificationService,
  connections,
} from "../notifications/notification.service";
import { O } from "../opcodes";

export const InjectApiTo = (socket: Socket) => {
  const thisUserId = socket.handshake.auth.user.id as string;

  connections.set(thisUserId, socket);

  socket.on("disconnect", () => {
    connections.delete(thisUserId);
  });

  socket.on(O.CREATE_CHAT, async ({ ownerId, name, picture }) => {
    if (!ownerId || !name || !picture) {
      return socket.emit(O.CREATE_CHAT + "ERR", "Invalid Params");
    }
    try {
      const chat = await ChatsService.createChat(ownerId, name, picture);
      await MemberService.addMemberToChat(ownerId, chat.id);
      socket.emit(O.CREATE_CHAT + "RES", chat);
    } catch (e) {
      socket.emit(O.CREATE_CHAT + "ERR", e.message);
    }
  });

  socket.on(O.CHECK_IF_MEMBER_ONLINE, ({ memberId }, fn) => {
    if (!memberId) return fn("no member id found");
    const mem = connections.get(memberId);
    if (mem) {
      return fn(true);
    } else {
      fn(false);
    }
  });

  socket.on(O.GET_ALL_MY_CHATS, async () => {
    try {
      const memberShips = await MemberService.getAllTheMemberShips(thisUserId);
      const chats: Chats[] = [];
      for (let mem of memberShips) {
        const chat = await ChatsService.getOneById(mem.chatId);
        if (chat) chats.push(chat);
      }
      socket.emit(O.GET_ALL_MY_CHATS + "RES", chats);
    } catch (e) {
      socket.emit(O.GET_ALL_MY_CHATS + "ERR", e);
    }
  });

  socket.on(O.ADD_MEMBER_TO_CHAT, async ({ chatId, memberId }) => {
    try {
      if (!chatId || !memberId) {
        return socket.emit(O.ADD_MEMBER_TO_CHAT + "ERR", "Invalid params");
      }
      await MemberService.addMemberToChat(memberId, chatId);
      NotificationService.notifyAddedToChat(memberId, chatId);
      socket.emit(O.ADD_MEMBER_TO_CHAT + "RES", "added");
    } catch (e) {
      return socket.emit(O.ADD_MEMBER_TO_CHAT + "ERR", e.message);
    }
  });

  socket.on(O.GET_ALL_MEMBERS_OF_CHAT, async ({ chatId }) => {
    if (!chatId) {
      return socket.emit(O.GET_ALL_MEMBERS_OF_CHAT + "ERR", "Invalid params!");
    }
    try {
      const members = await MemberService.getAllTheMembersOfTheChat(chatId);
      socket.emit(O.GET_ALL_MEMBERS_OF_CHAT + "RES", members);
    } catch (e) {
      socket.emit(O.GET_ALL_MEMBERS_OF_CHAT + "ERR", e.message);
    }
  });

  socket.on(O.GET_MESSAGES_OF_CHAT, async ({ chatId, offset }, fn) => {
    if (!chatId) return fn(false);
    try {
      const messages = await MessageService.getMessagesOfChat(
        chatId,
        offset ? offset : 0
      );
      fn(messages);
    } catch (e) {
      fn(e);
    }
  });

  socket.on(O.SEND_MESSAGE, async ({ message, chatId }, fn) => {
    try {
      const msg = await MessageService.sendMessageToChat(
        message,
        chatId,
        thisUserId
      );
      NotificationService.notifyMessageCame(chatId, msg);
      fn("sent");
    } catch (e) {
      fn(e);
    }
  });
};

import { Socket } from "socket.io";
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

  socket.on(O.CREATE_CHAT, async ({ ownerId, name, picture }, fn) => {
    if (!ownerId || !name || !picture) return fn("invalid params");
    try {
      const chat = await ChatsService.createChat(ownerId, name, picture);
      fn(chat);
    } catch (e) {
      fn(e);
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

  socket.on(O.GET_ALL_MY_CHATS, async (fn) => {
    try {
      const chats = await ChatsService.getAllChats(thisUserId);
      fn(chats);
    } catch (e) {
      fn(e);
    }
  });

  socket.on(O.ADD_MEMBER_TO_CHAT, async ({ chatId, memberId }, fn) => {
    try {
      if (!chatId || !memberId) return fn(false);
      await MemberService.addMemberToChat(memberId, chatId);
      fn("added");
    } catch (e) {
      fn(e);
    }
  });

  socket.on(O.GET_ALL_MEMBERS_OF_CHAT, async ({ chatId }, fn) => {
    if (!chatId) return fn(false);
    try {
      const members = MemberService.getAllTheMembersOfTheChat(chatId);
      fn(members);
    } catch (e) {
      fn(e);
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

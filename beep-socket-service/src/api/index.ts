import { Socket } from "socket.io";
import { Chats } from "../chats/chat.entity";
import { ChatsService } from "../chats/chat.service";
import { MemberService } from "../members/members.service";
import { MessageService } from "../messages/messages.service";
import {
  NotificationService,
  connections,
  notifications,
} from "../notifications/notification.service";
import { O } from "../opcodes";

export const InjectApiTo = (socket: Socket) => {
  const thisUserId = socket.handshake.auth.user.id as string;

  connections.set(thisUserId, socket);

  socket.on("disconnect", () => {
    connections.delete(thisUserId);
  });

  socket.on(O.CONNECT, () => {
    connections.set(thisUserId, socket);
  });

  socket.on(O.DISCONNECT, () => {
    connections.delete(thisUserId);
  });

  // sending all the notifications for that user as he gets online
  const notifs = notifications.get(thisUserId);
  if (notifs) {
    notifs.forEach((notif) => {
      socket.emit(notif.title, notif.data);
    });
  }
  // clearing notifications
  notifications.delete(thisUserId);

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

  socket.on(O.REMOVE_MEMBER_FROM_CHAT, async ({ memberId, chatId }) => {
    try {
      if (!memberId || !chatId) throw new Error("Invalid Params!");
      await MemberService.removeMemberFromChat(memberId, chatId);
      return socket.emit(O.REMOVE_MEMBER_FROM_CHAT + "RES", true);
    } catch (e) {
      return socket.emit(O.REMOVE_MEMBER_FROM_CHAT + "ERR", e.message);
    }
  });

  socket.on(O.DELETE_MESSAGE, async ({ messageId }) => {
    try {
      if (!messageId) throw new Error("Invalid Params");
      const result = await MessageService.deleteMessage(messageId, thisUserId);
      if (result.message) {
        NotificationService.notifyDeletedMessage(
          messageId,
          result.message.chatId
        );
      }
      return socket.emit(O.DELETE_MESSAGE + "RES", result.res);
    } catch (e) {
      return socket.emit(O.DELETE_MESSAGE + "ERR", e.message);
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
      if (!chatId || !memberId) throw new Error("Invalid params!");
      await MemberService.addMemberToChat(memberId, chatId);
      NotificationService.notifyAddedToChat(memberId, chatId);
      socket.emit(O.ADD_MEMBER_TO_CHAT + "RES", "added");
    } catch (e) {
      return socket.emit(O.ADD_MEMBER_TO_CHAT + "ERR", e.message);
    }
  });

  socket.on(O.GET_ALL_MEMBERS_OF_CHAT, async ({ chatId }) => {
    try {
      if (!chatId) throw new Error("Invalid params!");
      const members = await MemberService.getAllTheMembersOfTheChat(chatId);
      socket.emit(O.GET_ALL_MEMBERS_OF_CHAT + "RES", members);
    } catch (e) {
      socket.emit(O.GET_ALL_MEMBERS_OF_CHAT + "ERR", e.message);
    }
  });

  socket.on(O.GET_ONLINE_MEMBERS_OF_CHAT, async ({ chatId }) => {
    try {
      if (!chatId) throw new Error("Invalid Params");
      const members = await MemberService.getAllTheMembersOfTheChat(chatId);
      const users = [];
      for (let mem of members) {
        const user = connections.get(mem.memberId);
        if (user) {
          users.push(user.handshake.auth.user);
        }
      }
      socket.emit(O.GET_ONLINE_MEMBERS_OF_CHAT + "RES", users);
    } catch (e) {
      socket.emit(O.GET_ONLINE_MEMBERS_OF_CHAT + "ERR", e.message);
    }
  });

  socket.on(O.GET_MESSAGES_OF_CHAT, async ({ chatId, offset }) => {
    try {
      if (!chatId) throw new Error("Invalid Params!");
      const messages = await MessageService.getMessagesOfChat(
        chatId,
        offset ? offset : 0
      );
      socket.emit(O.GET_MESSAGES_OF_CHAT + "RES", messages);
    } catch (e) {
      socket.emit(O.GET_MESSAGES_OF_CHAT + "ERR", e.message);
    }
  });

  socket.on(
    O.SEND_MESSAGE,
    async ({ message, chatId, attachment, attType }) => {
      try {
        if (!message || !chatId) throw new Error("Invalid params!");
        const msg = await MessageService.sendMessageToChat(
          message,
          chatId,
          thisUserId,
          attachment,
          attType
        );
        socket.emit(O.SEND_MESSAGE + "RES", msg);
        NotificationService.notifyMessageCame(chatId, msg);
      } catch (e) {
        socket.emit(O.SEND_MESSAGE + "ERR", e.message);
      }
    }
  );

  socket.on(O.CHANGE_CHAT_NAME, async ({ chatId, name }) => {
    try {
      if (!chatId || !name) throw new Error("Invalid Params!");
      const result = await ChatsService.changeChatName(chatId, name);

      if (result === "no chat found with this id") {
        throw new Error("no chat found with this id");
      }
      socket.emit(O.CHANGE_CHAT_NAME + "RES", result);
      NotificationService.notifyChatNameChanged(chatId, result.name);
    } catch (e) {
      socket.emit(O.CHANGE_CHAT_NAME + "ERR", e.message);
    }
  });
  socket.on(O.DESTROY_CHAT, async ({ chatId }) => {
    try {
      if (!chatId) throw new Error("Invalid Params!");
      await ChatsService.destroyChat(chatId);
      socket.emit(O.DESTROY_CHAT + "RES", "DONE");
      NotificationService.notifyChatDestroyed(chatId);
    } catch (e) {
      socket.emit(O.DESTROY_CHAT + "ERR", e.message);
    }
  });
};

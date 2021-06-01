import { MemberService } from "../members/members.service";
import { Messages } from "../messages/messages.entity";
import { Socket } from "socket.io";
import { O } from "../opcodes";
import { ChatsService } from "../chats/chat.service";

interface Notification {
  title: string;
  data: any;
}

export const connections: Map<string, Socket> = new Map();
export const notifications: Map<string, Notification[]> = new Map();

export const NotificationService = {
  notifyAddedToChat: (idOfMember: string, chatId: string) => {
    const mem = connections.get(idOfMember);
    if (mem) {
      ChatsService.getOneById(chatId)
        .then((chat) => {
          mem.emit(O.ADDED_TO_CHAT, chat);
        })
        .catch((e) => console.log("from Notifaction", e.message));
    }
  },
  notifyMessageCame: async (chatId: string, message: Messages) => {
    const members = await MemberService.getAllTheMembersOfTheChat(chatId);

    members.forEach((member) => {
      if (member.memberId === message.senderId) return;
      const mem = connections.get(member.memberId);
      const sender = connections.get(message.senderId);

      if (mem) {
        mem.emit(O.MESSAGE_ARRIVED, { message, chatId });
        if (sender) sender.emit(O.NOTIFIED_MESSAGE, message.id);
      } else {
        // here member is not online so store the notification
        let memberNotificatons = notifications.get(member.memberId);
        if (memberNotificatons === undefined) memberNotificatons = [];
        memberNotificatons.push({ title: O.MESSAGE_ARRIVED, data: message });
        notifications.set(member.memberId, memberNotificatons);
      }
    });
  },
  notifyDeletedMessage: async (messageId: number, chatId: string) => {
    const members = await MemberService.getAllTheMembersOfTheChat(chatId);
    members.forEach((member) => {
      const memSocket = connections.get(member.memberId);
      if (memSocket) {
        memSocket.emit(O.DELETE_MESSAGE_NOTIFICATION, messageId);
      }
    });
  },
  notifyTypingMessageToChat: async (chatId: string, typerId: string) => {
    const memebers = await MemberService.getAllTheMembersOfTheChat(chatId);
    memebers.forEach((member) => {
      if (member.memberId === typerId) return;
      const mem = connections.get(member.memberId);
      if (mem) {
        mem.emit(O.MEMBER_TYPING_MESSAGE_IN_CHAT, typerId);
      }
    });
  },
  sendPendingNotifications: (userId: string) => {
    const user = connections.get(userId);
    if (user) {
      const pendingNotifications = notifications.get(userId);
      if (pendingNotifications) {
        pendingNotifications.forEach((notification) => {
          user.emit(notification.title, notification.data);
        });
      }
    }
  },
};

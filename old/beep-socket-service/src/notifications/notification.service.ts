import { MemberService } from "../members/members.service";
import { Messages } from "../messages/messages.entity";
import { Socket } from "socket.io";
import { O } from "../opcodes";
import { ChatsService } from "../chats/chat.service";
import { Members } from "../members/members.entity";
import { Chats } from "../chats/chat.entity";

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
    BroadCast(chatId, (socket) => {
      socket.emit(O.DELETE_MESSAGE_NOTIFICATION, messageId);
    });
  },
  notifyTypingMessageToChat: async (chatId: string, typerId: string) => {
    BroadCast(chatId, (socket, mem) => {
      if (mem.memberId === typerId) return;
      socket.emit(O.MEMBER_TYPING_MESSAGE_IN_CHAT, typerId);
    });
  },
  notifyChatNameChanged: async (chatId: string, name: string) => {
    BroadCast(chatId, (socket) => {
      socket.emit(O.CHAT_NAME_CHANGED, { chatId, name });
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
      notifications.delete(userId);
    }
  },
  notifyChatDestroyed: async (chatId: string) => {
    BroadCast(chatId, (socket) => {
      socket.emit(O.CHAT_DESTROYED, chatId);
    });
  },
  notifyMemberDeleted: async (chatId: string, memberId: string) => {
    BroadCast(chatId, (socket) => {
      socket.emit(O.NOTIFY_MEMBER_REMOVED_FROM_CHAT, { chatId, memberId });
    });
  },
  notifyChatPictureChanged: async (chat: Chats) => {
    BroadCast(chat.id, (socket) => {
      socket.emit(O.CHAT_PICTURE_CHANGED, chat);
    });
  },
  notifyMemberGotOnline: async (memberId: string) => {
    const memberships = await MemberService.getAllTheMemberShips(memberId);
    memberships.forEach((memship) => {
      BroadCast(memship.chatId, (socket) => {
        socket.emit(O.MEMBER_GOT_ONLINE, {
          chatId: memship.chatId,
          memberId: memship.memberId,
        });
      });
    });
  },
  notifyMemberGotOffline: async (memberId: string) => {
    const memberships = await MemberService.getAllTheMemberShips(memberId);
    memberships.forEach((memship) => {
      BroadCast(memship.chatId, (socket) => {
        socket.emit(O.MEMBER_GOT_OFFLINE, {
          chatId: memship.chatId,
          memberId: memship.memberId,
        });
      });
    });
  },
};

const BroadCast = async (
  chatId: string,
  callBack: (socket: Socket, member: Members) => void
) => {
  const members = await MemberService.getAllTheMembersOfTheChat(chatId);
  members.forEach((mem) => {
    const socket = connections.get(mem.memberId);
    if (socket) {
      callBack(socket, mem);
    }
  });
};

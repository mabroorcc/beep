import { getManager } from "typeorm";
import { Messages } from "./messages.entity";

export const MessageService = {
  sendMessageToChat: (
    messageText: string,
    chatId: string,
    senderId: string,
    attachment?: string,
    attType?: "image" | "file" | "none"
  ) => {
    const message = new Messages();
    message.chatId = chatId;
    message.message = messageText;
    message.senderId = senderId;
    message.seenBy = senderId;
    message.attachment = attachment ? attachment : "none";
    message.attType = attType ? attType : "none";
    return message.save();
  },
  getMessagesOfChat: (chatId: string, offset: number) => {
    return getManager()
      .createQueryBuilder(Messages, "messages")
      .where("messages.chatId = :chatId", { chatId })
      .orderBy("messages.id", "DESC")
      .offset(offset)
      .limit(100)
      .getMany();
  },
  seenMessage: async (whoId: string, id: number) => {
    const message = await Messages.findOne({ id });
    if (!message) return "No message found!";
    if (message.seenBy.indexOf(whoId) === -1) {
      message.seenBy += `[${whoId}],`;
    }
    return message.save();
  },
  deleteMessage: async (messageId: number, senderId: string) => {
    const message = await Messages.findOne({ id: messageId });

    if (!message) return { res: "message not found", message: null };

    if (message.senderId === senderId) {
      await Messages.delete({ id: messageId });
      return { res: "deleted", message };
    } else {
      return { res: "sender mismatch", message: null };
    }
  },
};

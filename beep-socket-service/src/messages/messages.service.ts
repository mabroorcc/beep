import { Messages } from "./messages.entity";

export const MessageService = {
  sendMessageToChat: (
    messageText: string,
    chatId: string,
    senderId: string
  ) => {
    const message = new Messages();
    message.chatId = chatId;
    message.message = messageText;
    message.senderId = senderId;
    message.seenBy = senderId;
    return message.save();
  },
  getMessagesOfChat: (chatId: string, offset: number) => {
    return Messages.getRepository()
      .createQueryBuilder()
      .select("messages")
      .where("messages.chatId = :chatId", { chatId })
      .orderBy("messages.id", "DESC")
      .offset(offset)
      .getMany();
  },
  seenMessage: async (whoId: string, id: number) => {
    const message = await Messages.findOne({ id });
    if (!message) return "No message found!";
    if (message.seenBy.indexOf(whoId) === -1) {
      message.seenBy += whoId;
    }
    return message.save();
  },
  deleteMessage: async (messageId: number, senderId: string) => {
    const message = await Messages.findOne({ id: messageId });

    if (!message) return "message not found";

    if (message.senderId === senderId) {
      return Messages.delete({ id: messageId });
    } else {
      return "sender mismatch";
    }
  },
};

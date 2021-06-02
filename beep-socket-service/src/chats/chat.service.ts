import { Chats } from "./chat.entity";

export const ChatsService = {
  createChat: (ownerId: string, name: string, picture: string) => {
    const chat = new Chats();
    chat.name = name;
    chat.ownerId = ownerId;
    chat.picture = picture;
    return chat.save();
  },
  getOneById: (id: string) => {
    return Chats.findOne({ id });
  },
  getAllChats: (ownerId: string) => {
    return Chats.find({ ownerId });
  },
  changeChatName: async (chatId: string, name: string) => {
    const chat = await Chats.findOne({ id: chatId });
    if (!chat) return "no chat found with this id";
    chat.name = name;
    return chat.save();
  },
  destroyChat: (chatId: string) => {
    return Chats.delete({ id: chatId });
  },
};

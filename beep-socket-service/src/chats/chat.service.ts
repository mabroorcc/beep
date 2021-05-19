import { Chats } from "./chat.entity";

export const ChatsService = {
  createChat: (ownerId: string, name: string) => {
    const chat = new Chats();
    chat.name = name;
    chat.ownerId = ownerId;
    return chat.save();
  },
  getAllChats: (ownerId: string) => {
    return Chats.find({ ownerId });
  },
};

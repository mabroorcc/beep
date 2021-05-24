import { Chats } from "./chat.entity";

export const ChatsService = {
  createChat: (ownerId: string, name: string, picture: string) => {
    const chat = new Chats();
    chat.name = name;
    chat.ownerId = ownerId;
    chat.picture = picture;
    return chat.save();
  },
  getAllChats: (ownerId: string) => {
    return Chats.find({ ownerId });
  },
};

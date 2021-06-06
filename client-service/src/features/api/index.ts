import { O } from "../O";
import { PromisedSocketCall } from "../BeepSocket/api";
import { jsonReq } from "../JSON";
import { TUser } from "../user/types";
import { Message } from "../OpenedChatPane/openChatSlice";

export const getMembersOfTheChat = async (id: string) => {
  const members: any = await PromisedSocketCall(O.GET_ALL_MEMBERS_OF_CHAT, {
    chatId: id,
  });
  let users = [];
  for (let member of members) {
    const user = await getOneUserWithId(member.memberId);
    if (user) {
      users.push(user);
    }
  }
  return users as TUser[];
};

export const getOnlineMembersOfTheChat = async (id: string) => {
  const members: any = await PromisedSocketCall(O.GET_ONLINE_MEMBERS_OF_CHAT, {
    chatId: id,
  });
  return members as TUser[];
};

export const getUsersWithUserName = async (userName: string) => {
  const response = await jsonReq(
    `http://localhost:4000/auth/users/find/username/${userName}`,
    "get",
    null
  );
  if (response.ok) {
    const { payload } = await response.json();
    return payload.users;
  } else {
    return false;
  }
};

export const logout = async () => {
  const response = await jsonReq("http://localhost:4000/auth/a/signout");
  if (response.ok) return true;
  return false;
};

export const getOneUserWithId = async (id: string) => {
  const response = await jsonReq(
    "http://localhost:4000/auth/users/find/user/" + id,
    "get"
  );
  if (response.ok) {
    const { payload } = await response.json();
    return payload.user;
  } else {
    return false;
  }
};

export const getMessagesOfChat = async (chatId: string, offset?: number) => {
  const messages = await PromisedSocketCall(O.GET_MESSAGES_OF_CHAT, {
    chatId,
    offset,
  });
  return messages as Message[];
};

interface SendMessageParams {
  message: string;
  chatId: string;
  attachment?: string;
  attType?: string;
}
export const sendMessageInChat = async (params: SendMessageParams) => {
  const msg = await PromisedSocketCall(O.SEND_MESSAGE, params);
  return msg as Message;
};

export const deleteMessageFromChat = async (messageId: number) => {
  return PromisedSocketCall(O.DELETE_MESSAGE, { messageId });
};

export const connectToServer = () => {
  return PromisedSocketCall(O.CONNECT, null);
};

export const disconnectServer = () => {
  return PromisedSocketCall(O.DISCONNECT, null);
};

export const changeChatName = (chatId: string, name: string) => {
  return PromisedSocketCall(O.CHANGE_CHAT_NAME, { chatId, name });
};

export const destroyChat = (chatId: string) => {
  return PromisedSocketCall(O.DESTROY_CHAT, { chatId });
};

export const deleteMemberFromChat = (chatId: string, memberId: string) => {
  return PromisedSocketCall(O.DELETE_MEMBER_FROM_CHAT, { chatId, memberId });
};

export const addThisMemberToChat = (chatId: string, memberId: string) => {
  return PromisedSocketCall(O.ADD_MEMBER_TO_CHAT, { chatId, memberId });
};
export const changeChatPicture = (chatId: string, picture: string) => {
  return PromisedSocketCall(O.CHANGE_CHAT_PICTURE, { chatId, picture });
};
export const checkIfMemberOnline = (memberId: string) => {
  return PromisedSocketCall(O.CHECK_IF_MEMBER_ONLINE, { memberId });
};

export const getUserPeerId = (userId: string) => {
  return PromisedSocketCall(O.GET_USER_PEER_ID, { userId });
};

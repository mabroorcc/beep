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

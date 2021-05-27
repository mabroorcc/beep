import { O } from "../O";
import { PromisedSocketCall } from "../BeepSocket/api";
import { jsonReq } from "../JSON";
import { TUser } from "../user/types";

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

import { useContext, useState } from "react";
import { jsonReq } from "../JSON";
import { TUser } from "../user/types";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { goToNewChatPane } from "../RightHomeSidePanes/paneSlice";
import { PromisedFileUpload } from "../FileUpload/promisedCall";
import { selectUser } from "../user/userSlice";
import { BeepSocket } from "../BeepSocket";
import { O } from "../O";
import { addChat } from "../Chats/chatsSlice";

export const useAddChatPane = () => {
  const dispatch = useAppDispatch();
  const beepSocket = useContext(BeepSocket);
  const [chatname, setChatName] = useState("");
  const [image, setImage] = useState("http://picsum.photos/400/400");
  const [blobImage, setBlobImage] = useState<Blob>();
  const [userResults, setUserResults] = useState<TUser[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<TUser[]>([]);
  const user = useAppSelector(selectUser);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const userName = e.target.value;
    if (userName.length < 7) return;
    const response = await searchUsersWithUserName(userName);
    if (response.ok) {
      const { payload } = await response.json();
      setUserResults(payload.users as TUser[]);
    }
  };

  const searchUsersWithUserName = async (userName: string) => {
    return jsonReq(
      `http://localhost:4000/auth/users/find/username/${userName}`,
      "get",
      null
    );
  };

  const onAddMemberHandler = (member: TUser) => {
    if (user && member.id === user.id) return setUserResults([]);
    for (let suser of selectedUsers) {
      if (suser.id === member.id) {
        return setUserResults(
          userResults.filter((user) => user.id !== member.id)
        );
      }
    }
    setSelectedUsers([...selectedUsers, member]);
    setUserResults([]);
  };

  const handleDeleteSelected = (user: TUser) => {
    setSelectedUsers(selectedUsers.filter((suser) => suser.id === user.id));
  };

  const createChat = async () => {
    if (!user) return;
    let url: string = "";
    if (blobImage) {
      url = await PromisedFileUpload("chat-picture", blobImage);
    } else {
      url = "http://picsum.photos/400/400";
    }
    const chat = await createChatRequest(user.id, chatname, url);
    if (chat.id) {
      addMembersToChat(chat);
    }
  };

  const createChatRequest = (
    ownerId: string,
    name: string,
    picture: string
  ) => {
    return PromisedSocketCall(O.CREATE_CHAT, {
      ownerId,
      name,
      picture,
    });
  };

  const addMembersToChat = async (chat: any) => {
    for (let member of selectedUsers) {
      await addThisMemberToChat(chat.id, member.id);
      if (member.id === selectedUsers[selectedUsers.length - 1].id) {
        dispatch(addChat(chat));
        dispatch(goToNewChatPane());
      }
    }
  };

  const addThisMemberToChat = (chatId: string, memberId: string) => {
    return PromisedSocketCall(O.ADD_MEMBER_TO_CHAT, { chatId, memberId });
  };

  const PromisedSocketCall = async (
    CODE: string,
    params: any
  ): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (!beepSocket) return reject("beep socket undefined");
      beepSocket.on(CODE + "RES", (res: any) => {
        resolve(res);
      });
      beepSocket.on(CODE + "ERR", (err: any) => {
        reject(err);
      });
      beepSocket.emit(CODE, params);
    });
  };

  const handleDoneBtn = () => {
    createChat();
  };

  const handleCancelBtn = () => {
    dispatch(goToNewChatPane());
  };

  return {
    image,
    setBlobImage,
    chatname,
    setChatName,
    selectedUsers,
    handleSearch,
    userResults,
    handleCancelBtn,
    handleDoneBtn,
    handleDeleteSelected,
    setImage,
    onAddMemberHandler,
  };
};

import { useContext, useState } from "react";
import { TUser } from "../user/types";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { goToNewChatPane } from "../RightHomeSidePanes/paneSlice";
import { PromisedFileUpload } from "../FileUpload/promisedCall";
import { selectUser } from "../user/userSlice";
import { BeepSocket } from "../BeepSocket";
import { O } from "../O";
import { addChat } from "../Chats/chatsSlice";
import { getUsersWithUserName, addThisMemberToChat } from "../api";
import { ENV } from "../../env";

export const useAddChatPane = () => {
  const dispatch = useAppDispatch();
  const beepSocket = useContext(BeepSocket);
  const [chatname, setChatName] = useState("");
  const [image, setImage] = useState(ENV.DEFAULT_CHAT_IMAGE_URL);
  const [blobImage, setBlobImage] = useState<Blob>();
  const [userResults, setUserResults] = useState<TUser[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<TUser[]>([]);
  const user = useAppSelector(selectUser);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const userName = e.target.value;
    if (userName.length < 7) return;
    const users = await getUsersWithUserName(userName);
    if (users) {
      setUserResults(users as TUser[]);
    }
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
    setSelectedUsers(selectedUsers.filter((suser) => suser.id !== user.id));
  };

  const createChat = async () => {
    if (!user) return;
    let url: string = "";
    if (blobImage) {
      url = await PromisedFileUpload("chat-picture", blobImage);
    } else {
      url = ENV.DEFAULT_CHAT_IMAGE_URL;
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

import { useContext, useState } from "react";
import { jsonReq } from "../JSON";
import { TUser } from "../user/types";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { goToNewChatPane } from "../RightHomeSidePanes/paneSlice";
import { PromisedFileUpload } from "../FileUpload/promisedCall";
import { selectUser } from "../user/userSlice";
import { BeepSocket } from "../BeepSocket";
import { O } from "../O";

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
    console.log(selectedUsers);
  };

  const createChat = async () => {
    if (!user) return;
    if (blobImage) {
      PromisedFileUpload("chat-picture", blobImage)
        .then((url) => {
          return PromisedSocketCall(O.CREATE_CHAT, {
            ownerId: user.id,
            name: chatname,
            picture: url,
          });
        })
        .then((chat) => {
          if (chat.id) {
            console.log("from useAddChat/createChat", chat);
            addMembersToChat(chat);
            dispatch(goToNewChatPane());
          }
        })
        .catch(() => console.log("error fileupload creatChat"));
    } else {
      PromisedSocketCall(O.CREATE_CHAT, {
        ownerId: user.id,
        name: chatname,
        picture: image,
      })
        .then((chat) => {
          if (chat.id) {
            addMembersToChat(chat.id);
          }
          console.log("TODO-createchat/: change to the added chat later");
          dispatch(goToNewChatPane());
        })
        .catch(() => {
          dispatch(goToNewChatPane());
          console.log("err at promisedcall/createchat");
        });
    }
  };

  const addMembersToChat = (chatId: string) => {
    for (let member of selectedUsers) {
      addThisMemberToChat(chatId, member.id)
        .then(() => console.log("added " + member.id + " to chat " + chatId))
        .catch(() =>
          console.log("failed to add member " + member.id + " to chat")
        );
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
      if (beepSocket) {
        beepSocket.emit(CODE, params, (response: any) => {
          if (response === false) {
            reject(false);
          } else {
            resolve(response);
          }
        });
      } else {
        reject(false);
      }
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

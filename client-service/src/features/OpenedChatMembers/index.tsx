import AvatarGroup from "@material-ui/lab/AvatarGroup";
import { useEffect, useState } from "react";
import { getOnlineMembersOfTheChat } from "../api";
import { chat } from "../Chats/chatsSlice";
import { BadgeAvatar } from "../OnlineAvatar";
import { TUser } from "../user/types";

export interface Props {
  chat: chat;
}

export const OpenedChatMembers: React.FC<Props> = ({ chat }) => {
  const [members, setMembers] = useState<TUser[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const members = await getOnlineMembersOfTheChat(chat.id);
        setMembers(members);
      } catch (e) {
        console.log(e);
      }
    })();
  }, [chat]);

  return (
    <AvatarGroup max={7}>
      {members &&
        members.map((mem) => {
          return <BadgeAvatar key={mem.id} src={mem.picture} />;
        })}
    </AvatarGroup>
  );
};

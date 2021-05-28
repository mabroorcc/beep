import { Avatar, makeStyles } from "@material-ui/core";
import AvatarGroup from "@material-ui/lab/AvatarGroup";
import { useEffect, useState } from "react";
import { getOnlineMembersOfTheChat } from "../api";
import { chat } from "../Chats/chatsSlice";
import { TUser } from "../user/types";

export interface Props {
  chat: chat;
}

export const OpenedChatMembers: React.FC<Props> = ({ chat }) => {
  const [members, setMembers] = useState<TUser[]>([]);
  const classes = useStyles();

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
          return (
            <Avatar
              key={mem.id}
              className={classes.avSmall}
              alt={mem.userName}
              src={mem.picture}
            />
          );
        })}
    </AvatarGroup>
  );
};

const useStyles = makeStyles({
  avSmall: {
    width: "1.5rem",
    height: "1.5rem",
  },
});

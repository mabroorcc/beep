import { makeStyles } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  clearMessageNotification,
  selectMessageNotifications,
} from "../MessageNotifications/messageNotificationSlice";
import { OpenedChatHeader } from "../OpenedChatHeader";
import { OpenedChatMessages } from "../OpenedChatMessages";
import { OpenedChatTextBox } from "../OpenedChatTextBox";
import { selectOpenChat } from "./openChatSlice";
import { getMembersOfTheChat } from "../api";
import { TUser } from "../user/types";

export interface Props {}

export const OpenedChatPane: React.FC<Props> = () => {
  const openChat = useAppSelector(selectOpenChat);
  const classes = useStyles();
  const messageNotifications = useAppSelector(selectMessageNotifications);
  const dispatch = useAppDispatch();
  const [members, setMembers] = useState<TUser[]>([]);

  useEffect(() => {
    if (openChat) {
      messageNotifications.forEach((notif) => {
        if (openChat.id === notif.chatId) {
          dispatch(clearMessageNotification(notif.message.id));
        }
      });
      getMembersOfTheChat(openChat.id)
        .then((members) => {
          setMembers(members);
        })
        .catch((e) => console.log("/OpenChatPane err", e.message));
    }
  }, [openChat, messageNotifications, dispatch]);

  if (!openChat) return <></>;
  return (
    <div className={classes.openedChat}>
      <OpenedChatHeader members={members} chat={openChat} />
      <OpenedChatMessages members={members} chat={openChat} />
      <OpenedChatTextBox chat={openChat} />
    </div>
  );
};

const useStyles = makeStyles({
  openedChat: {
    display: "flex",
    flexDirection: "column",
  },
});

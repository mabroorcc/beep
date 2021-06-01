import { makeStyles } from "@material-ui/core";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { ChatListItem } from "../ChatListItem";
import { chat, selectChats } from "../Chats/chatsSlice";
import { selectMessageNotifications } from "../MessageNotifications/messageNotificationSlice";
import {
  dumpOpenMessages,
  selectOpenChat,
} from "../OpenedChatPane/openChatSlice";
import { goToOpenedChatPane } from "../RightHomeSidePanes/paneSlice";

export interface Props {}

export const ChatsList: React.FC<Props> = () => {
  const classes = useStyles();
  const chats = useAppSelector(selectChats);
  const dispatch = useAppDispatch();
  const messageNotifications = useAppSelector(selectMessageNotifications);
  const openChat = useAppSelector(selectOpenChat);

  const handleChatClick = (chat: chat) => {
    if (openChat && openChat.id === chat.id) return;
    dispatch(dumpOpenMessages());
    dispatch(goToOpenedChatPane(chat));
  };

  const getChatNotificationCount = (chatId: string) => {
    let count = 0;
    messageNotifications.forEach((notif) => {
      if (chatId === notif.chatId) {
        count++;
      }
    });
    return count;
  };

  const getSortedChatsByNotif = (chats: chat[]) => {
    return chats.slice().sort((a, b) => {
      return getChatNotificationCount(b.id) - getChatNotificationCount(a.id);
    });
  };

  return (
    <div className={classes.chatlistmain + " customscroll"}>
      {chats &&
        getSortedChatsByNotif(chats).map((item) => {
          return (
            <ChatListItem key={item.id} chat={item} onClick={handleChatClick} />
          );
        })}
    </div>
  );
};

const useStyles = makeStyles({
  chatlistmain: {
    margin: "0 1rem",
    height: "100%",
    paddingRight: "0.1rem",
    overflowY: "scroll",
  },
});

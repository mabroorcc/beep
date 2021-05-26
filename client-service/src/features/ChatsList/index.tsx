import { makeStyles } from "@material-ui/core";
import { useAppSelector } from "../../app/hooks";
import { ChatListItem } from "../ChatListItem";
import { chat, selectChats } from "../Chats/chatsSlice";

export interface Props {}

export const ChatsList: React.FC<Props> = () => {
  const classes = useStyles();
  const chats = useAppSelector(selectChats);

  const handleChatClick = (chat: chat) => {
    console.log(chat);
  };

  return (
    <div className={classes.chatlistmain}>
      {chats &&
        chats.map((item) => {
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
    paddingRight: "0.5rem",
  },
});

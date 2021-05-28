import { makeStyles } from "@material-ui/core";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getMessagesOfChat } from "../api";
import { chat } from "../Chats/chatsSlice";
import {
  selectOpenMessages,
  dumpOpenMessages,
  addMessagesAtBottom,
} from "../OpenedChatPane/openChatSlice";

export interface Props {
  chat: chat;
}

export const OpenedChatMessages: React.FC<Props> = ({ chat }) => {
  const classes = useStyles();
  const messages = useAppSelector(selectOpenMessages);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(dumpOpenMessages());
    (async () => {
      const result = await getMessagesOfChat(chat.id);
      console.log(result);
      dispatch(addMessagesAtBottom(result));
    })();
  }, [chat, dispatch]);

  return (
    <div className={classes.openchatmessages}>
      {messages &&
        messages.map((item) => {
          return <div key={item.id}>{item.message}</div>;
        })}
    </div>
  );
};

const useStyles = makeStyles({
  openchatmessages: {
    height: "65vh",
    width: "100%",
    marginBottom: "1rem",
  },
});

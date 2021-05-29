import { makeStyles } from "@material-ui/core";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getMessagesOfChat } from "../api";
import { chat } from "../Chats/chatsSlice";
import {
  selectOpenMessages,
  dumpOpenMessages,
  addOpenMessages,
} from "../OpenedChatPane/openChatSlice";
import { OpenMessage } from "../OpenMessage";

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
      dispatch(addOpenMessages(result));
    })();
  }, [chat, dispatch]);

  return (
    <div className={classes.openchatmessages}>
      {messages &&
        messages
          .map((el) => el)
          .reverse()
          .map((item, i, arr) => {
            return (
              <OpenMessage
                last={i === arr.length - 1 ? true : false}
                key={item.id}
                message={item}
              />
            );
          })}
    </div>
  );
};

const useStyles = makeStyles({
  openchatmessages: {
    height: "65vh",
    maxHeight: "65vh",
    overflowY: "scroll",
    width: "100%",
    marginBottom: "1rem",
    paddingRight: "0.5rem",
  },
});

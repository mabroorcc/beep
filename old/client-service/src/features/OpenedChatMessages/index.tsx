import { IconButton, makeStyles } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getMessagesOfChat } from "../api";
import { chat } from "../Chats/chatsSlice";
import {
  selectOpenMessages,
  dumpOpenMessages,
  addOpenMessages,
} from "../OpenedChatPane/openChatSlice";
import { OpenMessage } from "../OpenMessage";
import { TUser } from "../user/types";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";

export interface Props {
  chat: chat;
  members: TUser[];
}

export const OpenedChatMessages: React.FC<Props> = ({ chat, members }) => {
  const classes = useStyles();
  const messages = useAppSelector(selectOpenMessages);
  const [showMoreBtn, setMoreBtn] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(dumpOpenMessages());
    (async () => {
      const result = await getMessagesOfChat(chat.id);
      if (result.length >= 15) {
        setMoreBtn(true);
      } else {
        setMoreBtn(false);
      }
      dispatch(addOpenMessages(result));
    })();
  }, [chat, dispatch]);

  const getSender = (id: string) => {
    for (let mem of members) {
      if (mem.id === id) return mem;
    }
  };

  const handleLoadMore = () => {
    getMessagesOfChat(chat.id, messages.length)
      .then((res) => {
        if (res.length < 15) {
          dispatch(addOpenMessages(res));
          setMoreBtn(false);
          return;
        }
        dispatch(addOpenMessages(res));
      })
      .catch((e) => console.log("/OpenedChatMessages loadmore", e.message));
  };

  return (
    <div className={classes.openchatmessages}>
      {showMoreBtn && (
        <div style={{ textAlign: "center", margin: "1rem 0" }}>
          <IconButton onClick={handleLoadMore}>
            <ArrowDropUpIcon />
          </IconButton>
        </div>
      )}
      {messages &&
        messages.map((item, i, arr) => {
          return (
            <OpenMessage
              sender={getSender(item.senderId)}
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

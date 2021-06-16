import { makeStyles } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../app/hooks";
import { getMemberDetails } from "../api";
import { chat } from "../Chats/chatsSlice";
import { jsonReq } from "../JSON";
import { selectMessageNotifications } from "../MessageNotifications/messageNotificationSlice";
import { selectOpenChat } from "../OpenedChatPane/openChatSlice";

export interface Props {
  chat: chat;
  onClick: (chat: chat) => void;
}

export const ChatListItem: React.FC<Props> = ({ chat, onClick }) => {
  const classes = useStyles();
  const [owner, setOwner] = useState<any>();

  const messageNotifications = useAppSelector(selectMessageNotifications);
  const openChat = useAppSelector(selectOpenChat);

  const getChatNotificationCount = (chatId: string) => {
    let count = 0;
    messageNotifications.forEach((notif) => {
      if (chatId === notif.chatId) {
        count++;
      }
    });
    return count;
  };

  useEffect(() => {
    getMemberDetails(chat.ownerId)
      .then((res) => res.json())
      .then((result) => {
        setOwner(result.payload.user);
      })
      .catch(() => console.log("failed to get the owner data /ChatListItem"));
  }, [chat]);

  const getLimitedString = (str: string, len: number) => {
    if (str.length > len) {
      return str.slice(0, len - 3) + "...";
    } else {
      return str;
    }
  };

  const isOpen = () => {
    if (!openChat) return false;
    if (openChat.id === chat.id) return true;
    return false;
  };

  return (
    <div
      onClick={() => onClick(chat)}
      style={{ backgroundColor: isOpen() ? "#191720" : "transparent" }}
      className={classes.chatMain}
    >
      <img className={classes.avatar} src={chat.picture} alt="chat picture" />
      <div className={classes.chatdetails}>
        <div className={classes.chatname}>
          {getLimitedString(chat.name, 14)}
        </div>
        {owner && owner.userName && (
          <div className={classes.owner}>
            &#128081; @{getLimitedString(owner.userName, 10)}
          </div>
        )}
      </div>
      {getChatNotificationCount(chat.id) > 0 && (
        <div className={classes.notifications}>
          <div className={classes.count}>
            {getChatNotificationCount(chat.id) > 99
              ? "99+"
              : getChatNotificationCount(chat.id)}
          </div>
        </div>
      )}
    </div>
  );
};

const useStyles = makeStyles({
  chatMain: {
    width: "100%",
    height: "4rem",
    marginBottom: "0.5rem",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    padding: "0.7rem",
    borderRadius: "1.1rem",
    transition: "all 0.2s linear",
  },
  avatar: {
    width: "3rem",
    height: "3rem",
    objectFit: "cover",
    borderRadius: "50%",
  },
  chatdetails: {
    marginLeft: "1rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  chatname: {
    fontSize: "1rem",
  },
  owner: {
    fontSize: "0.8rem",
    color: "gray",
  },
  notifications: {
    padding: "2px 6px",
    width: "30px",
    height: "30px",
    backgroundColor: "#f5f5f5",
    borderRadius: "50%",
    marginLeft: "auto",
    fontSize: "0.7rem",
    position: "relative",
  },
  count: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    color: "#333",
  },
});

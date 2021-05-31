import { makeStyles } from "@material-ui/core";
import { useEffect, useRef } from "react";
import { useAppSelector } from "../../app/hooks";
import { Message } from "../OpenedChatPane/openChatSlice";
import { TUser } from "../user/types";
import { selectUser } from "../user/userSlice";
import DescriptionIcon from "@material-ui/icons/Description";

export interface Props {
  message: Message;
  sender: TUser | undefined;
  last?: boolean;
}
export const OpenMessage: React.FC<Props> = ({ message, last, sender }) => {
  const user = useAppSelector(selectUser);
  const msgRef = useRef<HTMLDivElement>(null);
  const classes = useStyles();

  const howMuchTimeAgo = (dt: Date) => {
    const date = new Date(dt);
    const diffInSeconds = (Date.now() - date.getTime()) / 1000;
    const diffInMinutes = diffInSeconds / 60;
    const diffInHours = diffInMinutes / 60;
    const diffInDays = diffInHours / 24;
    if (diffInDays > 1) return `${Math.round(diffInDays)}d ago`;
    if (diffInHours > 1) return `${Math.round(diffInHours)}hrs ago`;
    if (diffInMinutes > 1) return `${Math.round(diffInMinutes)}min ago`;
    return `just now`;
  };

  useEffect(() => {
    if (last) {
      if (msgRef.current) {
        msgRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }
  }, [msgRef]);

  if (!user || !sender) return <></>;

  const isSender = () => {
    if (message.senderId === user.id) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div
      ref={msgRef}
      style={{ justifyContent: isSender() ? "flex-end" : "flex-start" }}
      className={classes.openmessage}
    >
      <div className={classes.body}>
        <div>
          <div>{message.message}</div>
          {message.attType === "image" && (
            <img className={classes.att} src={message.attachment} />
          )}
          {message.attType === "video" && (
            <video controls className={classes.att} src={message.attachment} />
          )}
          {message.attType === "file" && (
            <div className={classes.file}>
              <DescriptionIcon />
              <a
                href={message.attachment}
                style={{ marginLeft: "1rem", color: "white" }}
              >
                download
              </a>
            </div>
          )}
        </div>
        <div className={classes.senderDetails}>
          from "<span style={{ color: "#ccc" }}>{sender.userName}</span>
          "&nbsp;
          <span style={{ color: "#555" }}>{howMuchTimeAgo(message.date)}</span>
        </div>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => {
  return {
    openmessage: {
      marginBottom: "0.5rem",
      overflowX: "hidden",
      display: "flex",
    },
    body: {
      backgroundColor: theme.palette.background.paper,
      color: "#fff",
      padding: "0.5rem 0.8rem",
      borderRadius: "1rem",
      maxWidth: "25rem",
      overflowWrap: "break-word",
    },
    senderDetails: {
      color: "gray",
      fontSize: "0.7rem",
    },
    att: {
      marginTop: "0.5rem",
      maxWidth: "100%",
      height: "auto",
      borderRadius: "0.7rem",
    },
    file: {
      margin: "0.5rem",
      display: "flex",
      width: "100%",
    },
  };
});

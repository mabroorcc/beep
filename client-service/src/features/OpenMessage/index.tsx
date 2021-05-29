import { makeStyles } from "@material-ui/core";
import { useEffect, useRef } from "react";
import { useAppSelector } from "../../app/hooks";
import { Message } from "../OpenedChatPane/openChatSlice";
import { selectUser } from "../user/userSlice";

export interface Props {
  message: Message;
  last?: boolean;
}
export const OpenMessage: React.FC<Props> = ({ message, last }) => {
  const user = useAppSelector(selectUser);
  const msgRef = useRef<HTMLDivElement>(null);
  const classes = useStyles();

  useEffect(() => {
    if (last) {
      if (msgRef.current) {
        msgRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }
  }, [last]);

  if (!user) return <></>;

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
        <div>{message.message}</div>
        {message.attType === "image" && (
          <img className={classes.img} src={message.attachment} />
        )}
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
      color: "#ccc",
      padding: "1rem",
      borderRadius: "1rem",
      maxWidth: "20rem",
      overflowWrap: "break-word",
    },
    img: {
      marginTop: "0.5rem",
      width: "100%",
      height: "auto",
      borderRadius: "0.7rem",
    },
  };
});

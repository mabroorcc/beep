import { makeStyles } from "@material-ui/core";
import { chat } from "../Chats/chatsSlice";
import { OpenedChatMembers } from "../OpenedChatMembers";

export interface Props {
  chat: chat;
}

export const OpenedChatHeader: React.FC<Props> = ({ chat }) => {
  const classes = useStyles();

  return (
    <div className={classes.openchatheader}>
      <img className={classes.avatar} src={chat.picture} />
      <div className={classes.details}>
        <div className={classes.name}>{chat.name}</div>
        <OpenedChatMembers chat={chat} />
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => {
  return {
    openchatheader: {
      width: "100%",
      height: "5rem",
      borderRadius: "2rem",
      backgroundColor: theme.palette.background.paper,
      display: "flex",
      alignItems: "center",
      padding: "1rem",
    },
    avatar: {
      height: "3rem",
      width: "3rem",
      borderRadius: "50%",
      objectFit: "cover",
    },
    details: {
      marginLeft: "1rem",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },
    name: {
      fontSize: "1rem",
    },
  };
});

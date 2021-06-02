import { makeStyles } from "@material-ui/core";
import { AllChatMembersAvatarGroup } from "../AllChatMembersAvatarGroup";
import { chat } from "../Chats/chatsSlice";
import { OpenChatMenu } from "../OpenChatMenu";
import { OpenedChatMembers } from "../OpenedChatMembers";
import { TUser } from "../user/types";

export interface Props {
  chat: chat;
  members: TUser[];
}

export const OpenedChatHeader: React.FC<Props> = ({ chat, members }) => {
  const classes = useStyles();

  return (
    <div className={classes.openchatheader}>
      <img className={classes.avatar} src={chat.picture} />
      <div className={classes.details}>
        <div className={classes.name}>{chat.name}</div>
        <div className={classes.members}>
          <OpenedChatMembers chat={chat} />
          <div style={{ margin: "0 0.5rem" }}>~</div>
          <AllChatMembersAvatarGroup members={members} />
        </div>
      </div>
      <OpenChatMenu chat={chat} members={members} />
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
      marginBottom: "1rem",
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
      justifyContent: "space-between",
    },
    name: {
      fontSize: "1rem",
    },
    members: {
      display: "flex",
    },
  };
});

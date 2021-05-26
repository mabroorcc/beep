import { makeStyles } from "@material-ui/core";
import { useEffect, useState } from "react";
import { chat } from "../Chats/chatsSlice";
import { jsonReq } from "../JSON";

export interface Props {
  chat: chat;
  onClick: (chat: chat) => void;
}

export const ChatListItem: React.FC<Props> = ({ chat, onClick }) => {
  const classes = useStyles();
  const [owner, setOwner] = useState<any>();

  useEffect(() => {
    getMemberDetails(chat.ownerId)
      .then((res) => res.json())
      .then((result) => {
        setOwner(result.payload.user);
      })
      .catch(() => console.log("failed to get the owner data /ChatListItem"));
  }, []);

  return (
    <div onClick={() => onClick(chat)} className={classes.chatMain}>
      <img className={classes.avatar} src={chat.picture} alt="chat picture" />
      <div className={classes.chatdetails}>
        <div className={classes.chatname}>{chat.name}</div>
        {owner && owner.userName && (
          <div className={classes.owner}>By @{owner.userName}</div>
        )}
      </div>
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
    borderRadius: "0.8rem",
    transition: "all 0.2s linear",
    "&:hover": {
      background: "#191720",
    },
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
    color: "#ccc",
  },
});

const getMemberDetails = async (id: string) => {
  return jsonReq("http://localhost:4000/auth/users/find/user/" + id);
};

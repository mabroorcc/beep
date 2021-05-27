import { makeStyles } from "@material-ui/core";
import { ChatsHead } from "../ChatsHead";
import { ChatsList } from "../ChatsList";

export interface Props {}

export const Chats: React.FC<Props> = () => {
  const classes = useStyles();

  return (
    <div id="chats-u-main" className={classes.main}>
      <ChatsHead />
      <ChatsList />
    </div>
  );
};

const useStyles = makeStyles({
  main: {
    width: "100%",
    height: "65vh",
    backgroundColor: "#23212A",
    marginTop: "1rem",
    borderRadius: "2rem",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
});

import { makeStyles } from "@material-ui/core";
import { ChatsHead } from "../ChatsHead";
import { ChatsList } from "../ChatsList";

export interface Props {}

export const Chats: React.FC<Props> = () => {
  const classes = useStyles();

  return (
    <div className={classes.main}>
      <ChatsHead />
      <ChatsList />
    </div>
  );
};

const useStyles = makeStyles({
  main: {
    width: "100%",
    height: "100%",
    backgroundColor: "#23212A",
    marginTop: "1rem",
    borderRadius: "0 2rem 0 0",
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
  },
});

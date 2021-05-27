import { makeStyles } from "@material-ui/core";
import { useAppSelector } from "../../app/hooks";
import { OpenedChatHeader } from "../OpenedChatHeader";
import { selectOpenChat } from "./openChatSlice";

export interface Props {}

export const OpenedChatPane: React.FC<Props> = () => {
  const openChat = useAppSelector(selectOpenChat);
  const classes = useStyles();

  if (!openChat) return <></>;
  return (
    <div className={classes.openedChat}>
      <OpenedChatHeader chat={openChat} />
    </div>
  );
};

const useStyles = makeStyles({
  openedChat: {
    display: "flex",
    flexDirection: "column",
  },
});

import { makeStyles } from "@material-ui/core";
import { useAppSelector } from "../../app/hooks";
import { RightPanes } from "../RightHomeSidePanes/paneSlice";
import { NewChatPane } from "../NewChatPane";
import { selectCurrentPane } from "../RightHomeSidePanes/paneSlice";
import { AddChatPane } from "../AddChatPane";
import { OpenedChatPane } from "../OpenedChatPane";
import { CallPane } from "../CallPane";

export interface Props {}

export const RightHomeSide: React.FC<Props> = () => {
  const classes = useStyles();
  const CurrentPane = useAppSelector(selectCurrentPane);

  return (
    <div className={classes.main}>
      {CurrentPane === RightPanes.NEW_CHAT_PANE && <NewChatPane />}
      {CurrentPane === RightPanes.ADD_CHAT_PANE && <AddChatPane />}
      {CurrentPane === RightPanes.OPENED_CHAT_PANE && <OpenedChatPane />}
      {CurrentPane === RightPanes.CALL_PANE && <CallPane />}
    </div>
  );
};

const useStyles = makeStyles({
  main: {
    width: "75%",
    height: "calc(5rem + 1rem + 5rem + 1rem + 65vh)",
    marginLeft: "1rem",
    marginRight: "1rem",
    marginTop: "2rem",
  },
});

import { makeStyles } from "@material-ui/core";
import { useAppSelector } from "../../app/hooks";
import { RightPanes } from "../RightHomeSidePanes/paneSlice";
import { NewChatPane } from "../RightHomeSidePanes/NewChatPane";
import { selectCurrentPane } from "../RightHomeSidePanes/paneSlice";
import { AddChatPane } from "../RightHomeSidePanes/AddChatPane";

export interface Props {}

export const RightHomeSide: React.FC<Props> = () => {
  const classes = useStyles();
  const CurrentPane = useAppSelector(selectCurrentPane);

  return (
    <div className={classes.main}>
      {CurrentPane === RightPanes.NEW_CHAT_PANE && <NewChatPane />}
      {CurrentPane === RightPanes.ADD_CHAT_PANE && <AddChatPane />}
    </div>
  );
};

const useStyles = makeStyles({
  main: {
    marginLeft: "1rem",
    width: "75%",
    height: "100%",
  },
});

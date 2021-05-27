import { IconButton, makeStyles } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import AddBoxIcon from "@material-ui/icons/AddBox";
import { useAppDispatch } from "../../app/hooks";
import { goToAddChatPane } from "../RightHomeSidePanes/paneSlice";

export interface Props {}

export const ChatsHead: React.FC<Props> = () => {
  const classes = useStyles();
  const dispatch = useAppDispatch();

  return (
    <div className={classes.main}>
      <h4 className={classes.title}>Chats</h4>
      <div>
        <IconButton style={{ marginRight: "1rem" }} size="small">
          <SearchIcon />
        </IconButton>
        <IconButton onClick={() => dispatch(goToAddChatPane())} size="small">
          <AddBoxIcon />
        </IconButton>
      </div>
    </div>
  );
};

const useStyles = makeStyles({
  main: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "1rem",
  },
  title: { fontSize: "1.2rem", marginLeft: "0.5rem", fontWeight: "normal" },
});

import { IconButton, makeStyles } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import AddBoxIcon from "@material-ui/icons/AddBox";

export interface Props {}

export const ChatsHead: React.FC<Props> = () => {
  const classes = useStyles();

  return (
    <div className={classes.main}>
      <h4 className={classes.title}>Chats</h4>
      <div>
        <IconButton style={{ marginRight: "1rem" }} size="small">
          <SearchIcon />
        </IconButton>
        <IconButton size="small">
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
  title: { fontSize: "1.3rem", fontWeight: "normal" },
});

import { Button, makeStyles } from "@material-ui/core";
import { NewChatSvg } from "../../assets/newChat";
import AddToPhotosIcon from "@material-ui/icons/AddToPhotos";
import { useAppDispatch } from "../../app/hooks";
import { goToAddChatPane } from "../RightHomeSidePanes/paneSlice";

export interface Props {}

export const NewChatPane: React.FC<Props> = () => {
  const classes = useStyles();
  const dispatch = useAppDispatch();

  return (
    <div className={classes.expanded}>
      <div className={classes.svgContainer}>
        <NewChatSvg />
      </div>
      <Button
        onClick={() => {
          dispatch(goToAddChatPane());
        }}
        className={classes.btn}
        startIcon={<AddToPhotosIcon />}
        variant="outlined"
      >
        New Chat
      </Button>
    </div>
  );
};

const useStyles = makeStyles({
  expanded: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  svgContainer: {
    width: "30rem",
    height: "auto",
  },
  btn: {
    backgroundColor: "#26242D",
  },
});

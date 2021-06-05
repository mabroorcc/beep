import { IconButton, makeStyles } from "@material-ui/core";
import { AppMenu } from "../AppMenu";
import CallIcon from "@material-ui/icons/Call";
import { useAppDispatch } from "../../app/hooks";
import { goToCallPane } from "../RightHomeSidePanes/paneSlice";

export interface Props {}
export const SideBarWidget: React.FC<Props> = () => {
  const classes = useStyles();

  return (
    <div className={classes.sbwmain}>
      <AppMenu />
      <CallOption />
    </div>
  );
};

const useStyles = makeStyles((theme) => {
  return {
    sbwmain: {
      width: "100%",
      height: "auto",
      padding: "1rem",
      backgroundColor: theme.palette.background.paper,
      borderRadius: "2rem",
    },
  };
});

const CallOption: React.FC = () => {
  const dispatch = useAppDispatch();

  const handleCallOptClick = () => {
    dispatch(goToCallPane());
  };

  return (
    <IconButton onClick={handleCallOptClick}>
      <CallIcon />
    </IconButton>
  );
};

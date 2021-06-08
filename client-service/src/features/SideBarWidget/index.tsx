import { makeStyles } from "@material-ui/core";
import { AppMenu } from "../AppMenu";

export interface Props {}
export const SideBarWidget: React.FC<Props> = () => {
  const classes = useStyles();

  return (
    <div className={classes.sbwmain}>
      <AppMenu />
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

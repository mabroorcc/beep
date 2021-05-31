import { makeStyles } from "@material-ui/core";
import { SideBarWidget } from "../SideBarWidget";

export interface Props {}
export const SideBar: React.FC<Props> = () => {
  const classes = useStyles();
  return (
    <div className={classes.sidebar}>
      <SideBarWidget />
    </div>
  );
};

const useStyles = makeStyles({
  sidebar: {
    height: "auto",
    width: "5rem",
    marginTop: "2rem",
    marginBottom: "2rem",
    display: "flex",
    flexDirection: "column",
  },
});

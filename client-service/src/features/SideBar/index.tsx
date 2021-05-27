import { makeStyles } from "@material-ui/core";

export interface Props {}
export const SideBar: React.FC<Props> = () => {
  const classes = useStyles();
  return <div className={classes.sidebar}></div>;
};

const useStyles = makeStyles({
  sidebar: {
    height: "10rem",
    width: "5rem",
    backgroundColor: "#23212A",
    borderRadius: "2rem",
    marginTop: "2rem",
    marginBottom: "2rem",
  },
});

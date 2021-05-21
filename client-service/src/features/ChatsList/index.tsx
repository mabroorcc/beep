import { makeStyles } from "@material-ui/core";

export interface Props {}

export const ChatsList: React.FC<Props> = () => {
  const classes = useStyles();

  return <div className={classes.main}></div>;
};

const useStyles = makeStyles({
  main: { margin: "0 1rem" },
});

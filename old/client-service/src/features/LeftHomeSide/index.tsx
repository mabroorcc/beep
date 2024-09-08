import { HomeTopLogo } from "../HomeTopLogo";
import { UserAvatarGroup } from "../UserAvatarGroup";
import { Chats } from "../Chats";
import { makeStyles } from "@material-ui/core";

export interface Props {}

export const LeftHomeSide: React.FC<Props> = () => {
  const classes = useStyles();
  return (
    <div className={classes.leftHomeSide}>
      <HomeTopLogo />
      <UserAvatarGroup />
      <Chats />
    </div>
  );
};

const useStyles = makeStyles({
  leftHomeSide: {
    width: "25%",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    paddingTop: "2rem",
  },
});

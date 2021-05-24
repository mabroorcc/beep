import { IconButton, makeStyles } from "@material-ui/core";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import { TUser } from "../user/types";

export interface Props {
  onAddHandler: (user: TUser) => void;
  user: TUser;
}

export const UserListCard: React.FC<Props> = ({ user, onAddHandler }) => {
  const classes = useStyles();

  return (
    <div className={classes.main}>
      <img className={classes.avatar} src={user.picture} alt="user image" />
      <div className={classes.details}>
        <div className={classes.name}>{user.name}</div>
        <div className={classes.userName}>@{user.userName}</div>
      </div>
      <IconButton onClick={() => onAddHandler(user)} className={classes.btn}>
        <PersonAddIcon />
      </IconButton>
    </div>
  );
};

const useStyles = makeStyles(() => {
  return {
    main: {
      width: "100%",
      height: "3.5rem",
      borderRadius: "0.3rem",
      display: "flex",
      alignItems: "center",
    },
    avatar: {
      borderRadius: "50%",
      objectFit: "cover",
      width: "3rem",
      height: "3rem",
    },
    details: {
      display: "flex",
      flexDirection: "column",
      marginLeft: "1rem",
    },
    name: {
      fontSize: "1rem",
    },
    userName: {
      fontSize: "0.8rem",
      color: "#ccc",
    },
    btn: {
      marginLeft: "auto",
    },
  };
});

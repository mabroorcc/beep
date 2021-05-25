import { Avatar, Chip, makeStyles } from "@material-ui/core";
import { TUser } from "../user/types";

export interface Props {
  users: TUser[];
  onDelete: (user: TUser) => void;
}

export const SelectedListing: React.FC<Props> = ({ users, onDelete }) => {
  const classes = useStyles();

  return (
    <div className={classes.sel_main}>
      {users &&
        users.map((user) => {
          return (
            <Chip
              key={user.id}
              variant="outlined"
              onDelete={onDelete}
              label={"@" + user.userName}
              avatar={<Avatar src={user.picture} />}
            />
          );
        })}
    </div>
  );
};

const useStyles = makeStyles({
  sel_main: {
    minWidth: "100%",
    minHeight: "2.5rem",
    overflowX: "scroll",
    overflowY: "hidden",
    marginBottom: "1rem",
    display: "flex",
    alignItems: "center",
  },
});

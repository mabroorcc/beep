import { Avatar, Chip, makeStyles } from "@material-ui/core";
import { TUser } from "../user/types";

export interface Props {
  users: TUser[];
  onDelete: (user: TUser) => void;
}

export const SelectedListing: React.FC<Props> = ({ users, onDelete }) => {
  const classes = useStyles();

  return (
    <div className={classes.sel_main + " hide_scrollbar"}>
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
    width: "100%",
    overflowX: "scroll",
    marginBottom: "1rem",
  },
});

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
              style={{ marginRight: "0.4rem" }}
              key={user.id}
              variant="outlined"
              onDelete={() => onDelete(user)}
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
    minHeight: "2.5rem",
    marginBottom: "1rem",
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
  },
});

import { makeStyles } from "@material-ui/core";
import { TUser } from "../user/types";
import { UserListCard } from "../UserListCard";

export interface Props {
  onAddHandler: (user: TUser) => void;
  users: TUser[];
}
export const UserListing: React.FC<Props> = ({ users, onAddHandler }) => {
  const classes = useStyles();

  return (
    <div className={classes.main}>
      {users &&
        users.map((user) => {
          return (
            <UserListCard
              key={user.id}
              user={user}
              onAddHandler={onAddHandler}
            />
          );
        })}
    </div>
  );
};

const useStyles = makeStyles({
  main: {
    width: "100%",
  },
});

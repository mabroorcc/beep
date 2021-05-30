import { TUser } from "../user/types";
import AvatarGroup from "@material-ui/lab/AvatarGroup";
import { Avatar, makeStyles } from "@material-ui/core";

export interface Props {
  members: TUser[];
}

export const AllChatMembersAvatarGroup: React.FC<Props> = ({ members }) => {
  const classes = useStyles();

  return (
    <AvatarGroup max={7}>
      {members &&
        members.map((mem) => {
          return (
            <Avatar
              key={mem.id}
              className={classes.avSmall}
              alt={mem.userName}
              src={mem.picture}
            />
          );
        })}
    </AvatarGroup>
  );
};
const useStyles = makeStyles({
  avSmall: {
    width: "1.5rem",
    height: "1.5rem",
  },
});

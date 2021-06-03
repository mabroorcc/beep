import { useState, useEffect } from "react";
import CloseIcon from "@material-ui/icons/Close";
import {
  getUsersWithUserName,
  deleteMemberFromChat,
  addThisMemberToChat,
} from "../api";
import { UserListing } from "../UserListing";
import {
  IconButton,
  DialogActions,
  Dialog,
  TextField,
  makeStyles,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import DoneIcon from "@material-ui/icons/Done";
import { chat } from "../Chats/chatsSlice";
import { TUser } from "../user/types";
import { SelectedListing } from "../SelectedListing";
import { selectUser } from "../user/userSlice";
import { useAppSelector } from "../../app/hooks";

interface Props {
  open: boolean;
  handleClose: () => void;
  chat: chat;
  members: TUser[];
}

export const EditMembersDialog: React.FC<Props> = ({
  open,
  handleClose,
  chat,
  members,
}) => {
  const [selectedUsers, setSelectedUsers] = useState<TUser[]>([]);
  const [userResults, setUserResults] = useState<TUser[]>([]);

  const user = useAppSelector(selectUser);
  const classes = useStyles();

  useEffect(() => {
    if (user) {
      setSelectedUsers(members.filter((mem) => mem.id !== user.id));
    }
  }, [user, members]);

  const handleDeleteMember = (duser: TUser) => {
    if (!user) return;
    const filtered = selectedUsers
      .filter((suser) => suser.id !== user.id)
      .filter((suser) => suser.id !== duser.id);
    setSelectedUsers(filtered);
  };

  const onAddMemberHandler = (member: TUser) => {
    if (user && member.id === user.id) return setUserResults([]);
    for (let suser of selectedUsers) {
      if (suser.id === member.id) {
        return setUserResults(
          userResults.filter((user) => user.id !== member.id)
        );
      }
    }
    setSelectedUsers([...selectedUsers, member]);
    setUserResults([]);
  };

  const handleCancelEditMembers = () => {
    handleClose();
    if (user) {
      setSelectedUsers(members.filter((mem) => mem.id !== user.id));
    }
  };

  const itDoesNotHaveThisUser = (user: TUser, who: TUser[]) => {
    for (let usr of who) {
      if (usr.id === user.id) return false;
    }
    return true;
  };

  const handleDone = () => {
    members.forEach((mem) => {
      if (user && mem.id === user.id) return;
      if (itDoesNotHaveThisUser(mem, selectedUsers)) {
        deleteMemberFromChat(chat.id, mem.id).catch((e) =>
          console.log("/EditMembersDialog", e.message)
        );
      }
    });
    selectedUsers.forEach((suser) => {
      if (user && suser.id === user.id) return;
      if (itDoesNotHaveThisUser(suser, members)) {
        addThisMemberToChat(chat.id, suser.id).catch((e) =>
          console.log("/EditMembersDialog", e.message)
        );
      }
    });
    handleClose();
  };

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const userName = e.target.value;
    if (userName.length < 7) return;
    const users = await getUsersWithUserName(userName);
    if (users) {
      setUserResults(users as TUser[]);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Members</DialogTitle>
      <DialogContent>
        {selectUser.length > 0 && (
          <SelectedListing
            users={selectedUsers}
            onDelete={handleDeleteMember}
          />
        )}
        <TextField
          autoComplete="off"
          onChange={handleSearch}
          className={classes.input}
          id="member-name"
          label="Search Members"
          variant="outlined"
        />
        {userResults && (
          <UserListing users={userResults} onAddHandler={onAddMemberHandler} />
        )}
      </DialogContent>
      <DialogActions>
        <IconButton onClick={handleCancelEditMembers}>
          <CloseIcon />
        </IconButton>
        <IconButton onClick={handleDone}>
          <DoneIcon />
        </IconButton>
      </DialogActions>
    </Dialog>
  );
};

const useStyles = makeStyles({
  input: {
    marginBottom: "1rem",
    backgroundColor: "#23212A",
    width: "20rem",
  },
});

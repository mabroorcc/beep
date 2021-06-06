import { makeStyles, IconButton, Snackbar, TextField } from "@material-ui/core";
import { useContext, useEffect, useState } from "react";
import { TUser } from "../user/types";
import { UserListing } from "../UserListing";
import { SelectedListing } from "../SelectedListing";
import { useAppSelector } from "../../app/hooks";
import CallIcon from "@material-ui/icons/Call";
import { selectUser } from "../user/userSlice";
import {
  checkIfMemberOnline,
  getUserPeerId,
  getUsersWithUserName,
} from "../api";
import { PeerContext } from "../Peer";

export interface Props {}

export const CallPane: React.FC<Props> = () => {
  const classes = useStyles();
  const user = useAppSelector(selectUser);
  const [snack, setSnack] = useState<boolean>(false);
  const [snackMessage, setSnackMessage] = useState<string>("");
  const [selectedUsers, setSelectedUsers] = useState<TUser[]>([]);
  const [userResults, setUserResults] = useState<TUser[]>([]);
  const peer = useContext(PeerContext);

  useEffect(() => {}, []);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const userName = e.target.value;
    if (userName.length < 7) return;
    const users = await getUsersWithUserName(userName);
    if (users) {
      setUserResults(users as TUser[]);
    }
  };

  const handleSnackClose = () => {
    setSnack(false);
  };

  const showMessageOnSnack = (message: string) => {
    setSnackMessage(message);
    setSnack(true);
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
    // check before adding if the user is online
    checkIfMemberOnline(member.id)
      .then((res) => {
        if (res) {
          setSelectedUsers([...selectedUsers, member]);
        } else {
          // show snack bar that user is not online
          showMessageOnSnack("@" + member.userName + " is offline");
        }
      })
      .catch((e) => console.log("/CallPane ", e.message));

    setUserResults([]);
  };

  const handleDeleteMember = (duser: TUser) => {
    if (!user) return;
    const filtered = selectedUsers
      .filter((suser) => suser.id !== user.id)
      .filter((suser) => suser.id !== duser.id);
    setSelectedUsers(filtered);
  };

  const getMedia = () => {
    return navigator.mediaDevices.getUserMedia({ audio: true });
  };

  const handleMakeCall = async () => {
    try {
      const localStream = await getMedia();
      for (let user of selectedUsers) {
        try {
          const result: any = await getUserPeerId(user.id);
          const call = peer.call(result.peerId, localStream, {
            metadata: { callerId: user.id },
          });
          console.log(call);
        } catch (e) {
          console.log("/CallPane makeCall", e);
        }
      }
    } catch (e) {
      console.log("/CallPane handleMakeCall", e);
    }
  };

  return (
    <div className={classes.callpanemain}>
      <div className={classes.content}>
        <div className={classes.panetitle}>Call To</div>
        {selectedUsers.length > 0 && (
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
        {selectedUsers.length > 0 && (
          <div style={{ textAlign: "right", marginTop: "1rem" }}>
            <IconButton onClick={handleMakeCall}>
              <CallIcon />
            </IconButton>
          </div>
        )}
        <Snackbar
          classes={{ root: classes.snack }}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          open={snack}
          onClose={handleSnackClose}
          message={snackMessage}
          key={snackMessage}
        />
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => {
  return {
    callpanemain: {
      width: "100%",
      height: "100%",
      display: "flex",
      justifyContent: "center",
    },
    panetitle: {
      width: "100%",
      fontSize: "1.5rem",
      marginTop: "3rem",
      paddingBottom: "1rem",
    },
    input: {
      marginBottom: "1rem",
      marginTop: "0.5rem",
      backgroundColor: "#23212A",
      borderRadius: 10,
      width: "100%",
    },
    content: {
      width: "35rem",
      display: "flex",
      flexDirection: "column",
    },
    snack: {
      backgroundColor: theme.palette.background.paper,
    },
  };
});

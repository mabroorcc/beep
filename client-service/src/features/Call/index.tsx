import { TUser } from "../../features/user/types";
import { getOneUserWithId } from "../../features/api";
import { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import { IconButton, makeStyles } from "@material-ui/core";
import CallIcon from "@material-ui/icons/Call";
import CallEndIcon from "@material-ui/icons/CallEnd";

interface Props {
  call: Peer.MediaConnection;
  setCall: (call: any) => void;
}

export const Call: React.FC<Props> = ({ call, setCall }) => {
  const [caller, setCaller] = useState<TUser>();
  const audio = useRef<HTMLAudioElement>(null);
  const classes = useStyles();
  //const audio = useRef<HTMLAudioElement>(null);

  const handleCancelCall = () => {
    call.close();
    if (audio.current) audio.current.pause();
    setCall(undefined);
  };

  const handleAcceptCall = () => {
    // here first you get userMedia then you answer the call
    if (audio.current) audio.current.pause();
  };

  useEffect(() => {
    const callerId = call.metadata.callerId;
    if (!callerId) return;
    getOneUserWithId(callerId)
      .then((user) => {
        setCaller(user);
        if (audio.current) {
          audio.current.volume = 0.5;
        }
      })
      .catch((e) => console.log("/home call", e));
  }, [call]);

  if (!call.metadata.callerId) return <></>;
  if (!caller) return <></>;

  return (
    <div className={classes.backdrop}>
      <audio
        ref={audio}
        src="https://d6cp9b00-a.akamaihd.net/downloads/ringtones/files/mp3/7120-download-iphone-6-original-ringtone-42676.mp3"
        autoPlay
        loop
      ></audio>
      <div className={classes.callbox}>
        <img className={classes.avatar} src={caller.picture} />
        <div className={classes.userName}>@{caller.userName} is calling...</div>
        <IconButton
          onClick={handleAcceptCall}
          style={{ marginLeft: "auto", marginRight: "0.5rem" }}
          classes={{ root: classes.callBtn }}
        >
          <CallIcon />
        </IconButton>
        <IconButton
          onClick={handleCancelCall}
          classes={{ root: classes.callEndBtn }}
        >
          <CallEndIcon />
        </IconButton>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => {
  return {
    backdrop: {
      background: theme.palette.background.default + "cc",
      width: "100vw",
      height: "100vh",
      position: "fixed",
      top: 0,
      left: 0,
      display: "grid",
      zIndex: 999,
      placeItems: "center",
    },
    callbox: {
      width: "25rem",
      height: "5rem",
      padding: "1rem",
      backgroundColor: theme.palette.background.paper,
      borderRadius: "2rem",
      display: "flex",
      alignItems: "center",
    },
    avatar: {
      borderRadius: "50%",
      height: "100%",
      objectFit: "cover",
    },
    userName: {
      marginLeft: "1rem",
      fontSize: "1rem",
    },
    callBtn: {
      backgroundColor: "#00aa00",
    },
    callEndBtn: {
      backgroundColor: "red",
    },
  };
});

import { IconButton, makeStyles } from "@material-ui/core";
import { chat } from "../Chats/chatsSlice";
import ToggleButton from "@material-ui/lab/ToggleButton";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import { useOpenedChatTextBox } from "./useOpenedChatTextBox";
import SendIcon from "@material-ui/icons/Send";
import { Progress } from "../Progress";
import { selectUpload } from "../FileUpload/uploadSlice";
import { useAppSelector } from "../../app/hooks";

export interface Props {
  chat: chat;
}

export const OpenedChatTextBox: React.FC<Props> = ({ chat }) => {
  const classes = useStyles();
  const uploadData = useAppSelector(selectUpload);
  const {
    file,
    loading,
    handleAttachmentClick,
    message,
    onMessageChange,
    onMessageKeyPress,
    sendMessageBtnHandler,
  } = useOpenedChatTextBox(chat);

  return (
    <div className={classes.openchattextbox}>
      <ToggleButton
        value="haha"
        selected={file ? true : false}
        onClick={handleAttachmentClick}
        className={classes.attachmentbtn}
      >
        <AttachFileIcon />
      </ToggleButton>
      <input
        disabled={uploadData.progress > 1}
        value={message}
        onKeyPress={onMessageKeyPress}
        onChange={onMessageChange}
        placeholder="Enter Message"
        className={classes.textinput}
        type="text"
      />
      {loading ? (
        <Progress val={uploadData.progress} />
      ) : (
        <IconButton
          onClick={sendMessageBtnHandler}
          className={classes.sendtextbtn}
        >
          <SendIcon />
        </IconButton>
      )}
    </div>
  );
};

const useStyles = makeStyles((theme) => {
  return {
    openchattextbox: {
      width: "100%",
      height: "5rem",
      borderRadius: "2rem",
      backgroundColor: theme.palette.background.paper,
      padding: "1rem",
      display: "flex",
      position: "relative",
    },
    attachmentbtn: {
      borderRadius: "50%",
    },
    textinput: {
      marginLeft: "1rem",
      backgroundColor: theme.palette.background.paper,
      border: "none",
      outline: "none",
      fontSize: "1rem",
      color: "white",
      flexGrow: 1,
    },
    sendtextbtn: {
      marginLeft: "1rem",
    },
    loading: {
      position: "absolute",
      bottom: "110%",
    },
  };
});

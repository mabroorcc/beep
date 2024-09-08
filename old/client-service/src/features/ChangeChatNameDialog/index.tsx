import { useState } from "react";
import TextField from "@material-ui/core/TextField";
import CloseIcon from "@material-ui/icons/Close";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import { IconButton, makeStyles } from "@material-ui/core";
import DialogContent from "@material-ui/core/DialogContent";
import DoneIcon from "@material-ui/icons/Done";
import DialogTitle from "@material-ui/core/DialogTitle";
import { chat } from "../Chats/chatsSlice";
import { changeChatName } from "../api";

interface Props {
  open: boolean;
  handleClose: () => void;
  chat: chat;
}

export const ChangeChatNameDialog: React.FC<Props> = ({
  open,
  handleClose,
  chat,
}) => {
  const [chatName, setChatName] = useState(chat.name);
  const classes = useStyles();

  const handlChangeChatName = () => {
    if (chat.name === chatName) return handleClose();
    handleClose();
    changeChatName(chat.id, chatName).catch((e) =>
      console.log("/ChangeChatNameDialog ", e.message)
    );
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Chat Name</DialogTitle>
      <DialogContent>
        <TextField
          className={classes.input}
          value={chatName}
          onChange={(e) => {
            setChatName(e.target.value);
          }}
          autoFocus
          variant="outlined"
          id="name"
          label="Chat Name"
          autoComplete="off"
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
        <IconButton onClick={handlChangeChatName}>
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
    borderRadius: 16,
    width: "100%",
  },
});

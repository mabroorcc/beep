import { useState } from "react";
import TextField from "@material-ui/core/TextField";
import CloseIcon from "@material-ui/icons/Close";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import { IconButton } from "@material-ui/core";
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
          value={chatName}
          onChange={(e) => {
            setChatName(e.target.value);
          }}
          autoFocus
          variant="outlined"
          margin="dense"
          id="name"
          label="Chat Name"
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
